import logging
from uuid import UUID

from core.exceptions import NotFoundError, ServerError
from core.models import EntityStateChoices, Image
from product.models import (
    ProductVariant,
    Product,
    ProductVariantCharacteristics,
    ProductVariantImage,
    ProductVariantSize
)

__all__ = [
    "product_variant_list",
    "product_variant_detail",
    "product_create",
    "product_update",
    "product_variant_create",
    "product_variant_update",
    "product_variant_size_create",
    "product_variant_size_update",
    "product_variant_image_create",
    "product_variant_characteristics_create",
    "product_variant_delete",
    "product_delete"
]


def product_detail(*, id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug("Fetching product with id: %s", id)

    try:
        product = Product.objects.filter(variants__id=id).first()
        charcs = ProductVariantCharacteristics.objects.all().first()
        return product
    except Product.DoesNotExist as e:
        raise NotFoundError(str(e))
    except Exception as e:
        raise ServerError(str(e))


def product_variant_list(*, store_id: UUID, state: EntityStateChoices = None):
    logger = logging.getLogger(__name__)
    logger.debug("Fetching all products. State: %s", state if state else "All")

    if state:
        return ProductVariant.objects.filter(store_id=store_id, state=state)

    return ProductVariant.objects.filter(store_id=store_id)


def product_variant_detail(id: UUID) -> ProductVariant:
    logger = logging.getLogger(__name__)
    logger.debug("Fetching product with id: %s", id)

    try:
        product = ProductVariant.objects.get(pk=id)
        return product
    except ProductVariant.DoesNotExist as e:
        raise NotFoundError(str(e))
    except Exception as e:
        raise ServerError(str(e))


def product_create(
        *,
        store_id: UUID,
        category_id: UUID,
        variants: list[dict] = [],
) -> Product:
    product = Product.objects.create(
        store_id=store_id,
        category_id=category_id,
    )

    for variant in variants:
        product_variant_create(
            store_id=store_id,
            product_id=product.id,
            **variant
        )

    return product


def product_update(
        *,
        product_id: UUID,
        store_id: UUID,
        category_id: UUID,
        variants: list[dict] = [],
) -> Product:
    product = Product.objects.get(pk=product_id)
    product.category_id = category_id
    product.save()

    for variant in variants:
        product_variant_update(
            product_id=product.id,
            store_id=store_id,
            **variant
        )

    return product


def product_variant_create(
        *,
        store_id: UUID,
        product_id: UUID,
        name: str,
        short_description: str = None,
        description: str = None,
        brand: str = None,
        sku: str,
        wb_id: int = None,
        state: EntityStateChoices = EntityStateChoices.ACTIVE,
        sizes: list[dict] = [],
        images: list[str] = [],
        characteristics: list[dict] = [],
):
    product_variant = ProductVariant.objects.create(
        product_id=product_id,
        store_id=store_id,
        name=name,
        short_description=short_description,
        description=description,
        brand=brand,
        sku=sku,
        wb_id=wb_id,
        state=state
    )

    for size in sizes:
        product_variant_size_create(
            product_variant_id=product_variant.id,
            **size
        )

    for image_url in images:
        product_variant_image_create(
            product_variant_id=product_variant.id,
            image_url=image_url
        )

    for characteristic in characteristics:
        product_variant_characteristics_create(
            product_variant_id=product_variant.id,
            **characteristic
        )

    return product_variant


def product_variant_update(
        *,
        product_variant_id: UUID = None,
        product_id: UUID,
        store_id: UUID,
        name: str,
        short_description: str = None,
        description: str = None,
        brand: str = None,
        sku: str,
        wb_id: int = None,
        state: EntityStateChoices = EntityStateChoices.ACTIVE,
        sizes: list[dict] = [],
        images: list[str] = [],
        characteristics: list[dict] = [],
):
    product_variant, created = ProductVariant.objects.update_or_create(
        id=product_variant_id,
        defaults={
            "product_id": product_id,
            "store_id": store_id,
            "name": name,
            "short_description": short_description,
            "description": description,
            "brand": brand,
            "sku": sku,
            "wb_id": wb_id,
            "state": state
        }
    )

    # Only keep the sizes that are in the sizes list
    (ProductVariantSize.objects.filter(product_variant_id=product_variant.id)
     .exclude(id__in=[size.get("product_variant_size_id") for size in sizes])
     .delete())

    for size in sizes:
        product_variant_size_update(
            product_variant_id=product_variant.id,
            **size
        )

    product_variant.images.all().delete()

    for image in images:
        product_variant_image_create(
            product_variant_id=product_variant.id,
            image_url=image
        )

    product_variant.product_characteristics.all().delete()

    for characteristic in characteristics:
        product_variant_characteristics_create(
            product_variant_id=product_variant.id,
            **characteristic
        )

    return product_variant


def product_variant_size_create(
        *,
        product_variant_id: UUID,
        size_en: str = None,
        size_ru: str = None,
        price: str,
        discount_price: str = None
):
    return ProductVariantSize.objects.create(
        product_variant_id=product_variant_id,
        size_en=size_en,
        size_ru=size_ru,
        price=price,
        discount_price=discount_price
    )


def product_variant_size_update(
        *,
        product_variant_id: UUID,
        product_variant_size_id: UUID = None,
        size_en: str = None,
        size_ru: str = None,
        price: str,
        discount_price: str = None
):
    return ProductVariantSize.objects.update_or_create(
        id=product_variant_size_id,
        defaults={
            "product_variant_id": product_variant_id,
            "size_en": size_en,
            "size_ru": size_ru,
            "price": price,
            "discount_price": discount_price
        }
    )


def product_variant_image_create(
        *,
        product_variant_id: UUID,
        image_url: str,
        order: int = 0,
):
    image, created = Image.objects.get_or_create(url=image_url)

    return ProductVariantImage.objects.create(
        product_variant_id=product_variant_id,
        image=image,
        order=order
    )


def product_variant_characteristics_create(
        *,
        product_variant_id: UUID,
        characteristic_id: UUID,
        value: list[str]
) -> ProductVariantCharacteristics:
    return ProductVariantCharacteristics.objects.create(
        product_variant_id=product_variant_id,
        characteristic_id=characteristic_id,
        value=value
    )


def product_delete(id: UUID) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Deleting product with id: %s", id)
    Product.objects.get(pk=id).delete()


def product_variant_delete(id: UUID) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Deleting product variant with id: %s", id)
    ProductVariant.objects.get(pk=id).delete()
