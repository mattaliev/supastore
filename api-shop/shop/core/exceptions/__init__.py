

class UNAUTHENTICATED(Exception):
    def __init__(self, message="User not authenticated", user_id=None):
        self.user_id = user_id
        self.message = message
        self.status = 401
        super().__init__(self.message)


class UNAUTHORIZED(Exception):
    def __init__(self, message="User not authorized", user_id=None):
        self.user_id = user_id
        self.message = message
        self.status = 401
        super().__init__(self.message)


class TelegramResponseError(Exception):
    def __init__(self, *, error_code: int, description: str):
        self.error_code = error_code
        self.description = description
        self.message = f"Telegram response error. Error code: {error_code}, Description: {description}"
        super().__init__(self.message)