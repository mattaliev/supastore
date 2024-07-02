import graphene

from cart.services import cart_get, cart_get_by_user_id

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    cart_get = graphene.Field(
        "cart.schemas.CartType",
        cart_id=graphene.UUID(required=True),
        store_id=graphene.UUID(required=True)
    )
    cart_get_by_user_id = graphene.Field(
        "cart.schemas.CartType",
        store_id=graphene.UUID(required=True)
    )

    def resolve_cart_get(self, info, cart_id, store_id, **kwargs):
        cart = cart_get(cart_id=cart_id, store_id=store_id)
        return cart

    def resolve_cart_get_by_user_id(self, info, store_id, **kwargs):
        user = info.context.user

        # Don't throw error here, just return None
        if not user.is_authenticated:
            return

        cart = cart_get_by_user_id(user_id=user.id, store_id=store_id)

        return cart

