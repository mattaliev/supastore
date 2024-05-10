import json
import logging
from typing import Tuple
from uuid import UUID

from django.conf import settings

from authentication.models.token import TokenBlacklist
from cart.models import Cart
from cart.services import cart_get_or_create
from core.exceptions import UNAUTHORIZED
from user.models import TelegramUser, UserRoleChoices
from user.services import user_create_or_update
from .jwt import encode_jwt, decode_jwt
from .providers import validate_init_data, parse_init_data
from .session import session_create

token = settings.TELEGRAM_SHOP_TOKEN

__all__ = [
    'sign_in_shop_user',
    'sign_in_admin_user',
    'sign_out_admin_user',
    'encode_jwt',
    'decode_jwt'
]


def sign_in_shop_user(
        *,
        init_data_raw: str,
        cart_id: UUID = None
) -> Tuple[TelegramUser, Cart, bool]:
    logger = logging.getLogger(__name__)
    logger.debug("Signing in shop user...")

    # Validate init_data_raw
    validate_init_data(init_data_raw)

    # Parse init_data_raw
    init_data = parse_init_data(init_data_raw)
    telegram_user = json.loads(init_data.get("user"))

    # Get or create user
    user, created = user_create_or_update(
        telegram_id=telegram_user.get("id"),
        username=telegram_user.get("username", None),
        first_name=telegram_user.get("first_name", None),
        last_name=telegram_user.get("last_name", None),
        language_code=telegram_user.get("language_code", None),
        is_bot=telegram_user.get("is_bot", None),
        photo_url=telegram_user.get("photo_url", None),
        allows_notifications=telegram_user.get("allows_write_to_pm", None),
    )

    # Create new session for the user
    session = session_create(user_id=user.id, hash=init_data.get("hash"))

    logger.debug("Created new session: Session Key: %s", session.session_key)

    # Get or create cart
    cart, created_cart = cart_get_or_create(cart_id=cart_id, user=user)

    return user, cart, created_cart


def sign_in_admin_user(*, data_check_string: str, provider: str = "telegram"):
    user = None
    access_token = None

    if provider == "telegram":
        validate_init_data(data_check_string, is_web_app=False)

        data = parse_init_data(data_check_string)

        user = TelegramUser.objects.filter(telegram_id=data.get("id")).first()

        if not user or user.role != UserRoleChoices.ADMIN:
            raise UNAUTHORIZED()

        access_token = encode_jwt(user=user)

    return user, access_token


def sign_out_admin_user(*, user: TelegramUser, token: str):
    jti = decode_jwt(token=token).get('jti')
    TokenBlacklist.objects.create(jti=jti, user=user)
    return True




