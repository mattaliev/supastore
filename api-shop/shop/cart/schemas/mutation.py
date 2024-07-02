import graphene

from cart.models import Cart
from cart.schemas.schema import (
    AddToCartInput,
    RemoveFromCartInput,
    CartItemUpdateInput
)
from cart.services.cart_services import (
    cart_create,
    cart_add_to,
    cart_remove_from,
    cart_update_item
)
from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED

__all__ = [
    "Mutation"
]


class CartCreateMutation(graphene.Mutation):
    class Arguments:
        store_id = graphene.UUID(required=True)

    cart = graphene.Field("cart.schemas.CartType")

    def mutate(self, info, store_id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        cart = cart_create(user_id=user.id, store_id=store_id)
        return CartCreateMutation(cart=cart)


class AddToCartMutation(graphene.Mutation):
    cart = graphene.Field("cart.schemas.CartType")

    class Arguments:
        input = AddToCartInput(required=True)

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        cart = Cart.objects.get(pk=input.cart_id)

        if not user.can_access_resource(cart):
            raise UNAUTHORIZED()

        cart = cart_add_to(**input)

        return AddToCartMutation(cart=cart)


class RemoveFromCartMutation(graphene.Mutation):
    cart = graphene.Field("cart.schemas.CartType")

    class Arguments:
        input = RemoveFromCartInput(required=True)

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        cart = Cart.objects.get(pk=input.cart_id)

        if not user.can_access_resource(cart):
            raise UNAUTHORIZED()

        cart = cart_remove_from(**input)

        return RemoveFromCartMutation(cart=cart)


class CartItemUpdateMutation(graphene.Mutation):
    cart = graphene.Field("cart.schemas.CartType")

    class Arguments:
        input = CartItemUpdateInput(required=True)

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise UNAUTHENTICATED()

        cart = Cart.objects.get(pk=input.cart_id)

        if not user.can_access_resource(cart):
            raise UNAUTHORIZED()

        cart = cart_update_item(**input)
        return CartItemUpdateMutation(cart=cart)


class Mutation(graphene.ObjectType):
    add_to_cart = AddToCartMutation.Field()
    remove_from_cart = RemoveFromCartMutation.Field()
    cart_create = CartCreateMutation.Field()
    cart_item_update = CartItemUpdateMutation.Field()
