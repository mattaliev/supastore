import logging

from django.conf import settings

from store.models.store import StoreApplication, Store
from telegram.services import telegram_message_send
from user.models import TelegramUser, UserRoleChoices
from .inline_buttons import ApproveStoreApplicationButton, OpenStoreButton


def telegram_notify_about_store_application(*, store_application: StoreApplication):
    logger = logging.getLogger(__name__)
    logger.info("Notifying telegram about store application with id: %s", store_application.id)

    user = store_application.user

    text = f"""
    🏪 *New store application* 🏪

    *Store name*: {store_application.store_name}
    *Store description*: {store_application.store_description}
    *Channels*: {store_application.channels}
    *Product category*: {store_application.product_category}
    *User*: {user.first_name} {user.last_name} (@{user.username})
    """

    superuser = TelegramUser.objects.get(telegram_id=settings.SUPERUSER_TELEGRAM_ID)

    reply_markup = [
        [ApproveStoreApplicationButton(store_application_id=store_application.id).as_json()]
    ]

    telegram_message_send(
        bot_token=settings.TELEGRAM_ADMIN_BOT_TOKEN,
        chat_id=superuser.telegram_id,
        text=text,
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )


def telegram_notify_about_store_application_approval(*, store: Store):
    logger = logging.getLogger(__name__)
    logger.info("Notifying telegram about store application approval with id: %s", store.id)

    owner = store.store_users.filter(role=UserRoleChoices.OWNER).first()

    text = f"""
    🏪 *Store application approved* 🏪

    *Store name*: {store.store_name}
    *Store description*: {store.store_description}
    
    Press the button below to open your store
    """

    reply_markup = [
        [OpenStoreButton(store_url=store.store_url).as_json()]
    ]

    telegram_message_send(
        bot_token=settings.TELEGRAM_ADMIN_BOT_TOKEN,
        chat_id=owner.user.telegram_id,
        text=text,
        parse_mode="Markdown",
        reply_markup=reply_markup
    )

