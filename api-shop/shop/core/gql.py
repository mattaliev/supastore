import graphene

from analytics.schemas import Query as AnalyticsQuery
from cart.schemas import Query as CartQuery, Mutation as CartMutation
from order.schemas import Query as OrderQuery, Mutation as OrderMutation
from payment.schemas import Query as PaymentQuery, Mutation as PaymentMutation
from product.schemas import Query as ProductQuery, Mutation as ProductMutation
from shipping.schemas import Mutation as ShippingDetailsMutation
from user.schemas import Query as UserQuery, Mutation as UserMutation


class Query(
    ProductQuery,
    CartQuery,
    OrderQuery,
    UserQuery,
    AnalyticsQuery,
    PaymentQuery,
    graphene.ObjectType
):
    pass


class Mutation(
    ProductMutation,
    CartMutation,
    OrderMutation,
    UserMutation,
    ShippingDetailsMutation,
    PaymentMutation,
    graphene.ObjectType
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
