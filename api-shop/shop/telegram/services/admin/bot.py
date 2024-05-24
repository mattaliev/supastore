import logging

from django.conf import settings

from store.services.store_services import store_application_approve
from telegram.services import telegram_message_send
from telegram.services.admin.actions import \
    telegram_notify_about_store_application_approval
from telegram.services.shop.inline_buttons import InlineButtonType


def telegram_admin_request_process(*, body: dict) -> None:
    logger = logging.getLogger(__name__)
    logger.disabled = False
    logger.debug("Processing telegram admin update")

    try:
        callback_query = body.get("callback_query", None)

        if callback_query:
            chat_id = callback_query["from"]["id"]
            callback_data = callback_query["data"]
            callback_data_parts = callback_data.split(":")
            callback_type = callback_data_parts[0]

            if callback_type == InlineButtonType.APPROVE_STORE_APPLICATION.value:
                store = store_application_approve(
                    store_application_id=callback_data_parts[1])

                telegram_message_send(
                    bot_token=settings.TELEGRAM_ADMIN_BOT_TOKEN,
                    chat_id=chat_id,
                    text="Store application has been approved"
                )

                telegram_notify_about_store_application_approval(store=store)
            return

        message = body["message"]
        user = message["from"]
        chat_id = message["chat"]["id"]
        text = message["text"]

        if chat_id != int(settings.SUPERUSER_TELEGRAM_ID):
            telegram_message_send(
                bot_token=settings.TELEGRAM_ADMIN_BOT_TOKEN,
                chat_id=chat_id,
                text="You are not authorized to use this bot!"
            )
            return

        if text and text.startswith("/"):
            if text == "/start":
                telegram_message_send(
                    bot_token=settings.TELEGRAM_ADMIN_BOT_TOKEN,
                    chat_id=chat_id,
                    text="Hello! How can I help you?",
                    parse_mode=None
                )
            return
    except Exception as e:
        logger.debug("Error processing telegram admin update: %(error)s",
                     {"error": e})
