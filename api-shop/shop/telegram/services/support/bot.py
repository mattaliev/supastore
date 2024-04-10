import logging

from django.conf import settings

from telegram.services.core import telegram_support_message_forward, telegram_support_message_send


def telegram_support_request_process(body: dict) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Processing telegram support update")

    try:
        message = body["message"]
        chat_id = message["chat"]["id"]
        chat_type = message["chat"]["type"]
        text = message["text"]

        # If the message is a start message, send greeting
        if text and text.startswith("/start"):
            telegram_support_message_send(
                chat_id=chat_id,
                text="Hello! How can I help you?"
            )
            return

        # If message sent from the user, forward it to the admin chat
        if chat_type == "private":
            logger.debug("Forwarding support message to admin chat...")
            telegram_support_message_forward(
                chat_id=int(settings.TELEGRAM_SUPPORT_CHAT_ID),
                from_chat_id=chat_id,
                message_id=message["message_id"]
            )
            return

        # If message is sent from admin chat, send the contents of it to the user
        if str(chat_id) == settings.TELEGRAM_SUPPORT_CHAT_ID and message["reply_to_message"]:
            reply_to_message = message["reply_to_message"]
            user_chat_id = reply_to_message["forward_from"]["id"]
            logger.debug("Forwarding support message to user chat...")
            telegram_support_message_send(
                chat_id=user_chat_id,
                text=message["text"]
            )
            return

    except Exception as e:
        logger.error(
            "Error processing telegram support request. Error: %(error)s",
            {
                "error": e
            }
        )

