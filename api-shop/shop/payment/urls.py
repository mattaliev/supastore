from django.urls import path

from payment.webhooks import wallet_pay_webhook

urlpatterns = [
    path("webhooks/wallet-pay/", wallet_pay_webhook, name="wallet_pay_webhook"),
]
