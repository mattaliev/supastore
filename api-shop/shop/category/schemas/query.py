import graphene

from category.services import (
    category_characteristics_get,
    categories_get
)
from .schema import ParentsAndChildrenCategoriesType

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    categories_get = graphene.Field("category.schemas.ParentsAndChildrenCategoriesType", parent_id=graphene.UUID(), search=graphene.String(), locale=graphene.String())
    category_characteristics_get = graphene.List("category.schemas.CharacteristicType", category_id=graphene.UUID(required=True))

    def resolve_category_characteristics_get(self, info, category_id, **kwargs):
        return category_characteristics_get(category_id=category_id)

    def resolve_categories_get(self, info, parent_id=None, search=None, locale="en", **kwargs):
        parent_categories, subcategories = categories_get(parent_id=parent_id, search=search, locale=locale)

        return ParentsAndChildrenCategoriesType(parent_categories=parent_categories, subcategories=subcategories)

