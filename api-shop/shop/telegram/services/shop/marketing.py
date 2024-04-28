import logging

from django.conf import settings

from order.models import Order
from telegram.services import telegram_shop_message_send
from telegram.services.shop.inline_buttons import ContactSupportInlineButton, \
    OpenShopInlineButton

__all__ = [
    "telegram_order_confirmation_to_user_send",
    "telegram_order_confirmation_to_admin_send"
]


def telegram_order_confirmation_to_user_send(order: Order):
    """
    Send order confirmation to user
    """
    logger = logging.getLogger(__name__)
    logger.debug("Sending order confirmation", {"order_id": order.id})

    if not order.user.allows_notifications:
        logger.warning("User does not allow notifications",
                       {"user_id": order.user.id})
        return

    message = f"Order {order.order_number} has been confirmed\\. We will notify you once it's shipped\\."

    reply_markup = [
        [OpenShopInlineButton(text="🛍Continue Shopping").as_json()],
        [ContactSupportInlineButton(
            text="Contact Support About This Order").as_json()]
    ]

    telegram_shop_message_send(
        chat_id=order.user.telegram_id,
        text=message,
        reply_markup=reply_markup
    )


def telegram_order_confirmation_to_admin_send(order: Order):
    """
    Send order confirmation to admin
    """
    logger = logging.getLogger(__name__)
    logger.debug("Sending order confirmation to admin", {"order_id": order.id})

    message = f"New order: {order.order_number}\n"

    for item in order.cart.items.all():
        message += f"{item.product.title} "
        if item.variant is not None:
            message += f"({item.variant.size}) "

        message += f"x {item.quantity}\n\n"

    message += "\n"
    message += "Contact details:\n"
    message += f"Name: {order.shipping.details.first_name} {order.shipping.details.last_name}\n"
    message += f"Phone: {order.shipping.details.phone}\n"
    message += f"Email: {order.shipping.details.email}\n"
    message += f"Address: {order.shipping.details.address}\n"
    message += f"City: {order.shipping.details.city}\n"
    message += f"Country: {order.shipping.details.country}\n"
    message += f"Postal Code: {order.shipping.details.postcode}\n"
    message += "\n"
    message += f"Total: {order.cart.get_total_price()}\n"

    telegram_shop_message_send(
        chat_id=settings.TELEGRAM_ADMIN_CHAT_ID,
        text=message,
        parse_mode=None
    )
