from uuid import UUID

from django.db import models

from cart.models import Cart, CartItem
from core.models import BaseEntity
from order.models import Order
from payment.models import Payment
from product.models import ProductVariant
from user.models import TelegramUser

__all__ = [
    "EventTypeChoices",
    "Event",
]


class EventTypeChoices(models.TextChoices):
    PAGE_VIEWED = "PAGE_VIEWED", "page viewed"
    USER_REGISTERED = "USER_REGISTERED", "user registered"
    USER_VISITED = "USER_VISITED", "user visited"
    ADDED_TO_CART = "ADDED_TO_CART", "added to cart"
    REMOVED_FROM_CART = "REMOVED_FROM_CART", "removed from cart"
    CHECKOUT_STARTED = "CHECKOUT_STARTED", "checkout started"
    PAYMENT_STARTED = "PAYMENT_STARTED", "payment started"
    PAYMENT_COMPLETED = "PAYMENT_COMPLETED", "payment completed"


class Event(BaseEntity):
    event_type = models.CharField(
        max_length=20,
        choices=EventTypeChoices.choices
    )
    user = models.ForeignKey(
        "user.TelegramUser",
        on_delete=models.CASCADE,
        related_name="events"
    )
    store = models.ForeignKey(
        "store.Store",
        on_delete=models.CASCADE,
        related_name="events",
    )
    event_data = models.JSONField()

    class Meta:
        ordering = ["-created"]
        verbose_name = "Event"
        verbose_name_plural = "Events"

    @staticmethod
    def register_page_view(*, user: TelegramUser, store_id: UUID, page: str):
        Event.objects.create(
            event_type=EventTypeChoices.PAGE_VIEWED,
            user=user,
            store_id=store_id,
            event_data={"page": page}
        )

    @staticmethod
    def register_user_register(*, user: TelegramUser, store_id: UUID):
        Event.objects.create(
            event_type=EventTypeChoices.USER_REGISTERED,
            user=user,
            store_id=store_id,
            event_data={}
        )

    @staticmethod
    def register_user_visited(*, user: TelegramUser, store_id: UUID):
        Event.objects.create(
            event_type=EventTypeChoices.USER_VISITED,
            user=user,
            store_id=store_id,
            event_data={}
        )

    @staticmethod
    def register_added_to_cart(*, cart: Cart, cart_item: CartItem, store_id: UUID):
        Event.objects.create(
            event_type=EventTypeChoices.ADDED_TO_CART,
            user=cart.user,
            store_id=store_id,
            event_data={
                "product_variant_id": str(cart_item.product_variant.id),
                "cart_id": str(cart.id),
                "cart_total": str(cart.get_total_price()),
                "quantity": cart_item.quantity,
                "product_variant_name": cart_item.product_variant.name
            }
        )

    @staticmethod
    def register_removed_from_cart(*, cart: Cart, product: ProductVariant, store_id: UUID):
        Event.objects.create(
            event_type=EventTypeChoices.REMOVED_FROM_CART,
            user=cart.user,
            store_id=store_id,
            event_data={
                "product_id": str(product.id),
                "cart_id": str(cart.id),
                "cart_total": str(cart.get_total_price()),
                "product_name": product.name
            }
        )

    @staticmethod
    def register_checkout_started(*, order: Order, store_id: UUID):
        Event.objects.create(
            event_type=EventTypeChoices.CHECKOUT_STARTED,
            user=order.user,
            store_id=store_id,
            event_data={
                "cart_id": str(order.cart.id),
                "cart_total": str(order.cart.get_total_price()),
                "order_id": str(order.id),
                "order_number": order.order_number
            }
        )

    @staticmethod
    def register_payment_started(*, payment: Payment, store_id: UUID):
        Event.objects.create(
            event_type=EventTypeChoices.PAYMENT_STARTED,
            user=payment.order.user,
            store_id=store_id,
            event_data={
                "order_id": str(payment.order.id),
                "order_number": payment.order.order_number,
                "payment_id": str(payment.id),
                "payment_method_id": str(payment.payment_method.id),
                "payment_method_name": payment.payment_method.name,
                "payment_amount": str(payment.total_amount)
            }
        )

    @staticmethod
    def register_payment_completed(*, payment: Payment, store_id: UUID):
        Event.objects.create(
            event_type=EventTypeChoices.PAYMENT_COMPLETED,
            user=payment.order.user,
            store_id=store_id,
            event_data={
                "order_id": str(payment.order.id),
                "order_number": payment.order.order_number,
                "payment_id": str(payment.id),
                "payment_method_id": str(payment.payment_method.id),
                "payment_method_name": payment.payment_method.name,
                "payment_amount": str(payment.total_amount)
            }
        )

