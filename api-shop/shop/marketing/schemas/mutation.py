
import graphene

from core.exceptions import AuthenticationError, PermissionDeniedError
from store.services import can_manage_store
from .schema import ManualMailingCreateInput, ManualMailingPreviewInput
from ..services import (
    manual_mailing_create,
    manual_mailing_preview,
    manual_mailing_send
)

__all__ = [
    "ManualMailingCreateMutation",
    "ManualMailingPreviewMutation",
    "ManualMailingSendMutation",
    "Mutation"
]


class ManualMailingCreateMutation(graphene.Mutation):
    class Arguments:
        input = ManualMailingCreateInput(required=True)

    manual_mailing = graphene.Field("marketing.schemas.ManualMailingType")

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        if not can_manage_store(user=user, store_id=input.get("store_id")):
            raise PermissionDeniedError()

        manual_mailing = manual_mailing_create(**input)

        return ManualMailingCreateMutation(manual_mailing=manual_mailing)


class ManualMailingPreviewMutation(graphene.Mutation):
    class Arguments:
        input = ManualMailingPreviewInput(required=True)

    success = graphene.Boolean()

    def mutate(self, info, input, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        if not can_manage_store(user=user, store_id=input.get("store_id")):
            raise PermissionDeniedError()

        manual_mailing_preview(user=user, **input)
        return ManualMailingPreviewMutation(success=True)


class ManualMailingSendMutation(graphene.Mutation):
    class Arguments:
        store_id = graphene.UUID(required=True)
        mailing_id = graphene.UUID(required=True)

    manual_mailing = graphene.Field("marketing.schemas.ManualMailingType")

    def mutate(self, info, store_id, mailing_id, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise AuthenticationError()

        if not can_manage_store(user=user, store_id=store_id):
            raise PermissionDeniedError()

        manual_mailing = manual_mailing_send(mailing_id=mailing_id)
        return ManualMailingSendMutation(manual_mailing=manual_mailing)


class Mutation(graphene.ObjectType):
    manual_mailing_create = ManualMailingCreateMutation.Field()
    manual_mailing_preview = ManualMailingPreviewMutation.Field()
    manual_mailing_send = ManualMailingSendMutation.Field()