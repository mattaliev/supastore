import graphene

from product.schemas import Query as ProductQuery
from cart.schemas import Query as CartQuery, Mutation as CartMutation
from user.schemas import Query as UserQuery, Mutation as UserMutation

from order.schemas import (OrderMutation, OrderQuery, ShippingDetailsMutation)


class Query(
    ProductQuery,
    CartQuery,
    OrderQuery,
    UserQuery,
    graphene.ObjectType
):
    pass


class Mutation(
    CartMutation,
    OrderMutation,
    UserMutation,
    ShippingDetailsMutation,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
