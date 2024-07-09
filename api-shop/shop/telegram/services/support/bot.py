import logging
from uuid import UUID

from core.utils.encryption import decrypt
from store.models import Store, StoreSupportBot
from store.services import store_support_chat_id_get
from telegram.services.core import (
    telegram_message_send,
    telegram_message_forward
)


def telegram_support_request_process(*, store_id: UUID, body: dict) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Processing telegram support update")

    try:
        message = body["message"]
        message_thread_id = message["message_thread_id"] if "message_thread_id" in message else None
        chat_id = message["chat"]["id"]
        chat_type = message["chat"]["type"]
        text = message["text"]

        store = Store.objects.get(pk=store_id)
        store_support_bot = StoreSupportBot.objects.filter(store=store).first()
        support_chat_id, support_message_thread_id = store_support_chat_id_get(store_id=store_id)

        # If the message is a start message, send greeting
        if text and text.startswith("/start"):
            if store_support_bot.greeting_message:
                greeting_message = store_support_bot.greeting_message
            else:
                greeting_message = "Hello! How can I help you?"

            telegram_message_send(
                bot_token=decrypt(store_support_bot.bot_token),
                chat_id=chat_id,
                text=greeting_message,
                reply_markup=None,
                parse_mode="Markdown"
            )
            return

        # If message is sent from admin chat, send the contents of it to the user
        if (
            chat_id == support_chat_id and
            message_thread_id == support_message_thread_id and
            message["reply_to_message"]
        ):
            reply_to_message = message["reply_to_message"]
            user_chat_id = reply_to_message["forward_from"]["id"]
            logger.debug("Forwarding support message to user chat...")
            telegram_message_send(
                bot_token=decrypt(store_support_bot.bot_token),
                chat_id=user_chat_id,
                text=message["text"],
                reply_markup=None,
                parse_mode="Markdown"
            )
            return

        # If message sent from the user, forward it to the admin chat
        if chat_type == "private":
            logger.debug("Forwarding support message to admin chat...")
            telegram_message_forward(
                bot_token=decrypt(store_support_bot.bot_token),
                chat_id=support_chat_id,
                from_chat_id=chat_id,
                message_thread_id=support_message_thread_id,
                message_id=message["message_id"]
            )
            return

    except Exception as e:
        logger.error(
            "Error processing telegram support request. Error: %(error)s",
            {
                "error": e
            }
        )

