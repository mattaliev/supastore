import json
import logging

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from telegram.services.shop.bot import telegram_shop_request_process
from telegram.services.shop.payment import payment_webhook_process
from telegram.services.support.bot import telegram_support_request_process


# Create your views here.

@csrf_exempt
def payment_webhook_request(request):
    logger = logging.getLogger(__name__)
    logger.debug("Payment webhook request")

    if request.method == 'POST':
        http_method = request.method
        uri_path = request.path
        timestamp = request.headers.get('WalletPay-Timestamp')
        body = request.body.decode('utf-8')
        signature = request.headers.get('WalletPay-Signature')

        try:
            payment_webhook_process(
                http_method=http_method,
                uri_path=uri_path,
                timestamp=timestamp,
                body=body,
                signature=signature
            )
            return JsonResponse({"success": True}, status=200)
        except Exception as e:
            logger.debug("Payment webhook request failed. Error: %(error)s", {"error": str(e)})
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def telegram_shop_update(request):
    logger = logging.getLogger(__name__)
    logger.debug("Telegram shop update received")

    body = json.loads(request.body)

    logger.debug("Update body: %(body)s", {"body": body})

    telegram_shop_request_process(body)

    return JsonResponse({"success": True}, status=200)


@csrf_exempt
def telegram_support_update(request):
    logger = logging.getLogger(__name__)
    logger.debug("Telegram support update received")

    body = json.loads(request.body)

    logger.debug("Update body: %(body)s", {"body": body})

    telegram_support_request_process(body)

    return JsonResponse({"success": True}, status=200)

