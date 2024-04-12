from decimal import Decimal
from uuid import UUID
import logging

from core.models import Image
from product.models.product import Product, ProductImage, ProductVariant


__all__ = [
    "product_list",
    "product_detail",
    "product_create",
    "product_update",
    "product_delete",
    "product_images_create",
    "product_variants_create"
]


def product_list():
    logger = logging.getLogger(__name__)
    logger.debug("Fetching all products")
    return Product.objects.all()


def product_detail(id: UUID) -> Product:
    logger = logging.getLogger(__name__)
    logger.debug("Fetching product with id: %s", id)
    return Product.objects.get(pk=id)


def product_create(
    *,
    title: str,
    description: str = None,
    price: str,
    sku: str,
    quantity: int = None,
    image_urls: list[str] = [],
    variants: list[dict] = []
) -> Product:
    logger = logging.getLogger(__name__)
    logger.debug("Creating product with title: %s", title)

    product = Product.objects.create(
        title=title,
        description=description,
        price=Decimal(price),
        sku=sku,
        quantity=quantity
    )

    product_images_create(product_id=product.id, image_urls=image_urls)

    product_variants_create(product_id=product.id, variants=variants)

    return product


def product_update(
    *,
    product_id: UUID,
    title: str,
    description: str = None,
    price: str,
    sku: str,
    quantity: int = None,
    image_urls: list[str] = [],
    variants: list[dict] = []
) -> Product:
    logger = logging.getLogger(__name__)
    logger.debug("Updating product with id: %s", product_id)

    product = Product.objects.get(pk=product_id)

    product.title = title
    product.description = description
    product.price = Decimal(price)
    product.sku = sku
    product.quantity = quantity
    product.save()

    ProductImage.objects.filter(product=product).delete()
    product_images_create(product_id=product_id, image_urls=image_urls)

    ProductVariant.objects.filter(product=product).delete()
    product_variants_create(product_id=product_id, variants=variants)

    return product


def product_delete(id: UUID) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Deleting product with id: %s", id)
    Product.objects.get(pk=id).delete()


def product_images_create(
    *,
    product_id: UUID,
    image_urls: list[str] = []
) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Creating images for product with id: %s", product_id)

    images = [Image.objects.get_or_create(url=image)[0] for image in image_urls]

    for index, image in enumerate(images):
        ProductImage.objects.create(
            product_id=product_id,
            image=image,
            order=index
        )


def product_variants_create(
    *,
    product_id: UUID,
    variants: list[dict] = []
) -> None:
    logger = logging.getLogger(__name__)
    logger.debug("Creating variants for product with id: %s", product_id)

    for index, variant in enumerate(variants):
        ProductVariant.objects.create(
            product_id=product_id,
            size=variant.get("size") if variant.get("size") else None,
            color=variant.get("color") if variant.get("color") else None,
            material=variant.get("material") if variant.get("material") else None,
            quantity=variant.get("quantity")
        )
