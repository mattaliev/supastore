import logging

from django.conf import settings

from telegram.services import telegram_shop_message_send
from telegram.services.shop.commands import telegram_command_process
from telegram.services.shop.inline_buttons import telegram_callback_query_process
from telegram.services.shop.states import telegram_user_state_process


__all__ = [
    "telegram_shop_request_process"
]


def telegram_shop_request_process(body: dict) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Processing telegram shop update")

    try:
        message = body["message"]
        user = message["from"]
        chat_id = message["chat"]["id"]
        chat_type = message["chat"]["type"]
        text = message["text"]
        callback_query = body.get("callback_query")

        # For now, lets ignore the messages that are sent in groups or supergroups
        if chat_type in ["group", "supergroup"]:
            return

        if text and text.startswith("/"):
            telegram_command_process(
                user=user,
                chat_id=chat_id,
                command=text
            )
            return

        if text:
            telegram_user_state_process(
                user=user,
                chat_id=chat_id,
                message=text
            )
            return

        if callback_query:
            telegram_callback_query_process(
                user=user,
                chat_id=chat_id,
                callback_query=callback_query
            )
            return

        telegram_shop_message_send(
            chat_id=chat_id,
            text="I'm sorry, I don't understand what you're saying. Please look at the /help command"
        )
        logger.debug("Telegram shop message processed", {"body": body})
    except Exception as e:
        logger.error(
            "Error processing telegram shop request. Error: %(error)s",
            {
                "body": body,
                "error": e
            }
        )



