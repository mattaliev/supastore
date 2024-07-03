import graphene

from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED, PermissionDeniedError
from product.schemas.schema import (
    ProductCreateInput, ProductUpdateInput
)
from product.services import (
    product_create,
    product_update,
    product_delete,
    product_variant_delete,
    product_variants_order_set
)
from store.services import can_manage_store

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
        user = info.context.user

        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=input.store_id):
            raise UNAUTHORIZED()

        product = product_create(**input)
        return ProductCreateMutation(product=product)


class ProductUpdateMutation(graphene.Mutation):
    class Arguments:
        input = ProductUpdateInput(required=True)

    product = graphene.Field("product.schemas.schema.ProductType")

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=input.store_id):
            raise UNAUTHORIZED()

        product = product_update(**input)
        return ProductUpdateMutation(product=product)


class ProductDeleteMutation(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        store_id = graphene.UUID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id, store_id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            raise UNAUTHORIZED()

        product_delete(id=id)
        return ProductDeleteMutation(success=True)


class ProductVariantDeleteMutation(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        store_id = graphene.UUID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id, store_id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            raise UNAUTHORIZED()

        product_variant_delete(id=id)
        return ProductVariantDeleteMutation(success=True)


class ProductVariantOrderSetMutationMutation(graphene.Mutation):
    class Arguments:
        store_id = graphene.UUID(required=True)
        product_ids = graphene.List(graphene.UUID, required=True)

    success = graphene.Boolean()

    def mutate(self, info, store_id, product_ids, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise PermissionDeniedError()

        if not can_manage_store(user=user, store_id=store_id):
            raise PermissionDeniedError()

        product_variants_order_set(product_ids=product_ids)
        return ProductVariantOrderSetMutationMutation(success=True)


class Mutation(graphene.ObjectType):
    product_create = ProductCreateMutation.Field()
    product_update = ProductUpdateMutation.Field()
    product_delete = ProductDeleteMutation.Field()
    product_variant_delete = ProductVariantDeleteMutation.Field()
    product_variants_order_set = ProductVariantOrderSetMutationMutation.Field()
