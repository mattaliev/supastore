import logging
from uuid import UUID

from django.contrib.auth import get_user_model

from analytics.services import order_created_register
from cart.models import Cart
from order.models import Order

User = get_user_model()


def order_create(*, user_id: UUID, cart_id: UUID) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug("Creating order", {"cart_id": cart_id, "user_id": user_id})

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

