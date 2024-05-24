from uuid import UUID

from telegram.services.shop.inline_buttons import InlineButton, \
    InlineButtonType, User


class ApproveStoreApplicationButton(InlineButton):
    def __init__(self, store_application_id: UUID):
        super().__init__(type=InlineButtonType.APPROVE_STORE_APPLICATION)
        self.store_application_id = store_application_id

    def as_json(self):
        return {
            "text": "Approve",
            "callback_data": f"{self.type.value}:{str(self.store_application_id)}"
        }

    def execute(self, *, user: User, chat_id: int, callback_data: str = None,
                **kwargs):
        pass


class OpenStoreButton(InlineButton):
    def __init__(self, store_url: str):
        super().__init__(type=InlineButtonType.OPEN_STORE)
        self.store_url = store_url

    def as_json(self):
        return {
            "text": "Open store",
            "url": self.store_url
        }

    def execute(self, *, user: User, chat_id: int, callback_data: str = None,
                **kwargs):
        pass

