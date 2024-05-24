import json

from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session

from authentication.services import (
    validate_init_data,
    parse_init_data,
    session_update,
    decode_jwt
)
from store.models import Store
from store.services import store_bot_token_get

User = get_user_model()


class AuthMiddleware(object):
    """
    Middleware to authenticate requests
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        headers = request.headers
        if "Authorization" in headers:
            method, token = headers["Authorization"].split(" ")
            if method == "TWA":
                store_id = headers.get("Store-Id")
                store = Store.objects.get(pk=store_id)
                bot_token = store_bot_token_get(store=store)

                # Validate init data
                if bot_token:
                    validate_init_data(token, bot_token=bot_token)

                # Parse init data
                data = parse_init_data(token)
                parsed_user = json.loads(data.get("user"))

                # Get user from parsed data
                user = User.objects.get(telegram_id=parsed_user.get("id"))
                request.user = user

                # Update session
                session = Session.objects.get(session_key=data.get("hash")[:40])
                session_update(session=session)

            if method == "Bearer":
                payload = decode_jwt(token=token)

                if payload:
                    user = User.objects.get(id=payload.get("user_id"))
                    request.user = user

        return self.get_response(request)




