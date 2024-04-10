import logging
from uuid import UUID

from django.contrib.auth import get_user_model

from analytics.services import order_created_register
from cart.models import Cart
from order.models import Order
from telegram.services.shop.marketing import telegram_order_confirmation_to_user_send, \
    telegram_order_confirmation_to_admin_send

User = get_user_model()

__all__ = [
    "order_create",
    "order_payment_status_update",
]


def order_create(*, user_id: UUID, cart_id: UUID) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug("Creating order", {"cart_id": cart_id, "user_id": user_id})

    try:

        cart = Cart.objects.filter(pk=cart_id).first()

        if cart is None:
            raise ValueError("Cart not found")

        order = Order(
            cart=cart,
            subtotal_amount=cart.get_total_price(),
        )

        user = User.objects.filter(pk=user_id).first()

        if user is not None:
            logger.debug("User found")
            order.user = user

            if user.has_default_shipping_details:

                logger.debug("User has shipping details")
                order.shipping_details = user.shipping_details

        order.save()

        order_created_register(order=order)

        return order
    except Exception as e:
        print(e)


def order_payment_status_update(*, order_id: UUID, status: str) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug("Updating order payment status", {"order_id": order_id, "status": status})

    order = Order.objects.filter(pk=order_id).first()

    if order is None:
        raise ValueError("Order not found")

    if status == "ORDER_PAID":
        order.order_status = "PROCESSING"
        order.state = "INACTIVE"
        order.cart.state = "INACTIVE"
        order.invoice.payment_status = "PAID"
        order.invoice.save()
    elif status == "ORDER_FAILED":
        order.order_status = "PENDING"
        order.invoice.payment_status = "ACTIVE"
        order.invoice.save()
        order.invoice = None

    order.save()
    order.cart.save()

    telegram_order_confirmation_to_user_send(order=order)
    telegram_order_confirmation_to_admin_send(order=order)

    return order

