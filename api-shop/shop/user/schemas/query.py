import graphene

from core.exceptions import UNAUTHENTICATED, UNAUTHORIZED
from core.utils import get_paginator
from store.services import can_manage_store
from user.services import customer_list_get, customer_detail_get
from .schema import TelegramUserType, TelegramUserPaginatedType

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    customer_list = graphene.List(TelegramUserType, store_id=graphene.UUID(required=True))
    customer_detail = graphene.Field(
        TelegramUserType,
        store_id=graphene.UUID(required=True),
        user_id=graphene.UUID(required=True)
    )
    customers_paginated = graphene.Field(
        TelegramUserPaginatedType,
        store_id=graphene.UUID(required=True),
        page=graphene.Int(),
        limit=graphene.Int(),
        sort_by=graphene.String()
    )

    def resolve_customer_list(self, store_id, info):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            return UNAUTHORIZED()

        return customer_list_get(store_id=store_id)

    def resolve_customer_detail(self, info, store_id, user_id):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            return UNAUTHORIZED()

        return customer_detail_get(user_id=user_id, store_id=store_id)

    def resolve_customers_paginated(self, info, store_id, page=1, limit=10, sort_by=None):
        user = info.context.user

        if not user.is_authenticated:
            return UNAUTHENTICATED()

        if not can_manage_store(user=user, store_id=store_id):
            return UNAUTHORIZED()

        customers = customer_list_get(sort_by=sort_by, store_id=store_id)

        return get_paginator(customers, limit, page, TelegramUserPaginatedType)
