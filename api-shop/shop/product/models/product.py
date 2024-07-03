from django.contrib.postgres.fields import ArrayField
from django.db import models

from core.models.core import BaseEntity


class Product(BaseEntity):
    category = models.ForeignKey("category.Category", on_delete=models.CASCADE, related_name="products")
    store = models.ForeignKey("store.Store", on_delete=models.CASCADE, related_name="products")

    class Meta:
        db_table = "products"
        verbose_name = "product"
        verbose_name_plural = "products"
        ordering = ["-created"]


class ProductVariant(BaseEntity):
    product = models.ForeignKey("product.Product", on_delete=models.CASCADE, related_name="variants")
    store = models.ForeignKey("store.Store", on_delete=models.CASCADE, related_name="product_variants")
    name = models.CharField(max_length=50)
    short_description = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    brand = models.CharField(max_length=50, null=True, blank=True)
    sku = models.CharField(max_length=50)
    wb_id = models.IntegerField(null=True, blank=True)
    order_display = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "product_variants"
        verbose_name = "product variant"
        verbose_name_plural = "product variants"
        ordering = ["order_display"]


class ProductVariantSize(BaseEntity):
    product_variant = models.ForeignKey("product.ProductVariant", on_delete=models.CASCADE, related_name="sizes")
    size_en = models.CharField(max_length=50, null=True, blank=True)
    size_ru = models.CharField(max_length=50, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = "product_variant_sizes"
        verbose_name = "product variant size"
        verbose_name_plural = "product variant sizes"
        ordering = ["created"]


class ProductVariantImage(BaseEntity):
    product_variant = models.ForeignKey("product.ProductVariant", on_delete=models.CASCADE, related_name="images")
    image = models.ForeignKey("core.Image", on_delete=models.CASCADE)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = "product_variant_images"
        verbose_name = "product variant image"
        verbose_name_plural = "product variant images"
        ordering = ["order"]


class ProductVariantCharacteristics(BaseEntity):
    product_variant = models.ForeignKey("product.ProductVariant", on_delete=models.CASCADE, related_name="product_characteristics")
    characteristic = models.ForeignKey("category.Characteristic", on_delete=models.CASCADE)
    value = ArrayField(models.CharField(max_length=100))

    class Meta:
        db_table = "product_variant_characteristics"
        verbose_name = "product variant characteristic"
        verbose_name_plural = "product variant characteristics"
        ordering = ["-created"]

