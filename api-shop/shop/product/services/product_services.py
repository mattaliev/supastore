import hashlib
import logging
from typing import List
from uuid import UUID

import requests
from django.conf import settings
from google.cloud import storage

from apps.apis import WbAPI
from category.models import Category, Characteristic
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
    "product_delete",
    "product_variants_order_set",
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


def product_variants_order_set(product_ids: List[UUID]):
    logger = logging.getLogger(__name__)
    logger.debug("Setting the order of product variants")

    for idx, variant_id in enumerate(product_ids):
        ProductVariant.objects.filter(id=variant_id).update(order_display=idx)


def product_variant_import_from_wb(
        *,
        store_id: UUID,
        wb_api_token: str,
        overwrite_existing_products: bool = False
):
    logger = logging.getLogger(__name__)
    logger.debug("Fetching product variants from Wildberries")

    wb_api = WbAPI(wb_api_token)
    wb_products = wb_api.get_all_products()
    wb_sizes = wb_api.get_all_product_sizes()

    bulk_products_from_wb_create(
        store_id=store_id,
        products=wb_products,
        sizes=wb_sizes,
        overwrite_existing_products=overwrite_existing_products
    )


def bulk_products_from_wb_create(
        *,
        store_id: UUID,
        products: list[dict],
        sizes: list[dict],
        overwrite_existing_products: bool = False
):
    logger = logging.getLogger(__name__)
    logger.debug("Creating products from Wildberries")

    for wb_product in products:
        product_wb_id = wb_product["imtID"]
        product_variant_wb_id = wb_product["nmID"]
        product_variant = ProductVariant.objects.filter(wb_id=product_variant_wb_id).first()

        if product_variant and not overwrite_existing_products:
            continue

        product = Product.objects.filter(wb_id=product_wb_id).first()

        if not product:
            category = Category.objects.filter(wb_id=wb_product["subjectID"]).first()
            product, _ = Product.objects.create(
                wb_id=product_wb_id,
                category=category,
                store_id=store_id
            )

        product_variant, _ = ProductVariant.objects.update_or_create(
            wb_id=product_variant_wb_id,
            defaults={
                "product": product,
                "store_id": store_id,
                "name": wb_product["title"],
                "description": wb_product["description"],
                "brand": wb_product["brand"],
                "sku": wb_product["vendorCode"]
            }
        )

        product_variant_images_from_wb_create(product_variant=product_variant, images_dict=wb_product["photos"])

        sizes_with_price = filter(lambda size: size["nmID"] == product_variant_wb_id, sizes)
        wb_product_sizes = wb_product["sizes"]

        product_variant_sizes_from_wb_create(
            product_variant=product_variant,
            sizes=wb_product_sizes,
            sizes_with_price=sizes_with_price
        )

        product_variant_characteristics_from_wb_create(product_variant=product_variant, characteristics=wb_product["characteristics"])


def product_variant_images_from_wb_create(*, product_variant: ProductVariant, images_dict: list[dict]):
    logger = logging.getLogger(__name__)
    storage_client = storage.Client()
    bucket = storage_client.bucket(settings.GS_BUCKET_NAME)

    for idx, image in enumerate(images_dict):
        try:
            response = requests.get(image["big"])
            response.raise_for_status()

            hash_object = hashlib.sha256(image["big"].encode())
            image_url_hash = hash_object.hexdigest()

            image_data = response.content
            image_extension = image["big"].split(".")[-1]
            destination_blob_name = (
                f"store/{product_variant.store_id}/"
                f"product_images/{product_variant.id}"
                f"/{image_url_hash}.{image_extension}"
            )

            blob = bucket.blob(destination_blob_name)
            blob.upload_from_string(image_data, content_type=response.headers["Content-Type"])

            blob.make_public()

            product_variant_image_create(
                product_variant_id=product_variant.id,
                image_url=blob.public_url,
                order=idx
            )

        except Exception as e:
            logger.warning("Error uploading image: %s with error: %e", image["big"])
            continue


def product_variant_sizes_from_wb_create(
        *,
        product_variant: ProductVariant,
        sizes: list[dict],
        sizes_with_price: list[dict]
):
    logger = logging.getLogger(__name__)

    for size in sizes:
        price = next(
            filter(
                lambda size_with_price: size_with_price["sizeID"] == size["chrtID"]
                , sizes_with_price
            ), None
        )

        if not price:
            logger.warning("Could not find price for size: %s", size["chrtID"])
            continue

        ProductVariantSize.objects.update_or_create(
            wb_id=size["chrtId"],
            defaults={
                "product_variant": product_variant,
                "size_en": size["techSize"],
                "size_ru": size["wbSize"],
                "price": price["price"]
            }
        )


def product_variant_characteristics_from_wb_create(*, product_variant: ProductVariant, wb_characteristics: list[dict]):
    for wb_characteristic in wb_characteristics:
        characteristic = Characteristic.objects.filter(wb_id=wb_characteristic["id"]).first()

        if not characteristic:
            continue

        ProductVariantCharacteristics.objects.update_or_create(
            product_variant=product_variant,
            characteristic=characteristic,
            defaults={
                "value": wb_characteristic["value"]
            }
        )



