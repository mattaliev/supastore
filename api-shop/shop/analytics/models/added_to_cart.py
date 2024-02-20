from django.db import models
from core.models import BaseEntity
from django.conf import settings


__all__ = [
    "AddedToCart",
]


class AddedToCart(BaseEntity):
    product = models.ForeignKey(
        "product.Product",
        on_delete=models.CASCADE,
        related_name="added_to_cart",
    )

    cart = models.ForeignKey(
        "cart.Cart",
        on_delete=models.CASCADE,
        related_name="added_to_cart",
    )
    variant = models.ForeignKey(
        "product.ProductVariant",
        on_delete=models.CASCADE,
        related_name="added_to_cart",
        null=True,
        blank=True
    )
    quantity = models.PositiveIntegerField(
        default=1,
    )

    class Meta:
        db_table = "added_to_cart"
        verbose_name = "Added To Cart"
        verbose_name_plural = "Added To Cart"
        ordering = ["-created"]