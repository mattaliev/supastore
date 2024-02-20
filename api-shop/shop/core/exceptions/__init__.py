

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
