# import logging
# from uuid import UUID
# from django.contrib.auth import get_user_model
#
# from order.models import Order
#
# from invoice.models import Invoice
# from telegram.services.shop.payment import telegram_invoice_request
#
# User = get_user_model()
#
# __all__ = [
#     "invoice_create",
# ]
#
#
# def invoice_create(
#         *,
#         order_id: UUID,
#         user_id: UUID,
#         currency_code: str = "USDT",
#         auto_conversion_currency_code: str = "USDT",
#         **kwargs
# ) -> Invoice:
#     logger = logging.getLogger(__name__)
#     logger.debug("Creating invoice", {"order_id": order_id})
#
#     order = Order.objects.filter(pk=order_id).first()
#     user = User.objects.filter(pk=user_id).first()
#
#     if not order or not user:
#         logger.warning("Order or user not found", {"order_id": order_id, "user_id": user_id})
#         raise ValueError("Order or user not found")
#
#     # Remove the relation between order and previous invoice
#     previous_invoice = Invoice.objects.filter(order=order).first()
#     if previous_invoice:
#         previous_invoice.order = None
#         previous_invoice.save()
#
#     telegram_invoice = telegram_invoice_request(
#         user=user,
#         order=order,
#         currency_code=currency_code,
#         auto_conversion_currency_code=auto_conversion_currency_code
#     )
#
#     logger.debug("Telegram invoice created", {"order_id": order.id})
#
#     invoice = Invoice(
#         user=user,
#         order=order,
#         amount=order.total_amount,
#         telegram_invoice_id=telegram_invoice["data"]["id"],
#         currency_code=telegram_invoice["data"]["amount"]["currencyCode"],
#         auto_conversion_currency_code=telegram_invoice["data"]["autoConversionCurrency"],
#         payment_link=telegram_invoice["data"]["payLink"],
#         direct_payment_link=telegram_invoice["data"]["directPayLink"],
#         expiration_date=telegram_invoice["data"]["expirationDateTime"]
#     )
#     invoice.save()
#
#     logger.debug("Invoice created", {"invoice_id": invoice.id})
#
#     return invoice
