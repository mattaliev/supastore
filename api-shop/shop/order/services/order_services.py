import logging
from uuid import UUID

from django.contrib.auth import get_user_model
from django.utils import timezone

from analytics.models import Event
from cart.models import Cart
from core.exceptions import NotFoundError
from core.models import EntityStateChoices
from order.models import (
    Order,
    FulfillmentStatusChoices
)
from payment.models import PaymentStatusChoices
from payment.services.payment_services import payment_create
from shipping.models.shipping import Shipping
from user.models import TelegramUser, StoreUser

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
        store_id: UUID,
        payment_status: PaymentStatusChoices = None,
        fulfilment_status: FulfillmentStatusChoices = None,
        state: EntityStateChoices = None
):
    logger = logging.getLogger(__name__)
    logger.debug("Listing orders...")

    orders = Order.objects.filter(store_id=store_id)

    if state:
        orders = orders.filter(state=state)

    if payment_status:
        orders = orders.filter(payment__payment_status=payment_status)

    if fulfilment_status:
        orders = orders.filter(fulfilment_status=fulfilment_status)

    return orders


def order_get_by_id(*, order_id: UUID, store_id: UUID, state: EntityStateChoices) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug("Getting order by id: %(order_id)s", {"order_id": order_id})

    order_queryset = Order.objects.filter(pk=order_id, store_id=store_id)

    if state:
        order_queryset = order_queryset.filter(state=state)

    order = order_queryset.first()

    return order


def order_get_by_cart_id(*, cart_id: UUID, store_id: UUID, state: EntityStateChoices) -> Order:
    logger = logging.getLogger(__name__)
    logger.debug("Getting order by cart id: %(cart_id)s", {"cart_id": cart_id})

    order_queryset = Order.objects.filter(cart_id=cart_id, store_id=store_id)

    if state:
        order_queryset = order_queryset.filter(state=state)

    order = order_queryset.first()

    return order


def order_create(
        *,
        user: User,
        cart_id: UUID,
        store_id: UUID,
        payment_method_id: UUID
) -> tuple[Order, str, dict]:
    logger = logging.getLogger(__name__)
    logger.debug(
        "Creating order. Cart ID: %(cart_id)s User ID: %(user_id)s", {
            "cart_id": cart_id, "user_id": user.id
        }
    )

    try:
        cart = Cart.objects.filter(pk=cart_id).first()
        store_user = StoreUser.objects.filter(user=user, store_id=store_id).first()

        if cart is None:
            raise NotFoundError("Cart not found")

        shipping = Shipping.objects.create(
            contact_info=store_user.default_contact_info,
            shipping_address=store_user.default_shipping_address,
        )

        order = Order.objects.create(
            user=user,
            cart=cart,
            shipping=shipping,
            store_id=store_id,
        )

        provider, payment_info = payment_create(
            order_id=order.id,
            payment_method_id=payment_method_id,
        )

        Event.register_checkout_started(order=order, store_id=store_id)

        order.refresh_from_db()

        return order, provider, payment_info
    except Exception as e:
        logger.warning("Error creating order: %(error)s", {"error": e})
        raise e


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


def can_create_order(*, user: TelegramUser, store_id: UUID, cart_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug(
        "Checking if order can be created. Cart ID: %(cart_id)s User ID: %(user_id)s", {
            "cart_id": cart_id, "user_id": user.id
        }
    )

    store_user = StoreUser.objects.filter(user=user, store_id=store_id).first()
    cart = Cart.objects.filter(id=cart_id).first()

    if not store_user or not cart or cart.user != user:
        return False

    result = (
        cart.state == EntityStateChoices.ACTIVE and
        cart.get_total_quantity() > 0 and
        store_user.default_shipping_address is not None and
        store_user.default_contact_info is not None
    )
    print(result)
    return result


def order_delete(*, order_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug("Deleting order", {"order_id": order_id})

    order = Order.objects.filter(pk=order_id).first()

    if order is None:
        return False

    order.delete()
    return True
