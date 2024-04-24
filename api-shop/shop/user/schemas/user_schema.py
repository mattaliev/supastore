import logging
import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType

from cart.services import cart_get_or_create
from user.models.user import TelegramUser
from user.services.user_service import (
    user_create_or_update
)


__all__ = [
    "TelegramUserType",
    "RegisterUserInput",
    "RegisterUserMutation",
    "Mutation",
    "Query",
]

User = get_user_model()


class TelegramUserType(DjangoObjectType):
    state = graphene.Field("core.schemas.EntityState")
    shipping_details = graphene.Field("shipping.schemas.ShippingDetailsType")
    has_default_shipping_details = graphene.Boolean()

    class Meta:
        model = TelegramUser
        fields = "__all__"


class RegisterUserInput(graphene.InputObjectType):
    telegram_id = graphene.Int(required=True)
    username = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    language_code = graphene.String()
    is_bot = graphene.Boolean()
    photo_url = graphene.String()
    allows_notifications = graphene.Boolean()
    role = graphene.String()
    chat_id = graphene.Int()


class RegisterUserMutation(graphene.Mutation):
    user = graphene.Field(TelegramUserType)
    cart = graphene.Field("cart.schemas.cart_schema.CartType")
    created_cart = graphene.Boolean()

    class Arguments:
        user_input = RegisterUserInput(required=True)
        cart_id = graphene.UUID()

    @classmethod
    def mutate(cls, root, info, user_input, cart_id=None):
        logger = logging.getLogger(cls.__name__)
        logger.debug("Registering user")

        user, created = user_create_or_update(**user_input)

        cart, created_cart = cart_get_or_create(cart_id=cart_id, user=user)

        return RegisterUserMutation(user=user, cart=cart, created_cart=created_cart)


class Mutation(graphene.ObjectType):
    register = RegisterUserMutation.Field()


class Query(graphene.ObjectType):
    profile = graphene.Field(TelegramUserType, user_id=graphene.UUID(required=True))

    def resolve_profile(self, info, user_id):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Resolving profile")
        user = User.objects.get(pk=user_id)
        logger.debug("User: %s", user.id)
        return user

