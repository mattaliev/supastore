from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

from core.views import index
from telegram.views import payment_webhook_request, telegram_shop_update, telegram_support_update

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", index, name="index"),
    path("payment/wallet-pay/", payment_webhook_request, name="payment_webhook_request"),
    path("webhooks/telegram/shop/sendUpdate/", telegram_shop_update, name="telegram_shop_update"),
    path("webhooks/telegram/support/sendUpdate/", telegram_support_update, name="telegram_support_update"),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True)))
]
