import uuid
from datetime import datetime, timedelta

import jwt
from django.conf import settings

from authentication.models import TokenBlacklist
from user.models import TelegramUser

__all__ = [
    'encode_jwt',
    'decode_jwt'
]


def encode_jwt(*, user: TelegramUser):
    expiration_time = datetime.utcnow() + timedelta(days=1)

    jti = str(uuid.uuid4())

    while TokenBlacklist.objects.filter(jti=jti).exists():
        jti = str(uuid.uuid4())

    # Prepare the token payload
    payload = {
        'user_id': str(user.id),
        'username': user.username,
        'exp': expiration_time,
        'iat': datetime.utcnow(),
        'jti': jti
    }

    secret_key = settings.JWT_SECRET_KEY

    # Encode the JWT
    new_token = jwt.encode(payload, secret_key, algorithm='HS256')
    return new_token


def decode_jwt(*, token: str):
    secret_key = settings.JWT_SECRET_KEY
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])

        if TokenBlacklist.objects.filter(jti=payload.get("jti")):
            return None
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

    return payload
