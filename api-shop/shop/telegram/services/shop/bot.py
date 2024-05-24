import logging
from uuid import UUID

from payment.services.telegram_payments import \
    telegram_successful_payment_process
from store.models import Store
from store.services import store_bot_token_get
from telegram.services import telegram_message_send
from telegram.services.shop.commands import telegram_command_process
from telegram.services.shop.inline_buttons import \
    telegram_callback_query_process
from telegram.services.shop.states import telegram_user_state_process

__all__ = [
    "telegram_shop_request_process"
]


def telegram_shop_request_process(*, store_id: UUID, body: dict) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Processing telegram shop update")

    try:
        store = Store.objects.get(pk=store_id)
        bot_token = store_bot_token_get(store=store)
        message = body["message"]
        user = message["from"]
        chat_id = message["chat"]["id"]
        chat_type = message["chat"]["type"]
        text = message["text"]
        callback_query = body.get("callback_query")
        successful_payment = body.get("successful_payment")

        # For now, lets ignore the messages that are sent in groups or supergroups
        if chat_type in ["group", "supergroup"]:
            return

        if text and text.startswith("/"):
            telegram_command_process(
                store=store,
                bot_token=bot_token,
                user=user,
                chat_id=chat_id,
                command=text
            )
            return

        if text:
            telegram_user_state_process(
                store=store,
                bot_token=bot_token,
                user=user,
                chat_id=chat_id,
                message=text
            )
            return

        if callback_query:
            telegram_callback_query_process(
                store=store,
                user=user,
                chat_id=chat_id,
                callback_query=callback_query
            )
            return

        if successful_payment:
            telegram_successful_payment_process(successful_payment)

        telegram_message_send(
            bot_token=bot_token,
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
