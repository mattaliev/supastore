import logging
from decimal import Decimal
from uuid import uuid4

from django.db.models import QuerySet
from django.test import TestCase

from analytics.models import EventTypeChoices, Event
from payment.models import Payment, PaymentStatusChoices
from product.models import Product
from user.models.user import CustomerSortChoices, TelegramUser
from user.services.user_service import customer_list_get, customer_detail_get, \
    customer_completed_payment_count, customer_is_new, customer_last_visit, \
    customer_amount_spent, customer_added_to_cart_count, \
    customer_total_cart_amount, customer_favorite_products, \
    user_create_or_update

logger = logging.getLogger(__name__)


class CustomerListGetTests(TestCase):
    def setUp(self):
        self.user1 = TelegramUser.objects.create(telegram_id=1, username='user1')
        self.user2 = TelegramUser.objects.create(telegram_id=2, username='user2')

    def test_customer_list_get_without_sorting(self):
        customers = customer_list_get()
        self.assertEqual(len(customers), 2)
        self.assertEqual(customers[0].username, 'user2')
        self.assertEqual(customers[1].username, 'user1')

    def test_customer_list_get_with_total_sales_sorting(self):
        self.user1.carts.create()
        self.user2.carts.create()

        self.user1.orders.create(cart=self.user1.carts.first())
        self.user2.orders.create(cart=self.user2.carts.first())

        Payment.objects.create(order=self.user1.orders.first(), payment_status="PAID", subtotal_amount=Decimal("100.00"), total_amount=Decimal('100.00'))
        Payment.objects.create(order=self.user2.orders.first(), payment_status="PAID", subtotal_amount=Decimal("200.00"), total_amount=Decimal('200.00'))

        customers = customer_list_get(sort_by=CustomerSortChoices.TOTAL_SALES)
        self.assertEqual(len(customers), 2)
        self.assertEqual(customers[0].username, 'user2')
        self.assertEqual(customers[1].username, 'user1')

    def test_customer_list_get_with_total_visits_sorting(self):
        self.user1.events.create(event_type=EventTypeChoices.USER_VISITED, event_data={})
        self.user1.events.create(event_type=EventTypeChoices.USER_VISITED, event_data={})
        self.user2.events.create(event_type=EventTypeChoices.USER_VISITED, event_data={})

        customers = customer_list_get(sort_by=CustomerSortChoices.TOTAL_VISITS)
        self.assertEqual(len(customers), 2)
        self.assertEqual(customers[0].username, 'user1')
        self.assertEqual(customers[1].username, 'user2')

    def test_customer_list_get_with_no_paid_orders(self):
        self.user1.carts.create()
        self.user2.carts.create()

        self.user1.orders.create(cart=self.user1.carts.first())
        self.user2.orders.create(cart=self.user2.carts.first())

        Payment.objects.create(order=self.user1.orders.first(), payment_status="UNPAID", subtotal_amount=Decimal("100.00"), total_amount=Decimal('100.00'))
        Payment.objects.create(order=self.user2.orders.first(), payment_status="UNPAID", subtotal_amount=Decimal("200.00"), total_amount=Decimal('200.00'))

        customers = customer_list_get(sort_by=CustomerSortChoices.TOTAL_SALES)
        self.assertEqual(len(customers), 0)


class CustomerDetailGetTests(TestCase):
    def setUp(self):
        self.user_id = uuid4()
        TelegramUser.objects.create(id=self.user_id, telegram_id=12345, username='testuser')

    def test_customer_detail_get_with_existing_user(self):
        customer = customer_detail_get(user_id=self.user_id)
        self.assertEqual(customer.id, self.user_id)

    def test_customer_detail_get_with_non_existing_user(self):
        non_existing_user_id = uuid4()
        with self.assertRaises(TelegramUser.DoesNotExist):
            customer_detail_get(user_id=non_existing_user_id)


