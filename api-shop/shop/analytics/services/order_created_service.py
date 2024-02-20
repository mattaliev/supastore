from order.models import Order
from analytics.models import OrderCreated


__all__ = [
    "order_created_register",
]


def order_created_register(*, order: Order) -> None:
    order_created = OrderCreated.objects.create(
        order=order
    )
    order_created.save()

