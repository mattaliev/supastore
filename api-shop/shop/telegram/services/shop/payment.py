import json
import logging
import hmac
import hashlib
import base64

import requests
from django.conf import settings
from django.contrib.auth import get_user_model

from order.models import Order
from order.services import order_payment_status_update

User = get_user_model()

__all__ = [
    "telegram_invoice_request",
    "payment_webhook_process",
    "compute_signature"
]


def telegram_invoice_request(
        *,
        user: User,
        order: Order,
        currency_code: str,
        auto_conversion_currency_code: str
) -> dict:
    logger = logging.getLogger(__name__)
    logger.debug("Creating telegram invoice", {"order_id": order.id})

    success_url = f"{settings.TELEGRAM_PAYMENT_RETURN_URL}?startapp=checkout_payment_success__orderId_{order.id}"
    fail_url = f"{settings.TELEGRAM_PAYMENT_RETURN_URL}?startapp=checkout_payment_failed__orderId_{order.id}"
    wallet_pay_url = f"{settings.TELEGRAM_WALLET_PAY_URL}/wpay/store-api/v1/order"

    invoice_data = {
        "amount": {
            "currencyCode": "USD",
            "amount": 0.1
        },
        "autoConversionCurrency": auto_conversion_currency_code,
        "description": "Order payment",
        "returnUrl": success_url,
        "failReturnUrl": fail_url,
        "externalId": str(order.id),
        "timeoutSeconds": 10800,
        "customerTelegramUserId": user.telegram_id
    }

    invoice_data_json = json.dumps(invoice_data)

    invoice_headers = {
        "Wpay-Store-Api-Key": settings.TELEGRAM_WALLET_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    invoice_response = requests.post(wallet_pay_url, data=invoice_data_json, headers=invoice_headers)

    logger.debug("Telegram wallet request", {"status_code": invoice_response.text})

    if invoice_response.status_code != 200:
        logger.warning("Telegram wallet request failed", {
            "status_code": invoice_response.status_code,
            "body": invoice_response.text
        })
        raise ValueError("Telegram wallet request failed")

    logger.warning("Telegram wallet request success", {"status_code": invoice_response.status_code})
    invoice_data = invoice_response.json()
    logger.debug("Telegram wallet response", {"invoice_data": invoice_data})

    return invoice_data


def payment_webhook_process(*, http_method, uri_path, timestamp, body, signature):
    computed_signature = compute_signature(http_method, uri_path, timestamp, body)
    print("Computed signature", computed_signature)
    if not hmac.compare_digest(signature, computed_signature):
        raise ValueError("Invalid signature")

    body = json.loads(body)

    for event in body:
        order_payment_status_update(order_id=event["payload"]["externalId"], status=event["type"])


def compute_signature(http_method, uri_path, timestamp, body):
    base64_body = base64.b64encode(body.encode()).decode()
    string_to_sign = f"{http_method}.{uri_path}.{timestamp}.{base64_body}"
    signature = hmac.new(settings.TELEGRAM_WALLET_API_KEY.encode(), string_to_sign.encode(), hashlib.sha256)
    return base64.b64encode(signature.digest()).decode()
