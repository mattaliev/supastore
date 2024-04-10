import logging
import graphene
from graphene_django import DjangoObjectType
from cart.models.cart import Cart, CartItem
from cart.services.cart_services import (
    cart_create,
    cart_add_to,
    cart_remove_from,
    cart_update_item
)
from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED


class CartType(DjangoObjectType):
    items = graphene.List('cart.schemas.CartItemType', required=True)
    state = graphene.Field("core.schemas.EntityState")
    total_price = graphene.Float()
    total_quantity = graphene.Int()

    class Meta:
        model = Cart
        fields = ["id", "user", "created", "updated", "state"]

    def resolve_items(self, info):
        return self.items.all()

    def resolve_total_price(self, info):
        return self.get_total_price()

    def resolve_total_quantity(self, info):
        return self.get_total_quantity()


class CartItemType(DjangoObjectType):
    product = graphene.Field('product.schemas.ProductType', required=True)
    variant = graphene.Field('product.schemas.ProductVariantType')

    class Meta:
        model = CartItem
        fields = ["id", "product", "variant", "quantity", "created", "updated"]

    def resolve_product(self, info):
        return self.product

    def resolve_variant(self, info):
        return self.variant


class AddToCartInput(graphene.InputObjectType):
    cart_id = graphene.UUID(required=True)
    product_id = graphene.UUID(required=True)
    variant_id = graphene.UUID()
    quantity = graphene.Int(default_value=1)


class RemoveFromCartInput(graphene.InputObjectType):
    cart_id = graphene.UUID(required=True)
    cart_item_id = graphene.UUID(required=True)
    quantity = graphene.Int(default_value=1)


class CartItemUpdateInput(graphene.InputObjectType):
    cart_id = graphene.UUID(required=True)
    cart_item_id = graphene.UUID(required=True)
    quantity = graphene.Int(required=True)


class CartCreateMutation(graphene.Mutation):
    cart = graphene.Field(CartType)

    class Arguments:
        user_id = graphene.UUID()

    def mutate(self, info, user_id=None, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Creating cart for user_id: %s", user_id)

        cart = cart_create(user_id=user_id)
        return CartCreateMutation(cart=cart)


class AddToCartMutation(graphene.Mutation):
    cart = graphene.Field(CartType)

    class Arguments:
        input = AddToCartInput(required=True)

    def mutate(self, info, input, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Adding item to cart")

        cart = cart_add_to(**input)

        return AddToCartMutation(cart=cart)


class RemoveFromCartMutation(graphene.Mutation):
    cart = graphene.Field(CartType)

    class Arguments:
        input = RemoveFromCartInput(required=True)

    def mutate(self, info, input, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Removing item from cart")

        cart = cart_remove_from(**input)
        return RemoveFromCartMutation(cart=cart)


class CartItemUpdateMutation(graphene.Mutation):
    cart = graphene.Field(CartType)

    class Arguments:
        input = CartItemUpdateInput(required=True)

    def mutate(self, info, input, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Updating item in cart")

        cart = cart_update_item(**input)
        return CartItemUpdateMutation(cart=cart)


class Query(graphene.ObjectType):
    carts = graphene.List(CartType)
    cart_get = graphene.Field(CartType, cart_id=graphene.UUID(required=True))

    def resolve_carts(self, info, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Getting all carts")
        if not info.context.user.is_staff:
            raise UNAUTHORIZED()

        carts = Cart.objects.all()
        return carts

    def resolve_cart_get(self, info, cart_id, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Getting cart detail for id: %s", cart_id)

        try:
            cart = Cart.objects.get(pk=cart_id, state="ACTIVE")
        except Cart.DoesNotExist:
            cart = None

        return cart


class Mutation(graphene.ObjectType):
    add_to_cart = AddToCartMutation.Field()
    remove_from_cart = RemoveFromCartMutation.Field()
    cart_create = CartCreateMutation.Field()
    cart_item_update = CartItemUpdateMutation.Field()
