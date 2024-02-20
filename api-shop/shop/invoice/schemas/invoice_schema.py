import logging

import graphene
from graphene_django import DjangoObjectType
from invoice.models import Invoice, PaymentStatusChoices

__all__ = [
    "PaymentStatus",
    "InvoiceType",
    "Mutation"
]

from invoice.services.invoice_service import invoice_create

PaymentStatus = graphene.Enum.from_enum(PaymentStatusChoices, name="PaymentStatus")


class InvoiceType(DjangoObjectType):
    user = graphene.Field("user.schemas.TelegramUserType")
    order = graphene.Field("order.schemas.OrderType")
    payment_status = graphene.Field('invoice.schemas.PaymentStatus')

    class Meta:
        model = Invoice
        fields = "__all__"


class InvoiceCreateInput(graphene.InputObjectType):
    order_id = graphene.UUID(required=True)
    user_id = graphene.UUID(required=True)
    currency_code = graphene.String()
    auto_conversion_currency_code = graphene.String()


class InvoiceCreateMutation(graphene.Mutation):
    invoice = graphene.Field("invoice.schemas.InvoiceType")

    class Arguments:
        input = InvoiceCreateInput(required=True)

    def mutate(self, info, input, **kwargs):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Creating invoice", {"order_id": input.order_id})

        invoice = invoice_create(**input)

        return InvoiceCreateMutation(invoice=invoice)


class Mutation(graphene.ObjectType):
    invoice_create = InvoiceCreateMutation.Field()


class Query(graphene.ObjectType):
    invoice_get_by_id = graphene.Field(InvoiceType, invoice_id=graphene.UUID())
    invoice_get_by_order_id = graphene.Field(InvoiceType, order_id=graphene.UUID())

    def resolve_invoice_get_by_id(self, info, invoice_id):
        return Invoice.objects.filter(pk=invoice_id).first()

    def resolve_invoice_get_by_order_id(self, info, order_id):
        logger = logging.getLogger(self.__class__.__name__)
        logger.debug("Getting invoice by order id", {"order_id": order_id})
        invoice = Invoice.objects.filter(order_id=order_id).first()

        return invoice
