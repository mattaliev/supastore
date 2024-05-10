from decimal import Decimal

from django.db import models
from django.utils import timezone

from core.models import BaseEntity

__all__ = [
    "PaymentStatusChoices",
    "CurrencyChoices",
    "PaymentProviderChoices",
    "PaymentMethod",
    "Payment"
]


class PaymentStatusChoices(models.TextChoices):
    UNPAID = "UNPAID", "unpaid"
    PAID = "PAID", "paid"
    REFUNDED = "REFUNDED", "refunded"
    EXPIRED = "EXPIRED", "expired"


class CurrencyChoices(models.TextChoices):
    RUB = "RUB", "RUB"
    AED = "AED", "AED"
    USD = "USD", "USD"
    IDR = "IDR", "IDR"
    USDT = "USDT", "USDT"


class PaymentProviderChoices(models.TextChoices):
    WALLET_PAY = "WALLET_PAY", "WALLET_PAY"
    TELEGRAM_INVOICE = "TELEGRAM_INVOICE", "TELEGRAM_INVOICE"
    BANK_TRANSFER = "BANK_TRANSFER", "BANK_TRANSFER"
    CRYPTO_TRANSFER = "CRYPTO_TRANSFER", "CRYPTO_TRANSFER"


# Currently supported payment methods
# * Wallet Pay
# * Telegram invoice
# * Bank Transfer
# * Crypto Transfer
class PaymentMethod(BaseEntity):
    name = models.CharField(max_length=50)
    provider = models.CharField(
        max_length=25,
        choices=PaymentProviderChoices.choices
    )
    # Additional info depending on the payment method
    # For example, for Wallet Pay:
    # {
    #   "auto_conversion_currency_code": "auto_conversion_currency_code",
    #   "api_key": "api_key",
    # }
    # For Crypto Transfer:
    # {
    #   "address": "address",
    #   "network": "network"
    # }
    # For Bank Transfer:
    # {
    #   "message": "message with all the information from store admin.
    #   It is too difficult to generalize it",
    # }
    # For Telegram Payment providers:
    # {
    #   "provider_token": "provider_token",
    # }

    other_info = models.JSONField(null=True, blank=True)
    button_text = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = "payment_method"
        verbose_name = "payment method"
        verbose_name_plural = "payment methods"
        ordering = ["-created"]


class Payment(BaseEntity):
    order = models.OneToOneField(
        "order.Order",
        on_delete=models.SET_NULL,
        related_name="payment",
        blank=True,
        null=True
    )
    payment_method = models.ForeignKey(
        "payment.PaymentMethod",
        on_delete=models.SET_NULL,
        related_name="payments",
        null=True,
        blank=True
    )
    payment_status = models.CharField(
        max_length=50,
        choices=PaymentStatusChoices.choices,
        default=PaymentStatusChoices.UNPAID
    )
    subtotal_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    shipping_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00")
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    currency = models.CharField(
        max_length=4,
        choices=CurrencyChoices.choices,
        default=CurrencyChoices.USD
    )
    transaction_id = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )
    payment_date = models.DateTimeField(null=True, blank=True)
    payment_expiry = models.DateTimeField(null=True, blank=True)
    # Additional info depending on the payment method
    #
    # Wallet Pay:
    # {
    #    "user_id": "user_id",
    #    "payment_link": "payment_link",
    #    "direct_payment_link": "direct_payment_link",
    # }
    #
    # Telegram invoice providers:
    # {
    #    "payment_link": "payment_link"
    # }
    additional_info = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = "payment"
        verbose_name = "payment"
        verbose_name_plural = "payments"
        ordering = ["-created"]

    def is_expired(self):
        return self.payment_expiry < timezone.now() if self.payment_expiry else False

    def is_expired_or_will_expire_soon(self):
        return (
                       self.payment_expiry - timezone.now()
               ).seconds < 1800 if self.payment_expiry else False
