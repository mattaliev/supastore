import graphene
from graphene_django import DjangoObjectType

from marketing.models import ManualMailing

__all__ = [
    "ManualMailingType",
    "ManualMailingCreateInput",
    "ManualMailingPreviewInput"
]


class ManualMailingType(DjangoObjectType):
    state = graphene.String()

    class Meta:
        model = ManualMailing
        fields = "__all__"


class ManualMailingCreateInput(graphene.InputObjectType):
    store_id = graphene.UUID(required=True)
    name = graphene.String(required=True)
    message = graphene.String(required=True)
    audience = graphene.List(graphene.String, required=True)
    cta_text = graphene.String()
    cta_url = graphene.String()
    execute_immediately = graphene.Boolean()


class ManualMailingPreviewInput(graphene.InputObjectType):
    store_id = graphene.UUID(required=True)
    message = graphene.String(required=True)
    cta_text = graphene.String()
    cta_url = graphene.String()
    send_to_all_admins = graphene.Boolean()

