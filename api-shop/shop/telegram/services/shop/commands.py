import logging
from abc import ABC, abstractmethod
from enum import Enum

from telegram.models.user_bot_state import UserBotState, States
from telegram.services import telegram_shop_message_send
from telegram.services.shop.messages import (
    WELCOME_MESSAGE,
    WELCOME_BACK_JOIN_PROMO_CODE_MESSAGE,
    WELCOME_BACK_MESSAGE,
    SOMETHING_WENT_WRONG_MESSAGE,
    UNRECOGNIZED_ACTION_MESSAGE
)
from user.services import user_create_or_update


__all__ = [
    "telegram_command_process",
    "BotCommandTypes",
    "BotCommand",
    "StartCommand",
    "bot_commands",
]


def telegram_command_process(*, user: dict, chat_id: int, command: str):
    for bot_command in bot_commands:
        if bot_command.command.value == command:
            bot_command.execute(telegram_user=user, chat_id=chat_id)
            return

    telegram_shop_message_send(
        chat_id=chat_id,
        text=UNRECOGNIZED_ACTION_MESSAGE
    )


class BotCommandTypes(Enum):
    START = '/start'
    HELP = '/help'
    ORDERS = '/orders'


class BotCommand(ABC):
    def __init__(self, command: BotCommandTypes):
        self.command = command

    @abstractmethod
    def execute(self, *args, **kwargs):
        pass


class StartCommand(BotCommand):
    def __init__(self):
        super().__init__(BotCommandTypes.START)

    def execute(self, telegram_user: dict, chat_id: int, *args, **kwargs):
        logger = logging.getLogger(__name__)
        logger.debug("Processing start command")
        try:
            user, is_user_created = user_create_or_update(
                telegram_id=telegram_user['id'],
                username=telegram_user.get('username'),
                first_name=telegram_user.get('first_name'),
                last_name=telegram_user.get('last_name'),
                language_code=telegram_user.get('language_code'),
                is_bot=telegram_user.get('is_bot'),
                photo_url=telegram_user.get('photo_url'),
                allows_notifications=telegram_user.get('allows_notifications'),
            )

            bot_state, is_state_created = UserBotState.objects.get_or_create(user=user)

            if is_state_created:
                text = WELCOME_MESSAGE
            elif bot_state.state == States.JOIN_PROMO_CODE:
                text = WELCOME_BACK_JOIN_PROMO_CODE_MESSAGE
            else:
                text = WELCOME_BACK_MESSAGE

            telegram_shop_message_send(
                chat_id=chat_id,
                text=text
            )
        except Exception as e:
            logger.error("Error processing start command. Telegram Id: %(telegram_id)s, Error: %(error)s", {
                "telegram_id": telegram_user['id'],
                "error": e
            })
            telegram_shop_message_send(
                chat_id=chat_id,
                text=SOMETHING_WENT_WRONG_MESSAGE
            )


bot_commands = [
    StartCommand(),
]

