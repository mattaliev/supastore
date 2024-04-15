from django.db import models
from core.models.core import BaseEntity, BaseModel


class Product(BaseEntity):
    title = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sku = models.CharField(max_length=50, null=True, blank=True)
    quantity = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = "products"
        verbose_name = "product"
        verbose_name_plural = "products"
        ordering = ["-created"]


class ProductVariant(BaseEntity):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=50, null=True, blank=True)
    color = models.CharField(max_length=50, null=True, blank=True)
    material = models.CharField(max_length=50, null=True, blank=True)
    quantity = models.IntegerField(default=0)

    class Meta:
        db_table = "product_variants"
        verbose_name = "product variant"
        verbose_name_plural = "product variants"


class ProductImage(BaseModel):
    image = models.ForeignKey("core.Image", on_delete=models.CASCADE, related_name="product_images")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    order = models.IntegerField(default=0)

    class Meta:
        db_table = "product_images"
        verbose_name = "product image"
        verbose_name_plural = "product images"
        ordering = ["order"]

