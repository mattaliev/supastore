from django.db import models
from django.conf import settings

from core.models.core import BaseEntity


class Cart(BaseEntity):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="carts",
        null=True,
        blank=True
    )

    class Meta:
        db_table = "carts"
        verbose_name = "cart"
        verbose_name_plural = "carts"

    def get_total_price(self):
        total = 0
        for item in self.items.all():
            total += item.quantity * item.product.price
        return total

    def get_total_quantity(self):
        total = 0
        for item in self.items.all():
            total += item.quantity
        return total


class CartItem(BaseEntity):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("product.Product", on_delete=models.CASCADE, related_name="cart_items")
    variant = models.ForeignKey(
        "product.ProductVariant",
        on_delete=models.CASCADE,
        related_name="cart_items",
        null=True,
        blank=True
    )
    quantity = models.IntegerField(default=0)

    class Meta:
        db_table = "cart_items"
        verbose_name = "cart item"
        verbose_name_plural = "cart items"
        constraints = [
            models.UniqueConstraint(fields=['cart', 'variant'], name='unique_cart_variant')
        ]

