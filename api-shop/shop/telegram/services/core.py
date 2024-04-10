import json
import logging

import requests
from django.conf import settings

from core.exceptions import TelegramResponseError


__all__ = [
    "telegram_request_send",
    "telegram_message_send",
    "telegram_webhook_set",
    "telegram_message_forward",
    "telegram_shop_message_send",
    "telegram_support_message_send",
    "telegram_shop_webhook_set",
    "telegram_support_webhook_set",
    "telegram_support_message_forward"
]


def telegram_request_send(*, bot_token: str, method: str, data: dict) -> None:
    """
    Send a response to the telegram API

    :param bot_token: the bot token
    :param method: any of the telegram API methods
    :param data: data associated with the method. Chat ID is required
    :return: None
    """

    logger = logging.getLogger(__name__)
    logger.debug("Sending telegram request. Method: %(method)s", {"method": method})

    url = f"{settings.TELEGRAM_API_URL}/bot{bot_token}/{method}"

    try:
        response = requests.post(url, data=data)

        if response.status_code != 200:
            body = json.loads(response.text)
            raise TelegramResponseError(error_code=body["error_code"], description=body["description"])
    except requests.exceptions.RequestException:
        raise TelegramResponseError(error_code=500, description="Telegram API request failed")


def telegram_message_send(
        *,
        bot_token: str,
        chat_id: int,
        text: str,
        reply_markup: [dict] = None,
        parse_mode: str | None = "MarkdownV2"
) -> None:
    logger = logging.getLogger(__name__)
    logger.disabled = False
    logger.debug("Telegram sending message...")

    inline_keyboard = json.dumps({
        "inline_keyboard": reply_markup
    }) if reply_markup else None

    data = {
        "chat_id": chat_id,
        "text": text,
        "reply_markup": inline_keyboard,
        "parse_mode": parse_mode
    }

    try:
        telegram_request_send(bot_token=bot_token, method="sendMessage", data=data)
        logger.debug("Telegram message send success!")
    except TelegramResponseError as e:
        logger.error("Telegram message send failed. Error: %(error)s", {"error": e.message})


def telegram_webhook_set(*, bot_token: str, url: str) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Setting telegram webhook...")

    data = {
        "url": url
    }

    try:
        telegram_request_send(bot_token=bot_token, method="setWebhook", data=data)
        logger.debug("Telegram webhook set success!")
    except TelegramResponseError as e:
        logger.error("Telegram webhook set failed. Error: %(error)s", {"error": e.message})


def telegram_message_forward(*, bot_token: str, chat_id: int, from_chat_id: int, message_id: int) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Forwarding telegram message...")

    data = {
        "chat_id": chat_id,
        "from_chat_id": from_chat_id,
        "message_id": message_id
    }

    try:
        telegram_request_send(bot_token=bot_token, method="forwardMessage", data=data)
        logger.debug("Telegram message forwarded")
    except TelegramResponseError as e:
        logger.error("Telegram message forward failed. Error: %(error)s", {"error": e.message})


def telegram_shop_message_send(
        *,
        chat_id: int,
        text: str,
        reply_markup: [dict] = None,
        parse_mode: str | None = "MarkdownV2"
) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Sending telegram shop message")
    telegram_message_send(
        bot_token=settings.TELEGRAM_SHOP_TOKEN,
        chat_id=chat_id,
        text=text,
        reply_markup=reply_markup,
        parse_mode=parse_mode
    )


def telegram_support_message_send(*, chat_id: int, text: str, reply_markup: [dict] = None) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Sending telegram support message")
    telegram_message_send(
        bot_token=settings.TELEGRAM_SUPPORT_TOKEN,
        chat_id=chat_id,
        text=text,
        reply_markup=reply_markup,
        parse_mode=None
    )


def telegram_shop_webhook_set() -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Setting telegram shop webhook...")

    if not settings.SERVICE_URL:
        logger.warning("Couldn't set telegram shop webhook URL, SERVICE_URL is not provided")
        return

    url = f"{settings.SERVICE_URL}/webhooks/telegram/shop/sendUpdate/"

    telegram_webhook_set(
        bot_token=settings.TELEGRAM_SHOP_TOKEN,
        url=url
    )


def telegram_support_webhook_set() -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Setting telegram support webhook...")

    if not settings.SERVICE_URL:
        logger.warning("Couldn't set telegram support webhook URL, SERVICE_URL is not provided")
        return

    url = f"{settings.SERVICE_URL}/webhooks/telegram/support/sendUpdate/"

    telegram_webhook_set(
        bot_token=settings.TELEGRAM_SUPPORT_TOKEN,
        url=url
    )


def telegram_support_message_forward(*, chat_id: int, from_chat_id: int, message_id: int) -> None:
    logger = logging.getLogger(__name__)
    logger.disabled = False
    logger.debug("Forwarding telegram support message...")

    logger.debug("Chat id: %(chat_id)s", {"chat_id": chat_id})
    logger.debug("From chat id: %(from_chat_id)s", {"from_chat_id": from_chat_id})
    logger.debug("Message id: %(message_id)s", {"message_id": message_id})

    telegram_message_forward(
        bot_token=settings.TELEGRAM_SUPPORT_TOKEN,
        chat_id=chat_id,
        from_chat_id=from_chat_id,
        message_id=message_id
    )


