import base64

from Crypto.Cipher import AES
from django.conf import settings

__all__ = ['encrypt', 'decrypt']

decoded_key = base64.b64decode(settings.AES_SECRET_KEY)
decoded_iv = base64.b64decode(settings.AES_IV)


def encrypt(data: str):
    padded_data = pad(data)
    cipher = AES.new(decoded_key, AES.MODE_CBC, decoded_iv)
    encrypted_data = cipher.encrypt(padded_data.encode('utf-8'))
    base64_encoded_data = base64.b64encode(encrypted_data).decode("utf-8")
    return base64_encoded_data


def decrypt(data: str):
    data = base64.b64decode(data)
    cipher = AES.new(decoded_key, AES.MODE_CBC, decoded_iv)
    decrypted_data = cipher.decrypt(data)
    return unpad(decrypted_data).decode('utf-8')


def pad(data):
    return data + (AES.block_size - len(data) % AES.block_size) * chr(
        AES.block_size - len(data) % AES.block_size)


def unpad(data):
    return data[:-ord(data[len(data) - 1:])]
