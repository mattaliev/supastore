import logging
from uuid import UUID

from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db.models import Q

from core.utils.encryption import encrypt, decrypt
from store.models import Store, StoreBot, StoreLogo
from store.models.store import StoreApplication
from telegram.services import telegram_webhook_set
from telegram.services.admin.actions import \
    telegram_notify_about_store_application
from user.models import TelegramUser, StoreUser, UserRoleChoices

__all__ = [
    "store_logo_get",
    "store_get",
    "store_list",
    "store_has_bot_token",
    "store_bot_token_get",
    "store_create",
    "store_update",
    "store_admin_create",
    "can_manage_store",
    "store_bot_token_create_or_update",
    "store_connect_to_telegram",
    "store_application_create",
    "store_application_approve",
]

def store_logo_get(*, store_id: UUID):
    logger = logging.getLogger(__name__)
    logger.info("Getting store logo with id: %s", store_id)

    return StoreLogo.objects.get(store_id=store_id)


def store_get(*, store_id: UUID):
    logger = logging.getLogger(__name__)
    logger.info("Getting store with id: %s", store_id)

    return Store.objects.get(id=store_id)


def store_list(*, user: TelegramUser):
    logger = logging.getLogger(__name__)
    logger.info("Getting stores for user id: %s", user.id)

    return Store.objects.filter(
        Q(store_users__role=UserRoleChoices.OWNER) | Q(store_users__role=UserRoleChoices.ADMIN),
        store_users__user=user,
    )


def store_has_bot_token(*, store: Store) -> bool:
    return hasattr(store, 'store_bot') and store.store_bot.token is not None


def store_bot_token_get(*, store: Store) -> str | None:
    if store_has_bot_token(store=store):
        return decrypt(store.store_bot.token)
    return None


def store_create(
        *,
        user: TelegramUser,
        store_name: str,
        store_timezone: str = "UTC",
        store_description: str = None,
        logo_dark: InMemoryUploadedFile = None,
        logo_light: InMemoryUploadedFile = None,
        bot_token: str = None,
        bot_username: str = None,
):
    logger = logging.getLogger(__name__)
    logger.info("Creating new store with name: %s", store_name)

    store = Store.objects.create(
        store_name=store_name,
        store_description=store_description,
        store_timezone=store_timezone
    )

    store_url = f"{settings.FRONTEND_CLIENT_URL}/en/store/{store.id}"

    store.store_url = store_url

    StoreUser.objects.create(
        store=store,
        user=user,
        role=UserRoleChoices.OWNER
    )

    store_bot = StoreBot.objects.create(
        store=store,
        bot_username=bot_username
    )

    if bot_token:
        store_bot_token_create_or_update(store_id=store.id, token=bot_token)

    store_logo = StoreLogo.objects.create(store=store)

    if logo_dark or logo_light:
        store_logo.dark_logo = logo_dark
        store_logo.light_logo = logo_light
        store_logo.save()

    store.save()

    return store


def store_update(
        *,
        store_id: UUID,
        store_timezone: str = None,
        store_name: str = None,
        store_description: str = None,
        logo_dark: InMemoryUploadedFile = None,
        logo_light: InMemoryUploadedFile = None,
        bot_username: str = None,
        bot_token: str = None,
):
    logger = logging.getLogger(__name__)
    logger.info("Updating store with id: %s", store_id)

    store = Store.objects.get(id=store_id)

    if store_name:
        store.store_name = store_name

    if store_description:
        store.store_description = store_description

    if store_timezone:
        store.store_timezone = store_timezone

    store_logo = store.logo

    if logo_dark:
        store_logo.logo_dark = logo_dark

    if logo_light:
        store_logo.logo_light = logo_light

    store_logo.save()

    if bot_username:
        store.store_bot.bot_username = bot_username
        store.store_bot.save()

    if bot_token:
        store_bot_token_create_or_update(store_id=store_id, token=bot_token)

    store.save()
    return store


# TODO: Currently unused, but need to implement this properly in the future
def store_admin_create(*, user: TelegramUser, store_id: UUID):
    """
    This should be a function that invites a new member to join the store as an admin
    It should send an invitation to the user in form of the deeplink to the store
    The hash in the link needs to be unique and should be stored in the database.
    Once the user clicks on the link, he will be taken to the sign in page,
    with callback url to accept invitation page
    :param user:
    :param store_id:
    :return:
    """
    logger = logging.getLogger(__name__)
    logger.info("Creating store admin with user id: %s", user.id)

    store_admin, created = StoreUser.objects.get_or_create(
        store_id=store_id,
        user=user,
        role=UserRoleChoices.ADMIN,
    )

    return store_admin, created


def can_manage_store(*, user: TelegramUser, store_id: UUID):
    return StoreUser.objects.filter(
        Q(role=UserRoleChoices.OWNER) | Q(role=UserRoleChoices.ADMIN),
        user=user, store_id=store_id
    ).exists()


def store_bot_token_create_or_update(*, store_id: UUID, token: str):
    logger = logging.getLogger(__name__)
    logger.info("Creating or updating bot token for store id: %s", store_id)

    encrypted_token = encrypt(token)

    store = Store.objects.get(id=store_id)

    if hasattr(store, "store_bot"):
        store_bot = store.store_bot
        store_bot.token = encrypted_token
        store_bot.save()
    else:
        StoreBot.objects.create(
            store=store, token=encrypted_token
        )

    webhook_url = f"{settings.SERVICE_URL}/telegram/webhooks/shop/{str(store.id)}/update/"

    telegram_webhook_set(
        bot_token=token,
        url=webhook_url
    )

    return True


def store_connect_to_telegram(*, store_id: UUID):
    logger = logging.getLogger(__name__)
    logger.info("Connecting store to telegram with store id: %s", store_id)

    store = Store.objects.get(id=store_id)
    store.is_connected_to_telegram = True
    store.save()

    return True


def store_application_create(
        *,
        store_name: str,
        store_description: str = None,
        channels: str = None,
        product_category: str = None,
        user: TelegramUser
):
    logger = logging.getLogger(__name__)
    logger.info("Creating store application with name: %s", store_name)

    store_application = StoreApplication.objects.create(
        store_name=store_name,
        store_description=store_description,
        channels=channels,
        product_category=product_category,
        user=user
    )

    telegram_notify_about_store_application(store_application=store_application)

    return store_application


def store_application_approve(*, store_application_id: UUID):
    logger = logging.getLogger(__name__)
    logger.info("Approving store application with id: %s", store_application_id)

    store_application = StoreApplication.objects.get(id=store_application_id)

    store = store_create(
        user=store_application.user,
        store_name=store_application.store_name,
        store_description=store_application.store_description
    )

    return store

def store_timezone_get(*, store_id: UUID):
    logger = logging.getLogger(__name__)
    logger.info("Getting store timezone with id: %s", store_id)

    return Store.objects.get(id=store_id).store_timezone
