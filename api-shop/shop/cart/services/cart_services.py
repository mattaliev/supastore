import logging
from typing import Tuple

from django.http import Http404
from uuid import UUID
from cart.models.cart import Cart, CartItem
from django.contrib.auth import get_user_model

from analytics.services import register_added_to_cart

User = get_user_model()


def cart_get_or_create(*, cart_id: UUID | None, user: User | None) -> Tuple[Cart, bool]:
    logger = logging.getLogger(__name__)
    logger.debug("Getting or creating cart for user_id: %s", user.id)

    try:
        cart = None
        created = False

        # First try to get cart by id
        if cart_id:
            cart = Cart.objects.filter(pk=cart_id, state="ACTIVE").first()

        # If no cart found by id, try to get active cart for user
        if cart is None:
            logger.debug("No cart found by id %s", cart_id)
            cart = Cart.objects.filter(user=user, state="ACTIVE").first()

        # Else create a new cart
        if cart is None:
            logger.debug("No active cart found for user_id: %s", user.id)
            cart = Cart.objects.create()

            if user is not None:
                cart.user = user
                cart.save()

            created = True
    except Exception as e:
        logger.warning("Error getting or creating cart for user_id: %s", user.id)
        raise e

    return cart, created


def cart_create(*, user_id: UUID) -> Cart:
    logger = logging.getLogger(__name__)
    logger.debug("Creating cart for user_id: %s", user_id)

    try:
        cart = Cart.objects.create()
        user = User.objects.filter(pk=user_id).first()

        if user is not None:
            cart.user = user
            cart.save()
    except Exception as e:
        logger.warning("Error creating cart for user_id: %s", user_id)
        raise e

    return cart


def cart_add_to(*, cart_id: UUID, product_id: UUID, variant_id: UUID | None, quantity: int) -> Cart:
    logger = logging.getLogger(__name__)
    logger.debug("Adding to cart with input: %s", {
        "cart_id": cart_id,
        "product_id": product_id,
        "variant_id": variant_id,
        "quantity": quantity
    })

    try:
        cart = Cart.objects.get(pk=cart_id)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product_id=product_id,
            variant_id=variant_id,
        )
        cart_item.quantity += quantity
        cart_item.save()

        register_added_to_cart(
            cart_id=cart_id,
            product_id=product_id,
            variant_id=variant_id,
            quantity=quantity
        )
    except Cart.DoesNotExist:
        logger.warning("Cart not found for cart_id: %s", cart_id)
        raise Http404("Cart was not found for cart_id: %s" % cart_id)

    return cart


def cart_remove_from(*, cart_id: UUID, cart_item_id: UUID, quantity: int) -> Cart:
    logger = logging.getLogger(__name__)
    logger.debug("Removing from cart with input: %s", {
        "cart_id": cart_id,
        "cart_item_id": cart_item_id,
        "quantity": quantity
    })

    try:
        cart = Cart.objects.get(pk=cart_id)
        cart_item = CartItem.objects.get(
            cart=cart,
            pk=cart_item_id
        )
        if cart_item.quantity > quantity:
            cart_item.quantity -= quantity
            cart_item.save()
        else:
            cart_item.delete()
    except Cart.DoesNotExist:
        logger.warning("Cart not found for cart_id: %s", cart_id)
        raise Http404("Cart was not found for cart_id: %s" % cart_id)

    return cart


def cart_update_item(*, cart_id: UUID, cart_item_id: UUID, quantity: int) -> Cart:
    logger = logging.getLogger(__name__)
    logger.debug("Updating cart item with input: %s", {
        "cart_id": cart_id,
        "cart_item_id": cart_item_id,
        "quantity": quantity
    })

    try:
        cart = Cart.objects.get(pk=cart_id)
        cart_item = CartItem.objects.get(
            cart=cart,
            pk=cart_item_id
        )
        cart_item.quantity = quantity
        cart_item.save()
    except Cart.DoesNotExist:
        logger.warning("Cart not found for cart_id: %s", cart_id)
        raise Http404("Cart was not found for cart_id: %s" % cart_id)

    return cart
