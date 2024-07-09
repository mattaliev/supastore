from abc import ABC, abstractmethod

from django.contrib.auth import get_user_model

from store.models import Store
from store.services import store_support_username_get
from telegram.models.user_bot_state import States, UserBotState
from telegram.services import telegram_message_send
from telegram.services.shop.inline_buttons import ContactSupportInlineButton, \
    OpenShopInlineButton

__all__ = [
    "telegram_user_state_process",
    "StateProcessor",
    "JoinPromoCodeStateProcessor",
    "bot_states"
]

from telegram.services.shop.messages import EMAIL_ACCEPTED_MESSAGE, EMAIL_REJECTED_MESSAGE, UNRECOGNIZED_ACTION_MESSAGE


def telegram_user_state_process(*, store: Store, bot_token: str, user: dict, chat_id: int, message: str):
    User = get_user_model()

    telegram_user = User.objects.get(telegram_id=user['id'])

    current_user_state = UserBotState.objects.get(user=telegram_user, store=store)

    for bot_state in bot_states:
        if bot_state.state == current_user_state.state:
            bot_state.execute(store=store, bot_token=bot_token, user=user, chat_id=chat_id, message=message)
            return

    telegram_message_send(
        bot_token=bot_token,
        chat_id=chat_id,
        text=UNRECOGNIZED_ACTION_MESSAGE
    )


class StateProcessor(ABC):
    def __init__(self, state: States):
        self.state = state

    @abstractmethod
    def execute(self, *, store: Store, bot_token: str, user: dict, chat_id: int, message: str, **kwargs):
        pass


class JoinPromoCodeStateProcessor(StateProcessor):
    def __init__(self):
        super().__init__(States.JOIN_PROMO_CODE)

    def execute(self, *, store: Store, bot_token: str, user: dict, chat_id: int, message: str, **kwargs):
        # validated_email = validate_email(message)
        validated_email = message

        if not validated_email:
            telegram_message_send(
                bot_token=bot_token,
                chat_id=chat_id,
                text=EMAIL_REJECTED_MESSAGE
            )
            return

        # Send email to user address

        text = EMAIL_ACCEPTED_MESSAGE
        support_username = store_support_username_get(store_id=store.id)

        reply_markup = [
            [OpenShopInlineButton().as_json()],
            [ContactSupportInlineButton(support_username=support_username).as_json()]
        ]

        current_user = get_user_model().objects.get(telegram_id=user['id'])
        current_user.email = validated_email
        current_user_state = UserBotState.objects.get(user=current_user, store=store)
        current_user_state.state = States.SHOPPING

        telegram_message_send(
            bot_token=bot_token,
            chat_id=chat_id,
            text=text,
            reply_markup=reply_markup
        )


bot_states = [
    JoinPromoCodeStateProcessor(),
]
