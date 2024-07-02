from graphql import GraphQLError


class AuthenticationError(GraphQLError):
    def __init__(self, message="User not authenticated"):
        super().__init__(message, extensions={"code": 401})


class PermissionDeniedError(GraphQLError):
    def __init__(self, message="User not authorized", user_id=None):
        super().__init__(f"{message}. User_id: {user_id}", extensions={"code": 403})


class NotFoundError(GraphQLError):
    def __init__(self, message="Resource not found"):
        super().__init__(message, extensions={"code": 404})


class ValidationError(GraphQLError):
    def __init__(self, message="Validation error"):
        super().__init__(message, extensions={"code": 400})


class ServerError(GraphQLError):
    def __init__(self, message="Server error"):
        super().__init__(message, extensions={"code": 500})


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