import graphene
from graphene_django import DjangoObjectType

from product.models.product import Product, ProductVariant, ProductImage


__all__ = [
    "ProductType",
    "ProductVariantType",
    "ProductImageType",
    "ProductInput",
    "ProductVariantInput",
    "ProductCreateInput",
    "ProductUpdateInput"
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


class ProductInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String()
    price = graphene.String(required=True)
    sku = graphene.String(required=True)
    quantity = graphene.Int()
    image_urls = graphene.List(graphene.String)
    variants = graphene.List("product.schemas.schema.ProductVariantInput")
    state = graphene.String()


class ProductVariantInput(graphene.InputObjectType):
    size = graphene.String()
    color = graphene.String()
    material = graphene.String()
    quantity = graphene.Int(required=True)


class ProductCreateInput(ProductInput):
    pass


class ProductUpdateInput(ProductInput):
    product_id = graphene.UUID(required=True)

