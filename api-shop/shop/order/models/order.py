import random
from decimal import Decimal

from django.db import models
from django.conf import settings

from core.models.core import BaseEntity

__all__ = [
    "OrderStatusChoices",
    "Order",
]


class OrderStatusChoices(models.TextChoices):
    PENDING = "PENDING", "pending"
    PROCESSING = "PROCESSING", "processing"
    COMPLETED = "COMPLETED", "completed"
    CANCELLED = "CANCELLED", "cancelled"
    REFUNDED = "REFUNDED", "refunded"


class Order(BaseEntity):
    order_number = models.IntegerField(unique=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
        blank=True,
        null=True
    )
    cart = models.ForeignKey("cart.Cart", on_delete=models.CASCADE, related_name="orders")
    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.CharField(
        max_length=50,
        choices=OrderStatusChoices.choices,
        default=OrderStatusChoices.PENDING
    )

    shipping_details = models.ForeignKey(
        "order.ShippingDetails",
        on_delete=models.CASCADE,
        related_name="orders",
        blank=True,
        null=True
    )

    def order_status_sort(self):
        return {
            'PENDING': 1,
            'PROCESSING': 2,
            'COMPLETED': 3,
            'CANCELLED': 4,
            'REFUNDED': 5,
        }.get(self.order_status, 6)

    @property
    def has_shipping_details(self):
        return self.shipping_details is not None

    def save(self, *args, **kwargs):
        print("Saving an order")
        if not self.order_number:
            self.order_number = self.generate_order_number()

        if self.shipping_details:
            print("Shipping amount", self.shipping_details.shipping_amount)
            self.delivery_amount = self.shipping_details.shipping_amount

        self.total_amount = self.subtotal_amount + self.delivery_amount
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



