import random

from django.conf import settings
from django.db import models

from core.models.core import BaseEntity

__all__ = [
    "FulfillmentStatusChoices",
    "Order",
]


class FulfillmentStatusChoices(models.TextChoices):
    UNFULFILLED = "PENDING", "pending"
    FULFILLED = "FULFILLED", "fulfilled"
    TRACKING = "TRACKING", "tracking"
    CANCELLED = "CANCELLED", "cancelled"


class Order(BaseEntity):
    order_number = models.IntegerField(unique=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
        blank=True,
        null=True
    )
    cart = models.ForeignKey(
        "cart.Cart",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="orders"
    )
    shipping = models.OneToOneField(
        "shipping.Shipping",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="order"
    )
    fulfilment_status = models.CharField(
        max_length=20,
        choices=FulfillmentStatusChoices.choices,
        default=FulfillmentStatusChoices.UNFULFILLED
    )
    fulfilment_date = models.DateTimeField(null=True, blank=True)

    @property
    def has_shipping_details(self):
        return self.shipping.details is not None

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()

        super().save(*args, **kwargs)

    @staticmethod
    def generate_order_number():
        number = random.randint(10000000, 99999999)
        if Order.objects.filter(order_number=number).exists():
            return Order.generate_order_number()
        return number

    class Meta:
        db_table = "orders"
        verbose_name = "order"
        verbose_name_plural = "orders"
        ordering = ["-created"]
