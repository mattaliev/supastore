import json
import logging
from typing import Tuple
from uuid import UUID

from django.conf import settings

from authentication.models.token import TokenBlacklist
from cart.models import Cart
from cart.services import cart_get_or_create
from store.models import Store
from store.services import store_bot_token_get
from user.models import TelegramUser
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
        store_id: UUID,
        init_data_raw: str,
        cart_id: UUID = None
) -> Tuple[TelegramUser, Cart, bool]:
    logger = logging.getLogger(__name__)
    logger.debug("Signing in shop user...")

    # Validate init_data_raw
    store = Store.objects.get(pk=store_id)
    bot_token = store_bot_token_get(store=store)

    validate_init_data(init_data_raw, bot_token=bot_token)

    # Parse init_data_raw
    init_data = parse_init_data(init_data_raw)
    telegram_user = json.loads(init_data.get("user"))

    # Get or create user
    user, created = user_create_or_update(
        store_id=store_id,
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
    session = session_create(user_id=user.id, hash=init_data.get("hash"), store_id=store_id)

    logger.debug("Created new session: Session Id: %s", session.id)

    # Get or create cart
    cart, created_cart = cart_get_or_create(cart_id=cart_id, user=user, store_id=store_id)

    return user, cart, created_cart


def sign_in_admin_user(*, data_check_string: str, provider: str = "telegram"):
    user = None
    access_token = None

    if provider == "telegram":
        bot_token = settings.TELEGRAM_ADMIN_BOT_TOKEN

        validate_init_data(data_check_string, bot_token=bot_token, is_web_app=False)

        data = parse_init_data(data_check_string)

        user, created = user_create_or_update(
            telegram_id=data.get("id"),
            username=data.get("username", None),
            first_name=data.get("first_name", None),
            last_name=data.get("last_name", None),
            language_code=data.get("language_code", None),
            is_bot=data.get("is_bot", None),
            photo_url=data.get("photo_url", None),
            allows_notifications=data.get("allows_write_to_pm", None),
        )

        access_token = encode_jwt(user=user)
        print("Access Token", access_token)

    return user, access_token


def sign_out_admin_user(*, user: TelegramUser, token: str):
    jti = decode_jwt(token=token).get('jti')
    TokenBlacklist.objects.create(jti=jti, user=user)
    return True




