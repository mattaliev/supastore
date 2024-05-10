import hashlib
import hmac
from datetime import datetime
from hashlib import sha256
from urllib.parse import parse_qs

from django.conf import settings

TOKEN = settings.TELEGRAM_SHOP_TOKEN


__all__ = [
    'validate_init_data',
    'parse_init_data'
]


def validate_init_data(init_data_raw: str, is_web_app: bool = True):
    search_params = parse_qs(init_data_raw)

    auth_date = datetime(1970, 1, 1)
    hash_value = ''
    pairs = []

    for key, value in search_params.items():
        value = value[0] if isinstance(value, list) else value

        if key == 'hash':
            hash_value = value
            continue

        if key == 'auth_date':
            auth_date_num = int(value)
            if not isinstance(auth_date_num, int):
                raise TypeError('"auth_date" should be an integer')
            auth_date = datetime.utcfromtimestamp(auth_date_num)

        pairs.append(f"{key}={value}")

    if not hash_value:
        raise ValueError('"hash" is empty or not found')

    if auth_date == datetime(1970, 1, 1):
        raise ValueError('"auth_date" is empty or not found')

    expires_in = 86400

    if expires_in > 0 and auth_date.timestamp() + expires_in < datetime.now().timestamp():
        raise ValueError('Init data expired')

    pairs.sort()
    if is_web_app:
        secret_key = hmac.new('WebAppData'.encode(), TOKEN.encode(), digestmod=sha256)
    else:
        secret_key = hashlib.sha256(TOKEN.encode())

    computed_hash = hmac.new(secret_key.digest(),'\n'.join(pairs).encode(), digestmod=sha256).hexdigest()

    if computed_hash != hash_value:
        raise ValueError('Signature is invalid')


def parse_init_data(init_data_raw: str):
    search_params = parse_qs(init_data_raw)

    return {
        key: value[0] if isinstance(value, list) else value
        for key, value in search_params.items()
    }