from uuid import UUID

from django.contrib.auth import get_user_model

from analytics.models.added_to_cart import AddedToCart


User = get_user_model()


__all__ = [
    "register_added_to_cart",
]


def register_added_to_cart(
    *,
    cart_id: UUID,
    product_id: UUID,
    variant_id: UUID = None,
    quantity: int
) -> None:
    AddedToCart.objects.create(
        cart_id=cart_id,
        product_id=product_id,
        variant_id=variant_id,
        quantity=quantity
    )

