import graphene

from core.exceptions import AuthenticationError, PermissionDeniedError
from marketing.services import manual_mailing_list_get, manual_mailing_get, \
    manual_mailing_audience_get
from store.services import can_manage_store

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    manual_mailing_list = graphene.List("marketing.schemas.ManualMailingType", store_id=graphene.UUID(required=True))
    manual_mailing_get = graphene.Field(
        "marketing.schemas.ManualMailingType",
        store_id=graphene.UUID(required=True),
        mailing_id=graphene.UUID(required=True)
    )
    manual_mailing_audience_count = graphene.Int(
        store_id=graphene.UUID(required=True),
        audiences=graphene.List(graphene.String)
    )

    def resolve_manual_mailing_list(self, info, store_id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        if not can_manage_store(user=user, store_id=store_id):
            raise PermissionDeniedError()

        return manual_mailing_list_get(store_id=store_id)

    def resolve_manual_mailing_get(self, info, store_id, mailing_id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        if not can_manage_store(user=user, store_id=store_id):
            raise PermissionDeniedError()

        return manual_mailing_get(mailing_id=mailing_id)

    def resolve_manual_mailing_audience_count(self, info, store_id, audiences, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        if not can_manage_store(user=user, store_id=store_id):
            raise PermissionDeniedError()

        target_users = manual_mailing_audience_get(store_id=store_id, audiences=audiences)

        return target_users.count()

