import graphene

from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED, AuthenticationError, \
    PermissionDeniedError
from store.services import (
    store_create,
    can_manage_store,
    store_update,
    store_bot_token_create_or_update, store_connect_to_telegram
)
from .schema import StoreCreateInputType, StoreUpdateInputType, \
    StoreApplicationCreateInput, StoreSupportBotCreateInput, \
    StoreSupportBotUpdateInput

__all__ = [
    "Mutation"
]

from ..services.store_services import store_application_create, \
    store_support_bot_create, store_support_bot_update


class StoreCreateMutation(graphene.Mutation):
    class Arguments:
        input = StoreCreateInputType()

    store = graphene.Field('store.schemas.schema.StoreType')

    def mutate(self, info, input, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        store = store_create(user=user, **input)

        return StoreCreateMutation(store=store)


class StoreUpdateMutation(graphene.Mutation):
    class Arguments:
        input = StoreUpdateInputType()

    store = graphene.Field('store.schemas.schema.StoreType')

    def mutate(self, info, input, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=input.get("store_id")):
            return UNAUTHORIZED()

        store = store_update(**input)

        return StoreUpdateMutation(store=store)


class StoreBotTokenCreateOrUpdateMutation(graphene.Mutation):
    class Arguments:
        store_id = graphene.UUID(required=True)
        token = graphene.String(required=True)

    success = graphene.Boolean()

    def mutate(self, info, store_id, token, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            return UNAUTHORIZED()

        success = store_bot_token_create_or_update(store_id=store_id, token=token)

        return StoreBotTokenCreateOrUpdateMutation(success=success)


# class CreateLogoMutation(graphene.Mutation):
#     class Arguments:
#         store_image = Upload(required=True)
#
#     ok = graphene.Boolean()
#
#     @staticmethod
#     def mutate(root, info, store_image):
#         print(type(store_image))
#         Store.objects.create(store_image=store_image)
#         ok = True
#         return CreateLogoMutation(ok=ok)


class StoreConnectToTelegramMutation(graphene.Mutation):
    class Arguments:
        store_id = graphene.UUID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, store_id, **kwargs):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            return UNAUTHORIZED()

        success = store_connect_to_telegram(store_id=store_id)

        return StoreConnectToTelegramMutation(success=success)


class StoreApplicationCreateMutation(graphene.Mutation):
    class Arguments:
        input = StoreApplicationCreateInput(required=True)

    store_application = graphene.Field('store.schemas.schema.StoreApplicationType')

    @classmethod
    def mutate(cls, root, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            return UNAUTHENTICATED()

        store_application = store_application_create(user=user, **input)

        return cls(store_application=store_application)


class StoreSupportBotCreateMutation(graphene.Mutation):
    class Arguments:
        input = StoreSupportBotCreateInput(required=True)

    store_support_bot = graphene.Field("store.schemas.StoreSupportBotType")

    @classmethod
    def mutate(cls, root, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        if not can_manage_store(user=user, store_id=input.get("store_id")):
            raise PermissionDeniedError()

        store_support_bot = store_support_bot_create(**input)

        return cls(store_support_bot=store_support_bot)


class StoreSupportBotUpdateMutation(graphene.Mutation):
    class Arguments:
        input = StoreSupportBotUpdateInput(required=True)

    store_support_bot = graphene.Field("store.schemas.StoreSupportBotType")

    @classmethod
    def mutate(cls, root, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        if not can_manage_store(user=user, store_id=input.get("store_id")):
            raise PermissionDeniedError()

        store_support_bot = store_support_bot_update(**input)

        return cls(store_support_bot=store_support_bot)


class Mutation(graphene.ObjectType):
    # create_logo = CreateLogoMutation.Field()

    # store_create = StoreCreateMutation.Field()
    store_application_create = StoreApplicationCreateMutation.Field()
    store_update = StoreUpdateMutation.Field()
    store_bot_token_create_or_update = StoreBotTokenCreateOrUpdateMutation.Field()
    store_connect_to_telegram = StoreConnectToTelegramMutation.Field()
    store_support_bot_create = StoreSupportBotCreateMutation.Field()
    store_support_bot_update = StoreSupportBotUpdateMutation.Field()