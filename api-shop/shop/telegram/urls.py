from django.urls import path

from telegram.views import telegram_shop_update, telegram_support_update

urlpatterns = [
    path("webhooks/shop/update/", telegram_shop_update,
         name="telegram_shop_update"),
    path("webhooks/support/update/", telegram_support_update,
         name="telegram_support_update"),
]
