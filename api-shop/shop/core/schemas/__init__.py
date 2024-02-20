import graphene
from core.models import EntityStateChoices

EntityState = graphene.Enum.from_enum(EntityStateChoices, name="EntityState")
