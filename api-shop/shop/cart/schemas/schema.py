import graphene
from graphene_django import DjangoObjectType

from cart.models import CartItem, Cart

__all__ = [
    "CartType",
    "CartItemType",
    "AddToCartInput",
    "RemoveFromCartInput",
    "CartItemUpdateInput"
]


class CartType(DjangoObjectType):
    items = graphene.List('cart.schemas.CartItemType', required=True)
    state = graphene.Field("core.schemas.EntityState")
    store = graphene.Field("store.schemas.StoreType")
    total_price = graphene.Float()
    total_quantity = graphene.Int()

    class Meta:
        model = Cart
        fields = ["id", "user", "created", "updated", "state"]

    def resolve_items(self, info):
        return self.items.all()

    def resolve_store(self):
        return self.store

    def resolve_total_price(self, info):
        return self.get_total_price()

    def resolve_total_quantity(self, info):
        return self.get_total_quantity()


class CartItemType(DjangoObjectType):
    product_variant = graphene.Field("product.schemas.ProductVariantType")
    size = graphene.Field("product.schemas.ProductVariantSizeType")

    class Meta:
        model = CartItem
        fields = "__all__"


class AddToCartInput(graphene.InputObjectType):
    cart_id = graphene.UUID(required=True)
    product_variant_id = graphene.UUID(required=True)
    product_variant_size_id = graphene.UUID()
    quantity = graphene.Int(default_value=1)


class RemoveFromCartInput(graphene.InputObjectType):
    cart_id = graphene.UUID(required=True)
    cart_item_id = graphene.UUID(required=True)
    quantity = graphene.Int(default_value=1)


class CartItemUpdateInput(graphene.InputObjectType):
    cart_id = graphene.UUID(required=True)
    cart_item_id = graphene.UUID(required=True)
    quantity = graphene.Int(required=True)
