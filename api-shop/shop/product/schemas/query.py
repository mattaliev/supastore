import graphene

from product.schemas import ProductType
from product.services import product_list, product_detail


__all__ = [
    "Query"
]

class Query(graphene.ObjectType):
    products_get = graphene.List(ProductType, state=graphene.String())
    product_detail = graphene.Field(ProductType, id=graphene.UUID())

    def resolve_products_get(self, info, state=None, **kwargs):
        return product_list(state=state)

    def resolve_product_detail(self, info, id):
        return product_detail(id)

