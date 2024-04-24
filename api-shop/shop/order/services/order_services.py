import logging
from uuid import UUID

from django.contrib.auth import get_user_model

from analytics.services import order_created_register
from cart.models import Cart
from core.models import EntityStateChoices
from order.models import (
    Order,
    OrderItem,
    PaymentStatusChoices,
    FulfillmentStatusChoices
)
from shipping.models.shipping import Shipping
from telegram.services.shop.marketing import (
    telegram_order_confirmation_to_user_send,
    telegram_order_confirmation_to_admin_send
)

User = get_user_model()

__all__ = [
    "order_list",
    "order_get_by_id",
    "order_get_by_cart_id",
    "order_create",
    "order_payment_status_update",
    "order_status_update",
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
        orders = orders.filter(payment_status=payment_status)

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
            subtotal_amount=cart.get_total_price(),
            shipping=shipping
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                variant=item.variant,
                quantity=item.quantity,
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
        print(order)
        return order
    except Exception as e:
        print(e)


def order_payment_status_update(*, order_id: UUID, status: str) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug("Updating order payment status",
                 {"order_id": order_id, "status": status})

    order = Order.objects.filter(pk=order_id).first()

    if order is None:
        raise ValueError("Order not found")

    if status == "ORDER_PAID":
        order.payment_status = PaymentStatusChoices.PAID
        # order.order_status = "PROCESSING"
        order.state = "INACTIVE"
        order.cart.state = EntityStateChoices.INACTIVE
        order.invoice.payment_status = "PAID"
        order.invoice.save()
    elif status == "ORDER_FAILED":
        # order.order_status = "PENDING"
        order.invoice.payment_status = "ACTIVE"
        order.invoice.save()
        order.invoice = None

    order.save()
    order.cart.save()

    telegram_order_confirmation_to_user_send(order=order)
    telegram_order_confirmation_to_admin_send(order=order)

    return order


def order_status_update(
        *,
        order_id: UUID,
        payment_status: PaymentStatusChoices = None,
        fulfilment_status: FulfillmentStatusChoices = None,
        notify_customer: bool = False
) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug(
        "Updating order status", {
            "order_id": order_id,
            "payment_status": payment_status,
            "fulfilment_status": fulfilment_status
        }
    )

    order = Order.objects.filter(pk=order_id).first()

    if order is None:
        raise ValueError("Order not found")

    if payment_status:
        order.payment_status = payment_status

    if fulfilment_status:
        order.fulfilment_status = fulfilment_status

    # Write some logic to notify user if status changes

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
