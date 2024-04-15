import graphene

from product.schemas import Query as ProductQuery, Mutation as ProductMutation
from cart.schemas import Query as CartQuery, Mutation as CartMutation
from user.schemas import Query as UserQuery, Mutation as UserMutation

from order.schemas import (OrderMutation, OrderQuery, ShippingDetailsMutation)
from invoice.schemas import Query as InvoiceQuery, Mutation as InvoiceMutation


class Query(
    ProductQuery,
    CartQuery,
    OrderQuery,
    UserQuery,
    InvoiceQuery,
    graphene.ObjectType
):
    pass


class Mutation(
    ProductMutation,
    CartMutation,
    OrderMutation,
    UserMutation,
    ShippingDetailsMutation,
    InvoiceMutation,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
