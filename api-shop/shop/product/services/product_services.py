from uuid import UUID
import logging
from product.models.product import Product


def product_list():
    logger = logging.getLogger(__name__)
    logger.debug("Fetching all products")
    return Product.objects.all()


def product_detail(id: UUID) -> Product:
    print("Fetching product with id: %s", id)
    logger = logging.getLogger(__name__)
    logger.debug("Fetching product with id: %s", id)
    return Product.objects.get(pk=id)
