import graphene
from graphene_django import DjangoObjectType

from core.schemas import PaginatedType
from product.models import (
    Product,
    ProductVariant,
    ProductVariantSize,
    ProductVariantImage,
    ProductVariantCharacteristics
)

__all__ = [
    "ProductPaginatedType",
    "ProductType",
    "ProductVariantType",
    "ProductVariantSizeType",
    "ProductVariantImageType",
    "ProductVariantCharacteristicType",
    "ProductCreateInput",
    "ProductVariantCreateInput",
    "ProductVariantSizeCreateInput",
    "ProductVariantCharacteristicInput",
    "ProductUpdateInput",
    "ProductVariantUpdateInput",
    "ProductVariantSizeUpdateInput",
]


class ProductPaginatedType(PaginatedType):
    objects = graphene.List("product.schemas.ProductVariantType")


class ProductType(DjangoObjectType):
    category = graphene.Field('category.schemas.CategoryType')

    class Meta:
        model = Product
        fields = "__all__"


class ProductVariantType(DjangoObjectType):
    images = graphene.List(graphene.String)

    def resolve_images(self, info):
        return [image.image.url for image in self.images.all().order_by("order")]

    class Meta:
        model = ProductVariant
        fields = "__all__"


class ProductVariantSizeType(DjangoObjectType):
    class Meta:
        model = ProductVariantSize
        fields = "__all__"


class ProductVariantImageType(DjangoObjectType):
    url = graphene.String(required=True)

    class Meta:
        model = ProductVariantImage
        fields = ["id", "image", "order"]

    def resolve_url(self, info):
        return self.image.url


class ProductVariantCharacteristicType(DjangoObjectType):

    class Meta:
        model = ProductVariantCharacteristics
        fields = "__all__"


class ProductCreateInput(graphene.InputObjectType):
    category_id = graphene.UUID(required=True)
    store_id = graphene.UUID(required=True)
    variants = graphene.List("product.schemas.ProductVariantCreateInput")


class ProductUpdateInput(ProductCreateInput):
    product_id = graphene.UUID(required=True)
    variants = graphene.List("product.schemas.ProductVariantUpdateInput")


class ProductVariantCreateInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    short_description = graphene.String()
    description = graphene.String()
    brand = graphene.String()
    sku = graphene.String()
    wb_id = graphene.String()
    state = graphene.String()
    sizes = graphene.List("product.schemas.ProductVariantSizeCreateInput")
    images = graphene.List(graphene.String)
    characteristics = graphene.List("product.schemas.ProductVariantCharacteristicInput")


class ProductVariantUpdateInput(ProductVariantCreateInput):
    product_variant_id = graphene.UUID()
    sizes = graphene.List("product.schemas.ProductVariantSizeUpdateInput")


class ProductVariantSizeCreateInput(graphene.InputObjectType):
    size_en = graphene.String()
    size_ru = graphene.String()
    price = graphene.String(required=True)
    discount_price = graphene.String()


class ProductVariantSizeUpdateInput(ProductVariantSizeCreateInput):
    product_variant_size_id = graphene.UUID()


class ProductVariantCharacteristicInput(graphene.InputObjectType):
    characteristic_id = graphene.UUID(required=True)
    value = graphene.List(graphene.String)
