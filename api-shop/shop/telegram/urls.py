from django.urls import path

from telegram.views import telegram_shop_update, telegram_support_update, \
    telegram_admin_update

urlpatterns = [
    path("webhooks/shop/<uuid:store_id>/update/", telegram_shop_update,
         name="telegram_shop_update"),
    path("webhooks/support/update/", telegram_support_update,
         name="telegram_support_update"),
    path("webhooks/admin/update/", telegram_admin_update)
]
