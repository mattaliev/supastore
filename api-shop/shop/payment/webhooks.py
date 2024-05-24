import base64
import hashlib
import hmac
import json
import logging
from uuid import UUID

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from core.utils.encryption import decrypt
from payment.models import PaymentStatusChoices, Payment
from payment.services.payment_services import payment_status_update


@csrf_exempt
def wallet_pay_webhook(request):
    logger = logging.getLogger(__name__)
    logger.debug("Payment webhook request")
    try:
        if request.method == 'POST':
            wallet_pay_webhook_process(
                http_method=request.method,
                uri_path=request.path,
                timestamp=request.headers.get('WalletPay-Timestamp'),
                body=request.body.decode('utf-8'),
                signature=request.headers.get('WalletPay-Signature')
            )
            return JsonResponse({"success": True}, status=200)
        return JsonResponse({"error": "Method not allowed"}, status=405)
    except Exception as e:
        logger.debug("Payment webhook request failed. Error: %(error)s",
                     {"error": str(e)})
        return JsonResponse({"error": str(e)}, status=400)


def wallet_pay_webhook_process(
        *,
        http_method,
        uri_path,
        timestamp,
        body,
        signature
):
    payment = Payment.objects.get(pk=UUID(body[0]["payload"]["externalId"]))
    api_key = decrypt(payment.payment_method.other_info.get("api_key"))

    computed_signature = compute_signature(
        http_method,
        uri_path,
        timestamp,
        body,
        api_key
    )

    if not hmac.compare_digest(signature, computed_signature):
        raise ValueError("Invalid signature")

    body = json.loads(body)

    for event in body:
        if event["type"] == "ORDER_PAID":
            payment_status_update(
                payment_id=event["payload"]["externalId"],
                payment_status=PaymentStatusChoices.PAID,
                notify_customer=True
            )
        elif event["type"] == "ORDER_FAILED":
            payment_status_update(
                payment_id=event["payload"]["externalId"],
                payment_status=PaymentStatusChoices.EXPIRED,
                notify_customer=True
            )


def compute_signature(http_method, uri_path, timestamp, body, api_key):
    base64_body = base64.b64encode(body.encode()).decode()
    string_to_sign = f"{http_method}.{uri_path}.{timestamp}.{base64_body}"
    signature = hmac.new(
        api_key.encode(),
        string_to_sign.encode(), hashlib.sha256
    )
    return base64.b64encode(signature.digest()).decode()