class CustomerCompletedPaymentCountTests(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(id=uuid4(), telegram_id=12345, username='testuser')
        self.user.carts.create()
        self.user.carts.create()
        self.user.orders.create(cart=self.user.carts.first())
        self.user.orders.create(cart=self.user.carts.last())

        Payment.objects.create(order=self.user.orders.first(), payment_status=PaymentStatusChoices.PAID, subtotal_amount=Decimal("100.00"), total_amount=Decimal("100.00"))
        Payment.objects.create(order=self.user.orders.last(), payment_status=PaymentStatusChoices.PAID, subtotal_amount=Decimal("200.00"), total_amount=Decimal("200.00"))

    def test_customer_completed_payment_count_with_paid_orders(self):
        count = customer_completed_payment_count(user=self.user)
        self.assertEqual(count, 2)

    def test_customer_completed_payment_count_with_no_paid_orders(self):
        Payment.objects.all().update(payment_status=PaymentStatusChoices.UNPAID)
        count = customer_completed_payment_count(user=self.user)
        self.assertEqual(count, 0)


class CustomerIsNewTests(TestCase):
    def test_customer_is_new_with_new_user(self):
        user = TelegramUser.objects.create(telegram_id=12345789, username='newuser')
        user.events.create(event_type=EventTypeChoices.USER_REGISTERED, event_data={})
        self.assertTrue(customer_is_new(user=user))

    def test_customer_is_new_with_existing_user(self):
        user = TelegramUser.objects.create(telegram_id=12345789,
                                           username='newuser')
        user.events.create(event_type=EventTypeChoices.USER_VISITED,
                           event_data={})
        user.events.create(event_type=EventTypeChoices.USER_VISITED,
                           event_data={})
        self.assertFalse(customer_is_new(user=user))


class CustomerLastVisitTests(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=12345, username='testuser')

    def test_customer_last_visit_with_visit_event(self):
        self.user.events.create(event_type=EventTypeChoices.USER_VISITED, event_data={})
        last_visit = customer_last_visit(user=self.user)
        self.assertEqual(last_visit, self.user.events.first().created)

    def test_customer_last_visit_without_visit_event(self):
        Event.objects.all().delete()
        last_visit = customer_last_visit(user=self.user)
        self.assertEqual(last_visit, self.user.created)


class CustomerAmountSpentTests(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=12345, username='testuser')
        self.user.carts.create()
        self.user.carts.create()
        self.user.orders.create(cart=self.user.carts.first())
        self.user.orders.create(cart=self.user.carts.last())

        Payment.objects.create(order=self.user.orders.first(), payment_status=PaymentStatusChoices.PAID, subtotal_amount=Decimal("100.00"), total_amount=Decimal("100.00"))
        Payment.objects.create(order=self.user.orders.last(), payment_status=PaymentStatusChoices.PAID, subtotal_amount=Decimal("200.00"), total_amount=Decimal("200.00"))

    def test_customer_amount_spent_with_paid_orders(self):
        Payment.objects.all().update(payment_status=PaymentStatusChoices.PAID)
        amount_spent = customer_amount_spent(user=self.user)
        self.assertEqual(amount_spent, Decimal("300.00"))

    def test_customer_amount_spent_with_no_paid_orders(self):
        Payment.objects.all().update(payment_status=PaymentStatusChoices.UNPAID)
        amount_spent = customer_amount_spent(user=self.user)
        self.assertEqual(amount_spent, Decimal("0.00"))


class CustomerAddedToCartCountTests(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=12345, username='testuser')

    def test_customer_added_to_cart_count_with_cart_events(self):
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART, event_data={})
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART, event_data={})
        cart_count = customer_added_to_cart_count(user=self.user)
        self.assertEqual(cart_count, 2)

    def test_customer_added_to_cart_count_without_cart_events(self):
        self.user.events.all().delete()
        cart_count = customer_added_to_cart_count(user=self.user)
        self.assertEqual(cart_count, 0)


class CustomerTotalCartAmountTests(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=12345, username='testuser')

    def test_customer_total_cart_amount_with_carts(self):
        self.user.carts.create()
        self.user.carts.create()
        self.product = Product.objects.create(title="T-shirt", price=Decimal("100.00"))

        self.user.carts.first().items.create(product=self.product, quantity=1)
        self.user.carts.last().items.create(product=self.product, quantity=2)

        total_cart_amount = customer_total_cart_amount(user=self.user)
        self.assertEqual(total_cart_amount, Decimal("300.00"))

    def test_customer_total_cart_amount_without_carts(self):
        self.user.carts.all().delete()
        total_cart_amount = customer_total_cart_amount(user=self.user)
        self.assertEqual(total_cart_amount, Decimal("0.00"))


