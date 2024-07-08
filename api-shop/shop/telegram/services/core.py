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
    "telegram_create_invoice_link",
    "telegram_support_message_send",
    "telegram_support_message_forward",
]

from core.utils.encryption import decrypt

from payment.models import Payment


def telegram_request_send(*, bot_token: str, method: str, data: dict) -> dict:
    """
    Send a response to the telegram API

    :param bot_token: the bot token
    :param method: any of the telegram API methods
    :param data: data associated with the method. Chat ID is required
    :return: None
    """

    logger = logging.getLogger(__name__)
    logger.debug("Sending telegram request. Method: %(method)s",
                 {"method": method})

    url = f"{settings.TELEGRAM_API_URL}/bot{bot_token}/{method}"

    try:
        response = requests.post(url, data=data)
        body = json.loads(response.text)

        if response.status_code != 200:
            raise TelegramResponseError(error_code=body["error_code"],
                                        description=body["description"])

        return body
    except requests.exceptions.RequestException:
        raise TelegramResponseError(error_code=500,
                                    description="Telegram API request failed")


def telegram_message_send(
        *,
        bot_token: str,
        chat_id: int,
        text: str,
        reply_markup: [dict] = None,
        parse_mode: str | None = "MarkdownV2"
) -> bool:
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
        telegram_request_send(bot_token=bot_token, method="sendMessage",
                              data=data)
        logger.debug("Telegram message send success!")
        return True
    except TelegramResponseError as e:
        logger.error("Telegram message send failed. Error: %(error)s",
                     {"error": e.message})
        return False


def telegram_webhook_set(*, bot_token: str, url: str) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Setting telegram webhook...")

    data = {
        "url": url
    }

    try:
        telegram_request_send(bot_token=bot_token, method="setWebhook",
                              data=data)
        logger.debug("Telegram webhook set success!")
    except TelegramResponseError as e:
        logger.error("Telegram webhook set failed. Error: %(error)s",
                     {"error": e.message})


def telegram_message_forward(*, bot_token: str, chat_id: int, from_chat_id: int,
                             message_id: int) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Forwarding telegram message...")

    data = {
        "chat_id": chat_id,
        "from_chat_id": from_chat_id,
        "message_id": message_id
    }

    try:
        telegram_request_send(bot_token=bot_token, method="forwardMessage",
                              data=data)
        logger.debug("Telegram message forwarded")
    except TelegramResponseError as e:
        logger.error("Telegram message forward failed. Error: %(error)s",
                     {"error": e.message})


def telegram_create_invoice_link(
        *,
        bot_token: str,
        payment: Payment
) -> str:
    logger = logging.getLogger(__name__)
    logger.debug("Creating telegram invoice link...")

    prices = [
        {
            "label": "Subtotal amount",
            "amount": int(payment.subtotal_amount * 100)
        },
        {
            "label": "Delivery amount",
            "amount": int(payment.shipping_amount * 100)
        },
    ]

    data = {
        "title": f"Order {payment.order.order_number}",
        "description": "\n".join(
            [item.product.title for item in payment.order.cart.items.all()]),
        "payload": str(payment.id),
        "provider_token": decrypt(
            payment.payment_method.other_info.get("provider_token")),
        "currency": payment.currency,
        "prices": json.dumps(prices)
    }
    try:
        body = telegram_request_send(
            bot_token=bot_token,
            method="createInvoiceLink",
            data=data
        )
        logger.debug("Telegram invoice link created")
        return body["result"]

    except TelegramResponseError as e:
        logger.error("Telegram invoice link creation failed. Error: %(error)s",
                     {"error": e.message})


def telegram_support_message_send(*, chat_id: int, text: str,
                                  reply_markup: [dict] = None) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Sending telegram support message")
    telegram_message_send(
        bot_token=settings.TELEGRAM_SUPPORT_TOKEN,
        chat_id=chat_id,
        text=text,
        reply_markup=reply_markup,
        parse_mode=None
    )


def telegram_support_message_forward(*, chat_id: int, from_chat_id: int,
                                     message_id: int) -> None:
    logger = logging.getLogger(__name__)
    logger.disabled = False
    logger.debug("Forwarding telegram support message...")

    logger.debug("Chat id: %(chat_id)s", {"chat_id": chat_id})
    logger.debug("From chat id: %(from_chat_id)s",
                 {"from_chat_id": from_chat_id})
    logger.debug("Message id: %(message_id)s", {"message_id": message_id})

    telegram_message_forward(
        bot_token=settings.TELEGRAM_SUPPORT_TOKEN,
        chat_id=chat_id,
        from_chat_id=from_chat_id,
        message_id=message_id
    )

