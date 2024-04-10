import logging
from django.contrib.auth import get_user_model

from analytics.services import user_visit_register


def authenticate_user(*, telegram_id: int):
    logger = logging.getLogger(__name__)
    logger.debug("Authenticating user", {"telegram_id": telegram_id})

    User = get_user_model()
    try:
        user = User.objects.get(telegram_id=telegram_id)
    except User.DoesNotExist:
        logger.debug("User not found", {"telegram_id": telegram_id})
        return None

    logger.debug("Got user", {"user": user.id})
    return user


def user_create_or_update(
    *,
    telegram_id: int,
    username: str = None,
    first_name: str = None,
    last_name: str = None,
    language_code: str = None,
    is_bot: bool = None,
    photo_url: str = None,
    allows_notifications: bool = None,
    role: str = None,
    chat_id: int = None
):
    logger = logging.getLogger(__name__)
    logger.debug("Creating or updating user", {"telegram_id": telegram_id})

    fields = {
        'username': username,
        'first_name': first_name,
        'last_name': last_name,
        'language_code': language_code,
        'is_bot': is_bot,
        'photo_url': photo_url,
        'allows_notifications': allows_notifications,
        'role': role,
        'chat_id': chat_id
    }

    defaults = {k: v for k, v in fields.items() if v is not None}

    User = get_user_model()
    user, created = User.objects.update_or_create(
        telegram_id=telegram_id,
        defaults=defaults
    )
    logger.debug("Got user", {"user": user.id, "created": created})

    user_visit_register(user=user)

    return user, created
