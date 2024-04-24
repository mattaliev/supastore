import random
from decimal import Decimal

from django.conf import settings
from django.db import models

from core.models.core import BaseEntity

__all__ = [
    "PaymentStatusChoices",
    "FulfillmentStatusChoices",
    "Order",
    "OrderItem"
]


class PaymentStatusChoices(models.TextChoices):
    PENDING = "PENDING", "pending"
    PAID = "PAID", "paid"
    REFUNDED = "REFUNDED", "refunded"
    EXPIRED = "EXPIRED", "expired"


class FulfillmentStatusChoices(models.TextChoices):
    UNFULFILLED = "PENDING", "pending"
    FULFILLED = "FULFILLED", "fulfilled"
    TRACKING = "TRACKING", "tracking"
    CANCELLED = "CANCELLED", "cancelled"


class OrderStatusChoices(models.TextChoices):
    PENDING = "PENDING", "pending"
    PROCESSING = "PROCESSING", "processing"
    SHIPPED = "SHIPPED", "SHIPPED"
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
    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_amount = models.DecimalField(max_digits=10, decimal_places=2,
                                          default=Decimal("0.00"))
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatusChoices.choices,
        default=PaymentStatusChoices.PENDING
    )

    fulfilment_status = models.CharField(
        max_length=20,
        choices=FulfillmentStatusChoices.choices,
        default=FulfillmentStatusChoices.UNFULFILLED
    )

    @property
    def has_shipping_details(self):
        return self.shipping.details is not None

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()

        self.total_amount = self.subtotal_amount
        if self.shipping:
            self.total_amount += self.shipping.shipping_amount

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


class OrderItem(BaseEntity):
    order = models.ForeignKey(Order, on_delete=models.CASCADE,
                              related_name="items")
    product = models.ForeignKey("product.Product", on_delete=models.CASCADE,
                                related_name="order_items")
    variant = models.ForeignKey(
        "product.ProductVariant",
        on_delete=models.CASCADE,
        related_name="order_items",
        null=True,
        blank=True
    )
    quantity = models.IntegerField(default=0)

    class Meta:
        db_table = "order_items"
        verbose_name = "order item"
        verbose_name_plural = "order items"
        # constraints = [
        #     models.UniqueConstraint(fields=['order', 'variant'],
        #                             name='unique_order_variant')
        # ]
