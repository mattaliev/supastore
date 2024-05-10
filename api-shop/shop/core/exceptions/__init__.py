from graphql import GraphQLError


def UNAUTHENTICATED(message="User not authenticated"):
    raise GraphQLError(message, extensions={"code": 401})


def UNAUTHORIZED(message="User not authorized", user_id=None):
    raise GraphQLError(
        f"{message}. User_id: {user_id}",
        extensions={"code": 403}
    )


class TelegramResponseError(Exception):
    def __init__(self, *, error_code: int, description: str):
        self.error_code = error_code
        self.description = description
        self.message = f"Telegram response error. Error code: {error_code}, Description: {description}"
        super().__init__(self.message)