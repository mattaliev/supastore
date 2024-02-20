from django.db import models
from core.models import BaseEntity

__all__ = [
    "PaymentStatusChoices",
    "Invoice"
]


class PaymentStatusChoices(models.TextChoices):
    PENDING = "PENDING", "pending"
    PAID = "PAID", "paid"
    FAILED = "FAILED", "failed"
    EXPIRED = "EXPIRED", "expired"


class Invoice(BaseEntity):
    telegram_invoice_id = models.BigIntegerField()

    user = models.ForeignKey(
        "user.TelegramUser",
        on_delete=models.CASCADE,
        related_name="invoices",
        blank=True,
        null=True
    )

    order = models.OneToOneField(
        "order.Order",
        on_delete=models.CASCADE,
        related_name="invoices",
    )

    currency_code = models.CharField(
        max_length=4,
        default="USDT"
    )

    auto_conversion_currency_code = models.CharField(
        max_length=4,
        default="USDT",
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    payment_status = models.CharField(
        max_length=50,
        choices=PaymentStatusChoices.choices,
        default=PaymentStatusChoices.PENDING
    )

    payment_link = models.URLField(
        max_length=200
    )

    direct_payment_link = models.URLField(
        max_length=200
    )

    expiration_date = models.DateTimeField(
        blank=True,
        null=True
    )

    class Meta:
        db_table = "invoice"
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"
        ordering = ["-created"]
