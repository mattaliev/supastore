import logging
from uuid import UUID
import requests
from django.contrib.auth import get_user_model
from django.contrib.sites import requests
from django.conf import settings

from order.models import Order

from invoice.models import Invoice

User = get_user_model()


def invoice_create(
    *,
    order_id: UUID,
    user_id: UUID,
    currency_code: str = "USDT",
    auto_conversion_currency_code: str = "USDT",
    **kwargs
) -> Invoice:
    logger = logging.getLogger(__name__)
    logger.debug("Creating invoice", {"order_id": order_id})

    order = Order.objects.filter(pk=order_id).first()
    user = User.objects.filter(pk=user_id).first()

    if not order or not user:
        logger.warning("Order or user not found", {"order_id": order_id, "user_id": user_id})
        raise ValueError("Order or user not found")

    telegram_invoice = telegram_invoice_request(
        user=user,
        order=order,
        currency_code=currency_code,
        auto_conversion_currency_code=auto_conversion_currency_code
    )

    invoice = Invoice(
        user=user,
        order=order,
        amount=order.totalAmount,
        telegram_invoice_id=telegram_invoice["data"]["id"],
        currency_code=telegram_invoice["data"]["currencyCode"],
        auto_conversion_currency_code=telegram_invoice["data"]["autoConversionCurrencyCode"],
        payment_link=telegram_invoice["data"]["payLink"],
        direct_payment_link=telegram_invoice["data"]["directPayLink"],
        expiration_date=telegram_invoice["data"]["expirationDate"]
    )
    invoice.save()

    logger.debug("Invoice created", {"invoice_id": invoice.id})

    return invoice


def telegram_invoice_request(
    *,
    user: User,
    order: Order,
    currency_code: str,
    auto_conversion_currency_code: str
) -> dict:
    logger = logging.getLogger(__name__)
    logger.debug("Creating telegram invoice", {"order_id": order.id})

    success_url = f"{settings.FRONTEND_CLIENT_URL}/checkout/payment/success?orderId={order.id}"
    fail_url = f"{settings.FRONTEND_CLIENT_URL}/checkout/payment/failed?orderId={order.id}"

    invoice_data = {
        "amount": {
            "currencyCode": currency_code,
            "amount": order.total_amount
        },
        "autoConversionCurrencyCode": auto_conversion_currency_code,
        "description": "Order payment",
        "returnUrl": success_url,
        "failReturnUrl": fail_url,
        "externalId": str(order.id),
        "timeoutSeconds": 10800,  # 3 hours
        "customerTelegramId": user.telegram_id
    }

    invoice_headers = {
        "Wpay-Store-Api-Key": settings.TELEGRAM_WALLET_API_KEY
    }

    invoice_response = requests.post(settings.TELEGRAM_WALLET_PAY_URL, data=invoice_data, headers=invoice_headers)

    if invoice_response.status_code != 200:
        logger.warning("Telegram wallet request failed", {
            "status_code": invoice_response.status_code,
            "body": invoice_response.text
        })
        raise ValueError("Telegram wallet request failed")

    logger.warning("Telegram wallet request success", {"status_code": invoice_response.status_code})
    invoice_data = invoice_response.json()

    return invoice_data
