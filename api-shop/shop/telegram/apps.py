from django.apps import AppConfig


# from telegram.services.core import telegram_shop_webhook_set, \
#     telegram_support_webhook_set


class TelegramConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'telegram'

    # def ready(self) -> None:
    #     logger = logging.getLogger(self.__class__.__name__)
    #
    #     logger.debug("Setting up telegram shop webhook...")
    #     telegram_shop_webhook_set()
    #
    #     logger.debug("Setting up telegram support webhook...")
    #     telegram_support_webhook_set()
