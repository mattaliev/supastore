import graphene

from cart.services import cart_get

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    cart_get = graphene.Field("cart.schemas.CartType",
                              cart_id=graphene.UUID(required=True))

    def resolve_cart_get(self, info, cart_id, **kwargs):
        cart = cart_get(cart_id=cart_id)
        return cart

