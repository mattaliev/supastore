import graphene

from product.schemas.schema import ProductCreateInput, ProductUpdateInput
from product.services import product_create, product_update, product_delete

__all__ = [
    "Mutation",
    "ProductCreateMutation",
    "ProductUpdateMutation",
    "ProductDeleteMutation"
]


class ProductCreateMutation(graphene.Mutation):
    class Arguments:
        input = ProductCreateInput(required=True)

    product = graphene.Field("product.schemas.schema.ProductType")

    def mutate(self, info, input, **kwargs):
        product = product_create(**input)
        return ProductCreateMutation(product=product)


class ProductUpdateMutation(graphene.Mutation):
    class Arguments:
        input = ProductUpdateInput(required=True)

    product = graphene.Field("product.schemas.schema.ProductType")

    def mutate(self, info, input, **kwargs):
        product = product_update(**input)
        return ProductUpdateMutation(product=product)


class ProductDeleteMutation(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id, **kwargs):
        product_delete(id=id)
        return ProductDeleteMutation(success=True)


class Mutation(graphene.ObjectType):
    product_create = ProductCreateMutation.Field()
    product_update = ProductUpdateMutation.Field()
    product_delete = ProductDeleteMutation.Field()
