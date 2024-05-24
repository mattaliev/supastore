import graphene

from core.utils.paginator import get_paginator
from product.schemas import ProductType, ProductPaginatedType
from product.services import product_list, product_detail

__all__ = [
    "Query"
]


class Query(graphene.ObjectType):
    products_get = graphene.List(ProductType, store_id=graphene.UUID(required=True), state=graphene.String())
    product_detail = graphene.Field(ProductType, id=graphene.UUID())
    products_paginated_get = graphene.Field(
        ProductPaginatedType,
        store_id=graphene.UUID(required=True),
        state=graphene.String(),
        page=graphene.Int(),
        limit=graphene.Int()
    )

    def resolve_products_get(self, info, store_id, state=None, **kwargs):
        return product_list(store_id=store_id, state=state)

    def resolve_product_detail(self, info, id):
        return product_detail(id)

    def resolve_products_paginated_get(self, info, store_id, state=None, page=1, limit=10, **kwargs):
        products = product_list(store_id=store_id, state=state)
        return get_paginator(products, limit, page, ProductPaginatedType)

