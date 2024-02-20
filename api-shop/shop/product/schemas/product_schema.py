import logging

import graphene
from graphene_django import DjangoObjectType

from product.models.product import Product, ProductVariant, ProductImage
from product.services.product_services import product_list, product_detail

__all__ = [
    "ProductType",
    "ProductVariantType",
    "ProductImageType",
    "Query",
]


class ProductType(DjangoObjectType):
    state = graphene.Field('core.schemas.EntityState')

    class Meta:
        model = Product
        fields = "__all__"


class ProductVariantType(DjangoObjectType):
    state = graphene.Field('core.schemas.EntityState')

    class Meta:
        model = ProductVariant
        fields = "__all__"


class ProductImageType(DjangoObjectType):
    url = graphene.String(required=True)

    class Meta:
        model = ProductImage
        fields = ["id", "image", "order"]

    def resolve_url(self, info):
        return self.image.url


class Query(graphene.ObjectType):
    products_get = graphene.List(ProductType)
    product_detail = graphene.Field(ProductType, id=graphene.UUID())

    def resolve_products_get(self, info, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Fetching all products")
        return product_list()

    def resolve_product_detail(self, info, id):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Fetching product with id: %s", id)
        return product_detail(id)


schema = graphene.Schema(query=Query)
