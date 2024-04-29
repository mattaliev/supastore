import json
import logging

import requests
from django.conf import settings

from core.utils.encryption import decrypt
from payment.models import Payment

WALLET_PAY_URL = "https://pay.wallet.tg"

__all__ = [
    "wallet_pay_invoice_get",
    "wallet_pay_webhook_process"
]


def wallet_pay_invoice_get(
        *,
        payment: Payment,
) -> dict:
    logger = logging.getLogger(__name__)
    logger.debug(
        "Creating telegram wallet invoice. Payment id: %(payment_id)s", {
            "payment_id": payment.id
        }
    )

    wallet_pay_api_key = decrypt(
        payment.payment_method.other_info.get("api_key")
    )
    auto_conversion_currency_code = payment.payment_method.other_info.get(
        "auto_conversion_currency_code"
    )

    success_url = f"{settings.TELEGRAM_PAYMENT_RETURN_URL}?startapp=checkout_payment_success__paymentId_{payment.id}"
    fail_url = f"{settings.TELEGRAM_PAYMENT_RETURN_URL}?startapp=checkout_payment_failed__paymentId_{payment.id}"
    wallet_pay_url = f"{WALLET_PAY_URL}/wpay/store-api/v1/order"

    invoice_data = {
        "amount": {
            "currencyCode": "USD",
            "amount": 0.1
        },
        "autoConversionCurrency": auto_conversion_currency_code,
        "description": "Order " + str(payment.order.order_number),
        "returnUrl": success_url,
        "failReturnUrl": fail_url,
        "externalId": str(payment.id),
        "timeoutSeconds": 10800,  # 3 hours
        "customerTelegramUserId": payment.order.user.telegram_id
    }

    invoice_data_json = json.dumps(invoice_data)

    invoice_headers = {
        "Wpay-Store-Api-Key": wallet_pay_api_key,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    invoice_response = requests.post(
        wallet_pay_url,
        data=invoice_data_json,
        headers=invoice_headers
    )

    if invoice_response.status_code != 200:
        logger.warning(
            "Wallet Pay request failed. Status: %(status_code)s Body: %(body)s",
            {
                "status_code": invoice_response.status_code,
                "body": invoice_response.text
            })
        raise ValueError("Wallet Pay request failed")

    logger.debug("Wallet Pay request success!")

    invoice_data = invoice_response.json()
    return invoice_data["data"]
