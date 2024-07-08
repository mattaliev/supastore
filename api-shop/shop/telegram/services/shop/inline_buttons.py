from abc import ABC, abstractmethod
from enum import Enum
from uuid import UUID

from django.conf import settings
from django.contrib.auth import get_user_model

__all__ = [
    "telegram_callback_query_process",
    "InlineButtonType",
    "InlineButton",
    "ContactSupportInlineButton",
    "OpenShopInlineButton",
    "PayWithTelegramInvoiceButton",
    "PayWithWalletPayButton",
    "OpenOrderButton",
    "MailingInlineButton",
]

from store.models import Store
from telegram.services import telegram_message_send

User = get_user_model()


def telegram_callback_query_process(
        *,
        store: Store,
        bot_token: str,
        user: User,
        chat_id: int,
        callback_query: str
):
    for inline_button in inline_buttons:
        if inline_button.type.value == callback_query:
            inline_button.execute(store=store, bot_token=bot_token, user=user, chat_id=chat_id)
            return

    telegram_message_send(
        bot_token=bot_token,
        chat_id=chat_id,
        text="I'm sorry, I don't understand what you're saying. Please look at the /help command"
    )


class InlineButtonType(Enum):
    APPROVE_STORE_APPLICATION = "APPROVE_STORE_APPLICATION"
    CONTACT_SUPPORT = "CONTACT_SUPPORT"
    START_SHOPPING = "START_SHOPPING"
    PAY_WITH_TELEGRAM_INVOICE = "PAY_WITH_TELEGRAM_INVOICE"
    PAY_WITH_WALLET_PAY = "PAY_WITH_WALLET_PAY"
    OPEN_ORDER = "OPEN_ORDER"
    OPEN_STORE = "OPEN_STORE"
    MAILING = "MAILING"


class InlineButton(ABC):
    def __init__(self, type: InlineButtonType, text: str = None):
        self.type = type
        self.text = text

    @abstractmethod
    def as_json(self):
        pass

    @abstractmethod
    def execute(self, *, user: User, chat_id: int, callback_data: str = None,
                **kwargs):
        pass


class ContactSupportInlineButton(InlineButton):
    def __init__(self, text: str = "Contact support"):
        super().__init__(InlineButtonType.CONTACT_SUPPORT, text)

    def as_json(self):
        return {
            "text": self.text,
            "url": f"https://t.me/{settings.TELEGRAM_SUPPORT_BOT_USERNAME}"
        }

    def execute(self, *args, **kwargs):
        """
        Does not execute anything since it opens the chat with the support
        """
        pass


class OpenShopInlineButton(InlineButton):
    def __init__(self, store_id: UUID = None, text: str = "🛍Start shopping"):
        self.store_id = store_id
        super().__init__(InlineButtonType.START_SHOPPING, text)

    def as_json(self):
        return {
            "text": self.text,
            "web_app": {
                "url": f"{settings.FRONTEND_CLIENT_URL}/store/{self.store_id}"
            }
        }

    def execute(self, *args, **kwargs):
        """
        Does not execute anything since it opens the shop
        """
        pass


class PayWithTelegramInvoiceButton(InlineButton):
    def __init__(self, payment_link: str, name, text: str = "💳Pay"):
        self.payment_link = payment_link
        super().__init__(InlineButtonType.PAY_WITH_TELEGRAM_INVOICE,
                         f"{text} with {name}")

    def as_json(self):
        return {
            "text": self.text,
            "url": self.payment_link
        }

    def execute(self, *args, **kwargs):
        """
        Does not execute anything since it opens the chat with the support
        """
        pass


class PayWithWalletPayButton(InlineButton):
    def __init__(self, direct_payment_link, text: str = "👛Pay via Wallet"):
        self.direct_payment_link = direct_payment_link
        super().__init__(InlineButtonType.PAY_WITH_WALLET_PAY, text)

    def as_json(self):
        return {
            "text": self.text,
            "url": self.direct_payment_link
        }

    def execute(self, *args, **kwargs):
        """
        Does not execute anything since it opens the chat with the support
        """
        pass


class OpenOrderButton(InlineButton):
    def __init__(self, *, order_id: str, store_id: UUID, store_url: str, text: str = "📦View order"):
        self.store_id = store_id
        self.order_id = order_id
        self.store_url = store_url
        super().__init__(InlineButtonType.OPEN_ORDER, text)

    def as_json(self):
        return {
            "text": self.text,
            "web_app": {
                "url": f"{self.store_url}/order/{self.order_id}"
            }
        }

    def execute(self, *args, **kwargs):
        """
        Does not execute anything since it opens the chat with the support
        """
        pass


class MailingInlineButton(InlineButton):
    def __init__(self, text: str = "Go to Store!", url: str = None):
        super().__init__(InlineButtonType.MAILING)
        self.text = text
        self.url = url

    def as_json(self):
        return {
            "text": self.text,
            "url": self.url
        }

    def execute(self, *args, **kwargs):
        """
        Does not execute anything since it opens the chat with the support
        """
        pass


inline_buttons = [
    ContactSupportInlineButton(),
    OpenShopInlineButton(),
]
