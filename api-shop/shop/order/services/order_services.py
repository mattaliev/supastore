import logging
from uuid import UUID

from django.contrib.auth import get_user_model
from django.utils import timezone

from analytics.services import order_created_register
from cart.models import Cart
from core.models import EntityStateChoices
from order.models import (
    Order,
    FulfillmentStatusChoices
)
from payment.models import PaymentStatusChoices
from shipping.models.shipping import Shipping

User = get_user_model()

__all__ = [
    "order_list",
    "order_get_by_id",
    "order_get_by_cart_id",
    "order_create",
    "order_fulfilment_status_update",
    "order_delete"
]


def order_list(
        *,
        payment_status: PaymentStatusChoices = None,
        fulfilment_status: FulfillmentStatusChoices = None,
        state: EntityStateChoices = None
):
    logger = logging.getLogger(__name__)
    logger.debug("Listing orders...")

    orders = Order.objects.all()

    if state:
        orders = orders.filter(state=state)

    if payment_status:
        orders = orders.filter(payment__payment_status=payment_status)

    if fulfilment_status:
        orders = orders.filter(fulfilment_status=fulfilment_status)

    return orders


def order_get_by_id(*, order_id: UUID, state: EntityStateChoices) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug("Getting order by id: %(order_id)s", {"order_id": order_id})

    order_queryset = Order.objects.filter(pk=order_id)

    if state:
        order_queryset = order_queryset.filter(state=state)

    order = order_queryset.first()

    return order


def order_get_by_cart_id(*, cart_id: UUID, state: EntityStateChoices) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug("Getting order by cart id: %(cart_id)s", {"cart_id": cart_id})

    order_queryset = Order.objects.filter(cart_id=cart_id)

    if state:
        order_queryset = order_queryset.filter(state=state)

    order = order_queryset.first()

    return order


def order_create(*, user_id: UUID, cart_id: UUID) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug("Creating order", {"cart_id": cart_id, "user_id": user_id})

    try:

        cart = Cart.objects.filter(pk=cart_id).first()

        if cart is None:
            raise ValueError("Cart not found")

        shipping = Shipping.objects.create()
        order = Order.objects.create(
            cart=cart,
            shipping=shipping
        )

        user = User.objects.filter(pk=user_id).first()

        if user is not None:
            logger.debug("User found")
            order.user = user

            if user.has_default_shipping_details:
                logger.debug("User has shipping details")
                order.shipping.details = user.shipping_details

        order.save()

        order_created_register(order=order)
        return order
    except Exception as e:
        print(e)


def order_fulfilment_status_update(
        *,
        order_id: UUID,
        fulfilment_status: FulfillmentStatusChoices,
        notify_customer: bool = False
) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug(
        "Updating order status. Order: %(order_id)s. Status: %(status)s", {
            "order_id": order_id,
            "status": fulfilment_status
        }
    )

    order = Order.objects.filter(pk=order_id).first()

    if order is None:
        raise ValueError("Order not found")

    order.fulfilment_status = fulfilment_status
    order.fulfilment_date = timezone.now()

    # Write some logic to notify user if status changes
    if notify_customer:
        pass

    order.save()

    return order


def order_delete(*, order_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug("Deleting order", {"order_id": order_id})

    order = Order.objects.filter(pk=order_id).first()

    if order is None:
        return False

    order.delete()
    return True