class TestCustomerFavoriteProducts(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=12345, username='testuser')
        self.product1 = Product.objects.create(title="T-shirt", price=Decimal("100.00"))
        self.product2 = Product.objects.create(title="Pants", price=Decimal("200.00"))

    def test_customer_favorite_products_with_no_added_to_cart_events(self):
        self.user.events.all().delete()

        favorite_products = customer_favorite_products(user=self.user)

        self.assertIsInstance(favorite_products, QuerySet)
        self.assertFalse(favorite_products.exists())

    def test_customer_favorite_products_with_one_added_to_cart_event(self):
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART, event_data={"product_id": str(self.product1.id)})

        favorite_products = customer_favorite_products(user=self.user)

        self.assertIsInstance(favorite_products, QuerySet)
        self.assertEqual(favorite_products.count(), 1)
        self.assertEqual(favorite_products.first(), self.product1)

    def test_customer_favorite_products_with_multiple_added_to_cart_events(self):
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART, event_data={"product_id": str(self.product1.id)})
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART, event_data={"product_id": str(self.product1.id)})

        favorite_products = customer_favorite_products(user=self.user)

        self.assertIsInstance(favorite_products, QuerySet)
        self.assertEqual(favorite_products.count(), 1)
        self.assertEqual(favorite_products.first(), self.product1)

    def test_customer_favorite_products_with_different_added_to_cart_events(self):
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART, event_data={"product_id": str(self.product1.id)})
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART, event_data={"product_id": str(self.product1.id)})
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART, event_data={"product_id": str(self.product2.id)})

        favorite_products = customer_favorite_products(user=self.user)

        self.assertIsInstance(favorite_products, QuerySet)
        self.assertEqual(favorite_products.count(), 2)
        self.assertEqual(favorite_products.first(), self.product1)
        self.assertEqual(favorite_products.last(), self.product2)


    def test_customer_favorite_products_with_different_added_to_cart_events_in_right_order(self):
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART,event_data={"product_id": str(self.product1.id)})
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART,event_data={"product_id": str(self.product2.id)})
        self.user.events.create(event_type=EventTypeChoices.ADDED_TO_CART,event_data={"product_id": str(self.product2.id)})

        favorite_products = customer_favorite_products(user=self.user)

        self.assertIsInstance(favorite_products, QuerySet)
        self.assertEqual(favorite_products.count(), 2)
        self.assertEqual(favorite_products.first(), self.product2)
        self.assertEqual(favorite_products.last(), self.product1)

class UserCreateOrUpdateTest(TestCase):
    def setUp(self):
        self.telegram_id = 123456
        self.username = 'testuser'
        self.first_name = 'Test'
        self.last_name = 'User'
        self.language_code = 'en'
        self.is_bot = False
        self.photo_url = 'http://example.com/photo.jpg'
        self.allows_notifications = True
        self.role = 'USER'
        self.chat_id = 123456
    def test_create_or_update_user(self):
        TelegramUser.objects.all().delete()
        Event.objects.all().delete()

        user, created = user_create_or_update(
            telegram_id=self.telegram_id,
            username=self.username,
            first_name=self.first_name,
            last_name=self.last_name,
            language_code=self.language_code,
            is_bot=self.is_bot,
            photo_url=self.photo_url,
            allows_notifications=self.allows_notifications,
            role=self.role,
            chat_id=self.chat_id
        )

        self.assertTrue(created)
        self.assertEqual(user.username, self.username)
        self.assertIsInstance(user, TelegramUser)
        self.assertTrue(user.events.filter(event_type=EventTypeChoices.USER_REGISTERED).exists())
        self.assertFalse(user.events.filter(event_type=EventTypeChoices.USER_VISITED).exists())

        new_username = 'newtestuser'

        user, created = user_create_or_update(
            telegram_id=self.telegram_id,
            username=new_username,
        )
        self.assertFalse(created)
        self.assertEqual(user.username, new_username)
        self.assertIsInstance(user, TelegramUser)
        self.assertEqual(user.events.filter(event_type=EventTypeChoices.USER_REGISTERED).count(), 1)
        self.assertTrue(user.events.filter(event_type=EventTypeChoices.USER_VISITED).exists())
