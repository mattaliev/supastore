import graphene

from core.utils.paginator import get_paginator
from product.schemas import ProductPaginatedType
from product.services import product_variant_list, product_variant_detail

__all__ = [
    "Query"
]

from product.services.product_services import product_detail


class Query(graphene.ObjectType):
    products_get = graphene.List("product.schemas.ProductVariantType", store_id=graphene.UUID(required=True), state=graphene.String())
    product_detail = graphene.Field("product.schemas.ProductVariantType", id=graphene.UUID(required=True))
    admin_product_get = graphene.Field("product.schemas.ProductType", id=graphene.UUID(required=True))
    products_paginated_get = graphene.Field(
        ProductPaginatedType,
        store_id=graphene.UUID(required=True),
        state=graphene.String(),
        page=graphene.Int(),
        limit=graphene.Int()
    )

    def resolve_products_get(self, info, store_id, state=None, **kwargs):
        return product_variant_list(store_id=store_id, state=state)

    def resolve_product_detail(self, info, id):
        return product_variant_detail(id)

    def resolve_products_paginated_get(self, info, store_id, state=None, page=1, limit=10, **kwargs):
        products = product_variant_list(store_id=store_id, state=state)
        return get_paginator(products, limit, page, ProductPaginatedType)

    def resolve_admin_product_get(self, info, id):
        return product_detail(id=id)

