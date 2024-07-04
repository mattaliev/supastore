import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload

from store.models.store import Store, StoreApplication, StoreLogo
from store.services import store_has_bot_token

__all__ = [
    'StoreType',
    'StoreInputType',
    'StoreCreateInputType',
    'StoreUpdateInputType',
    'StoreApplicationType',
    'StoreApplicationCreateInput',
    'StoreLogoType'
]

from user.models import StoreUser, UserRoleChoices


class StoreType(DjangoObjectType):
    admins = graphene.List('user.schemas.schema.TelegramUserType')
    bot_username = graphene.String()
    owner = graphene.Field('user.schemas.TelegramUserType')
    has_products = graphene.Boolean()
    has_bot_token = graphene.Boolean()
    has_connected_payment_system = graphene.Boolean()
    is_connected_to_telegram = graphene.Boolean()
    state = graphene.String()
    logo_dark = graphene.String()
    logo_light = graphene.String()
    telegram_store_url = graphene.String()

    class Meta:
        model = Store
        fields = [
            "id",
            "store_name",
            "store_description",
            "store_timezone",
            "logo",
            "bot_username",
            "state",
            "is_connected_to_telegram",
            "created",
            "updated",
            "store_users",
            "store_bot",
            "store_url"
        ]

    def resolve_admins(self, info):
        return self.store_users.filter(role=UserRoleChoices.ADMIN).values_list('user', flat=True)

    def resolve_bot_username(self, info):
        if hasattr(self, "store_bot"):

            return self.store_bot.bot_username

    def resolve_owner(self, info):
        return StoreUser.objects.filter(store=self, role=UserRoleChoices.OWNER).first().user

    def resolve_has_products(self, info):
        return self.products.exists()

    def resolve_has_bot_token(self, info):
        return store_has_bot_token(store=self)

    def resolve_logo_dark(self, info):
        if hasattr(self, "logo") and self.logo.logo_dark:
            return self.logo.logo_dark.url
        return None

    def resolve_logo_light(self, info):
        if hasattr(self, "logo") and self.logo.logo_light:
            return self.logo.logo_light.url
        return None

    def resolve_has_connected_payment_system(self, info):
        return self.payment_methods.exists()

    def resolve_is_connected_to_telegram(self, info):
        return self.is_connected_to_telegram

    def resolve_telegram_store_url(self, info):
        return self.store_bot.telegram_store_url


class StoreInputType(graphene.InputObjectType):
    store_name = graphene.String(required=True)
    store_description = graphene.String()
    store_timezone = graphene.String()
    logo_dark = Upload()
    logo_light = Upload()
    bot_token = graphene.String()
    bot_username = graphene.String()
    telegram_store_url = graphene.String()


class StoreCreateInputType(StoreInputType):
    pass


class StoreUpdateInputType(StoreInputType):
    store_id = graphene.UUID(required=True)
    store_name = graphene.String(required=False)


class StoreApplicationType(DjangoObjectType):
    class Meta:
        model = StoreApplication
        fields = '__all__'


class StoreApplicationCreateInput(graphene.InputObjectType):
    store_name = graphene.String(required=True)
    store_description = graphene.String()
    channels = graphene.String()
    product_category = graphene.String()


class StoreLogoType(graphene.ObjectType):
    logo_light = graphene.String()
    logo_dark = graphene.String()

    class Meta:
        model = StoreLogo
        fields = ["logo_dark", "logo_light"]

    def resolve_logo_dark(self, info):
        return self.logo_dark.url

    def resolve_logo_light(self, info):
        return self.logo_light.url
