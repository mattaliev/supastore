import graphene

from analytics.schemas import Query as AnalyticsQuery
from authentication.schemas import Mutation as AuthMutation
from cart.schemas import Query as CartQuery, Mutation as CartMutation
from category.schemas import Query as CategoryQuery
from order.schemas import Query as OrderQuery, Mutation as OrderMutation
from payment.schemas import Query as PaymentQuery, Mutation as PaymentMutation
from product.schemas import Query as ProductQuery, Mutation as ProductMutation
from shipping.schemas import (
    Mutation as ShippingDetailsMutation,
    Query as ShippingQuery
)
from store.schemas import Mutation as StoreMutation, Query as StoreQuery
from user.schemas import Query as UserQuery


class Query(
    ProductQuery,
    CartQuery,
    OrderQuery,
    UserQuery,
    AnalyticsQuery,
    PaymentQuery,
    ShippingQuery,
    StoreQuery,
    CategoryQuery,
    graphene.ObjectType
):
    pass


class Mutation(
    ProductMutation,
    CartMutation,
    OrderMutation,
    ShippingDetailsMutation,
    PaymentMutation,
    AuthMutation,
    StoreMutation,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)

