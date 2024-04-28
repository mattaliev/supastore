import json
import logging

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from telegram.services.shop.bot import telegram_shop_request_process
from telegram.services.support.bot import telegram_support_request_process


# Create your views here.

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
