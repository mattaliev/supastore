import graphene

from product.schemas import ProductType
from product.services import product_list, product_detail


__all__ = [
    "Query"
]

class Query(graphene.ObjectType):
    products_get = graphene.List(ProductType)
    product_detail = graphene.Field(ProductType, id=graphene.UUID())

    def resolve_products_get(self, info, **kwargs):
        return product_list()

    def resolve_product_detail(self, info, id):
        return product_detail(id)

