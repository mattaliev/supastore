from django.db.models import QuerySet
from django.test import TestCase

from core.utils.encryption import encrypt
from store.models import Store, StoreAdmin, StoreBotToken
from store.services import *
from user.models import TelegramUser


# Create your tests here.

class StoreGetTestCase(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(
            telegram_id=123456,
            username="test_user",
        )
        self.store = Store.objects.create(
            store_name="Test Store",
            store_description="Test Description",
            owner=self.user
        )

    def test_store_get(self):
        store = store_get(store_id=self.store.id)
        self.assertEqual(store.store_name, "Test Store")
        self.assertEqual(store.store_description, "Test Description")
        self.assertEqual(store.owner, self.user)
        self.assertEqual(store.is_connected_to_telegram, False)


class StoreListTestCase(TestCase):
    def setUp(self):
        self.user1 = TelegramUser.objects.create(telegram_id=123456, username="test_user1")
        self.user2 = TelegramUser.objects.create(telegram_id=12345678, username="test_user2")
        self.store1 = Store.objects.create(
            store_name="Test Store 1",
            store_description="Test Store 1 Description",
            owner=self.user1
        )
        self.store2 = Store.objects.create(
            store_name="Test Store 2",
            store_description="Test Store 2 Description",
            owner=self.user2
        )
        StoreAdmin.objects.create(store=self.store1, admin=self.user2)

    def test_store_list_for_new_user(self):
        user3 = TelegramUser.objects.create(telegram_id=123456789, username="test_user3")

        stores = store_list(user=user3)

        self.assertIsInstance(stores, QuerySet)
        self.assertFalse(stores.exists())

    def test_store_list_for_existing_owner(self):
        stores = store_list(user=self.user1)

        self.assertIsInstance(stores, QuerySet)
        self.assertTrue(stores.exists())
        self.assertEqual(stores.count(), 1)
        self.assertEqual(stores.first().store_name, "Test Store 1")

    def test_store_list_for_owner_and_admin(self):
        stores = store_list(user=self.user2)

        self.assertIsInstance(stores, QuerySet)
        self.assertTrue(stores.exists())
        self.assertEqual(stores.count(), 2)


class StoreHasBotTokenTestCase(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=123456, username="test_user")
        self.store = Store.objects.create(
            store_name="Test Store",
            store_description="Test Description",
            owner=self.user
        )

    def test_store_has_bot_token(self):
        self.assertFalse(store_has_bot_token(store=self.store))

        StoreBotToken.objects.create(store=self.store, token="test_token")

        self.assertTrue(store_has_bot_token(store=self.store))


class StoreBotTokenGetTestCase(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=123456, username="test_user")
        self.store = Store.objects.create(
            store_name="Test Store",
            store_description="Test Description",
            owner=self.user
        )

    def test_store_bot_token_get(self):
        self.assertIsNone(store_bot_token_get(store=self.store))

        StoreBotToken.objects.create(store=self.store, token=encrypt("test_token"))

        self.assertEqual(store_bot_token_get(store=self.store), "test_token")


class StoreCreateTestCase(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=123456, username="test_user")

    def test_store_create(self):
        store = store_create(
            user=self.user,
            store_name="Test Store",
            store_description="Test Description",
            store_image=None,
            bot_token="test_token"
        )

        self.assertEqual(store.store_name, "Test Store")
        self.assertEqual(store.store_description, "Test Description")
        self.assertEqual(store.owner, self.user)

        # Check that token is encrypted
        self.assertNotEqual(store.bot_token.token, "test_token")

        # Check that token is decrypted correctly
        self.assertTrue(store_has_bot_token(store=store))
        self.assertEqual(store_bot_token_get(store=store), "test_token")


class StoreUpdateTestCase(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=123456, username="test_user")
        self.store = Store.objects.create(
            store_name="Test Store",
            store_description="Test Description",
            owner=self.user
        )

    def test_store_update(self):
        store = store_update(
            store_id=self.store.id,
            store_name="Updated Store",
            store_description="Updated Description",
            store_image=None
        )

        self.assertEqual(store.store_name, "Updated Store")
        self.assertEqual(store.store_description, "Updated Description")
        self.assertEqual(store.owner, self.user)
        self.assertEqual(store.is_connected_to_telegram, False)


class StoreAdminCreateTestCase(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=123456, username="test_user")
        self.store = Store.objects.create(
            store_name="Test Store",
            store_description="Test Description",
            owner=self.user
        )

    def test_store_admin_create(self):
        user2 = TelegramUser.objects.create(telegram_id=12345678, username="test_user2")

        store_admin_create(user=user2, store_id=self.store.id)

        self.assertEqual(self.store.admins.count(), 1)
        self.assertEqual(self.store.admins.first().admin, user2)


class StoreCanManageTestCase(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=123456, username="test_user")
        self.store = Store.objects.create(
            store_name="Test Store",
            store_description="Test Description",
            owner=self.user
        )

    def test_can_manage_store_for_owner(self):
        self.assertTrue(can_manage_store(user=self.user, store_id=self.store.id))

    def test_can_manage_store_for_admin(self):
        user2 = TelegramUser.objects.create(telegram_id=12345678, username="test_user2")
        StoreAdmin.objects.create(store=self.store, admin=user2)

        self.assertTrue(can_manage_store(user=user2, store_id=self.store.id))

    def test_can_manage_store_for_non_admin_and_not_owner(self):
        user3 = TelegramUser.objects.create(telegram_id=123456789, username="test_user3")

        self.assertFalse(can_manage_store(user=user3, store_id=self.store.id))


class StoreBotTokenCreateOrUpdateTestCase(TestCase):
    def setUp(self):
        self.user = TelegramUser.objects.create(telegram_id=123456, username="test_user")
        self.store = Store.objects.create(
            store_name="Test Store",
            store_description="Test Description",
            owner=self.user
        )

    def test_store_bot_token_create_or_update_for_new_token(self):
        if store_has_bot_token(store=self.store):
            self.store.bot_token.delete()

        success = store_bot_token_create_or_update(store_id=self.store.id, token="test_token")
        self.store.refresh_from_db()

        self.assertTrue(success)
        self.assertTrue(store_has_bot_token(store=self.store))
        self.assertEqual(store_bot_token_get(store=self.store), "test_token")

    def test_store_bot_token_create_or_update_for_existing_token(self):
        if store_has_bot_token(store=self.store):
            self.store.bot_token.delete()

        StoreBotToken.objects.create(store=self.store, token=encrypt("test_token"))

        success = store_bot_token_create_or_update(store_id=self.store.id, token="new_test_token")
        self.store.refresh_from_db()

        self.assertTrue(success)
        self.assertTrue(store_has_bot_token(store=self.store))
        self.assertEqual(store_bot_token_get(store=self.store), "new_test_token")
