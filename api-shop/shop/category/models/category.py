from django.db import models

from core.models import BaseEntity


class Category(BaseEntity):
    parent = models.ForeignKey("category.Category", on_delete=models.SET_NULL, null=True, blank=True, related_name="children")
    wb_id = models.IntegerField()
    name_en = models.CharField(max_length=100, null=True, blank=True)
    name_ru = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = "categories"
        verbose_name = "category"
        verbose_name_plural = "categories"
        ordering = ["-created"]


class CategoryCharacteristicTypeChoices(models.TextChoices):
    STRING = "STRING", "STRING"
    NUMBER = "NUMBER", "NUMBER"
    BOOLEAN = "BOOLEAN", "BOOLEAN"
    ARRAY_STRING = "ARRAY_STRING", "ARRAY_STRING"
    ARRAY_NUMBER = "ARRAY_NUMBER", "ARRAY_NUMBER"


class Characteristic(BaseEntity):
    name_en = models.CharField(max_length=100, null=True, blank=True)
    name_ru = models.CharField(max_length=100, null=True, blank=True)
    wb_id = models.IntegerField()
    required = models.BooleanField(default=False)
    type = models.CharField(max_length=50, choices=CategoryCharacteristicTypeChoices.choices)
    max_count = models.IntegerField(default=1)
    unit_name_en = models.CharField(max_length=50, null=True, blank=True)
    unit_name_ru = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = "characteristics"
        verbose_name = "characteristic"
        verbose_name_plural = "characteristics"
        ordering = ["-created"]


class CharacteristicsChoice(BaseEntity):
    characteristic = models.ForeignKey("category.Characteristic", on_delete=models.CASCADE, related_name="choices")
    value_en = models.CharField(max_length=100)
    value_ru = models.CharField(max_length=100)

    class Meta:
        db_table = "characteristics_choices"
        verbose_name = "characteristic choice"
        verbose_name_plural = "characteristic choices"
        ordering = ["-created"]


class CategoryCharacteristic(BaseEntity):
    category = models.ForeignKey("category.Category", on_delete=models.CASCADE, related_name="characteristics")
    characteristic = models.ForeignKey("category.Characteristic", on_delete=models.CASCADE, related_name="categories")

    class Meta:
        db_table = "category_characteristics"
        verbose_name = "category characteristic"
        verbose_name_plural = "category characteristics"
        indexes = [
            models.Index(fields=["category"])
        ]
        ordering = ["-created"]


# 7284 subcategories