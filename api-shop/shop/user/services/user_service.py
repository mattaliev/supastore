import logging
from decimal import Decimal
from uuid import UUID

from django.contrib.auth import get_user_model
from django.db.models import Q, Count, Sum, QuerySet, Case, When, Prefetch

from analytics.models import Event, EventTypeChoices
from cart.models import Cart
from order.models import Order
from payment.models import PaymentStatusChoices
from product.models import Product
from user.models.user import CustomerSortChoices, StoreUser

User = get_user_model()


__all__ = [
    "customer_list_get",
    "customer_detail_get",
    "customer_completed_payment_count",
    "customer_is_new",
    "customer_last_visit",
    "customer_total_visit_count",
    "customer_amount_spent",
    "customer_added_to_cart_count",
    "customer_total_cart_amount",
    "customer_favorite_products",
    "user_create_or_update",
]


def customer_list_get(*, store_id: UUID, sort_by: CustomerSortChoices = None):
    logger = logging.getLogger(__name__)
    logger.debug("Getting customer list")

    customers = User.objects.filter(store_users__store_id=store_id).order_by("-updated")

    customers = customer_prefetch_related(customers=customers, store_id=store_id)

    logger.debug("Got %(count)s customers", {"count": customers.count()})

    if not sort_by:
        return customers

    if sort_by == CustomerSortChoices.TOTAL_SALES:
        customers = (
            customers.annotate(
                total_sales=Sum(
                    "orders__payment__total_amount",
                    filter=Q(orders__store_id=store_id, orders__payment_status="PAID")
                )
            ).order_by("-total_sales")
        )
    elif sort_by == CustomerSortChoices.TOTAL_VISITS:
        customers = (
            customers.annotate(
                visits_count=Count(
                    'events__event_type',
                    filter=Q(
                        events__store_id=store_id,
                        events__event_type=EventTypeChoices.USER_VISITED,
                    ) | Q(
                        events__store_id=store_id,
                        events__event_type=EventTypeChoices.USER_REGISTERED
                    )
                )
            ).order_by('-visits_count')
        )

    return customers


def customer_detail_get(*, store_id: UUID, user_id: UUID):
    logger = logging.getLogger(__name__)
    logger.debug("Getting customer detail", {"user_id": user_id})

    customer = User.objects.filter(id=user_id)

    customer = (
        customer_prefetch_related(customers=customer, store_id=store_id).first()
    )

    logger.debug("Got customer", {"customer": customer.id})
    return customer


def customer_prefetch_related(*, customers: QuerySet[User], store_id: UUID) -> QuerySet[User]:
    orders_prefetch = Prefetch("orders", queryset=Order.objects.filter(store_id=store_id))
    carts_prefetch = Prefetch("carts", queryset=Cart.objects.filter(store_id=store_id))
    events_prefetch = Prefetch("events", queryset=Event.objects.filter(store_id=store_id))

    return customers.prefetch_related(orders_prefetch, carts_prefetch, events_prefetch)


def customer_completed_payment_count(*, user: User):
    return user.orders.filter(
        payment__payment_status=PaymentStatusChoices.PAID
    ).count()


def customer_is_new(*, user: User):
    """
    Check if the user is new by checking if the user has visited the store
    If the user is in the database, but does not have a visit event,
    it means that the user will only have registered event
    :param user:
    :return:
    """
    return not user.events.filter(
        event_type=EventTypeChoices.USER_VISITED
    ).exists()


def customer_visits_get(*, user: User) -> QuerySet[Event]:
    return user.events.filter(
        Q(event_type=EventTypeChoices.USER_VISITED) | Q(event_type=EventTypeChoices.USER_REGISTERED)
    )


def customer_last_visit(*, user: User):
    last_visit = customer_visits_get(user=user).order_by("-created").first()

    if last_visit:
        return last_visit.created
    return None



def customer_total_visit_count(*, user: User):
    return customer_visits_get(user=user).count()


def customer_amount_spent(*, user: User):
    user_paid_orders = user.orders.filter(
        payment__payment_status=PaymentStatusChoices.PAID
    )

    if not user_paid_orders:
        return Decimal("0.00")

    return sum([order.payment.total_amount for order in user_paid_orders])


def customer_added_to_cart_count(*, user: User):
    return user.events.filter(
        event_type=EventTypeChoices.ADDED_TO_CART
    ).count()


def customer_total_cart_amount(*, user: User):
    if not user.carts.exists():
        return Decimal("0.00")
    return Decimal(sum([cart.get_total_price() for cart in user.carts.all()]))


def customer_favorite_products(*, user: User) -> QuerySet[Product]:
    """
    TODO: Implement proper logic for this function
    Needs to also take in the account which products have user ordered and
    order them higher on the priority list
    :param user:
    :return: QuerySet[Product]
    """
    # favorite_products = set()
    #
    # for event in user.events.filter(event_type=EventTypeChoices.ADDED_TO_CART):
    #     favorite_products.add(event.event_data.get("product_id"))
    #
    # favorite_products = list(favorite_products)
    #
    # return Product.objects.filter(id__in=favorite_products)

    product_counts = (
        user.events.filter(
            event_type=EventTypeChoices.ADDED_TO_CART
        ).values("event_data__product_id")
        .annotate(count=Count("event_data__product_id"))
        .order_by("-count")
    )

    # Get the product IDs in order
    product_ids = [item["event_data__product_id"] for item in product_counts]

    preserved_order = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(product_ids)])

    # Get the products and annotate them with the count of ADDED_TO_CART events
    favorite_products = Product.objects.filter(id__in=product_ids).order_by(preserved_order)

    return favorite_products


def user_create_or_update(
    *,
    telegram_id: int,
    store_id: UUID = None,
    username: str = None,
    first_name: str = None,
    last_name: str = None,
    language_code: str = None,
    is_bot: bool = None,
    photo_url: str = None,
    allows_notifications: bool = None,
    chat_id: int = None
):
    logger = logging.getLogger(__name__)
    logger.debug("Creating or updating user %(telegram_id)s", {
        "telegram_id": telegram_id
    })

    fields = {
        'username': username,
        'first_name': first_name,
        'last_name': last_name,
        'language_code': language_code,
        'is_bot': is_bot,
        'photo_url': photo_url,
        'allows_notifications': allows_notifications,
        'chat_id': chat_id
    }

    defaults = {k: v for k, v in fields.items() if v is not None}

    User = get_user_model()
    user, created = User.objects.update_or_create(
        telegram_id=telegram_id,
        defaults=defaults
    )

    if not store_id:
        return user, created

    store_user, store_user_created = StoreUser.objects.update_or_create(
        store_id=store_id, user=user
    )

    if store_user_created:
        Event.register_user_register(user=user, store_id=store_id)
    else:
        Event.register_user_visited(user=user, store_id=store_id)

    return user, created
