import graphene
from core.models import EntityStateChoices

EntityState = graphene.Enum.from_enum(EntityStateChoices, name="EntityState")


class PaginatedType(graphene.ObjectType):
    page = graphene.Int(required=True)
    pages = graphene.Int(required=True)
    has_next = graphene.Boolean(required=True)
    has_prev = graphene.Boolean(required=True)
    objects = graphene.List(graphene.String)
    total_items = graphene.Int(required=True)

