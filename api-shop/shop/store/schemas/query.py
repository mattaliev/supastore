import graphene

from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED
from store.services import (
    can_manage_store,
    store_get,
    store_list
)
from store.services.store_services import store_logo_get, store_bot_token_get

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    store_logo_get = graphene.Field('store.schemas.schema.StoreLogoType', store_id=graphene.UUID(required=True))
    store_get = graphene.Field('store.schemas.schema.StoreType', store_id=graphene.UUID(required=True))
    store_list = graphene.List('store.schemas.schema.StoreType')
    can_manage_store = graphene.Boolean(store_id=graphene.UUID())
    store_bot_token_get = graphene.String(store_id=graphene.UUID(required=True))
    store_bot_username_get = graphene.String(store_id=graphene.UUID(required=True))

    def resolve_store_logo_get(self, info, store_id):
        return store_logo_get(store_id=store_id)

    def resolve_store_get(self, info, store_id):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            return UNAUTHORIZED()

        return store_get(store_id=store_id)

    def resolve_store_list(self, info):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        return store_list(user=user)

    def resolve_can_manage_store(self, info, store_id):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        return can_manage_store(user=user, store_id=store_id)

    def resolve_store_bot_token_get(self, info, store_id):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            return UNAUTHORIZED()

        store = store_get(store_id=store_id)

        return store_bot_token_get(store=store)

    def resolve_store_bot_username_get(self, info, store_id):
        store = store_get(store_id=store_id)

        return store.store_bot.bot_username



