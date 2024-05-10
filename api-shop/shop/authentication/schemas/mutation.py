import graphene

from authentication.services import (
    sign_in_admin_user,
    sign_in_shop_user,
    sign_out_admin_user,
)


class SignInAdminMutation(graphene.Mutation):
    user = graphene.Field("user.schemas.schema.TelegramUserType")
    access_token = graphene.String()

    class Arguments:
        data_check_string = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, data_check_string):
        user, access_token = sign_in_admin_user(data_check_string=data_check_string)

        return SignInAdminMutation(user=user, access_token=access_token)


class SignInShopUserMutation(graphene.Mutation):
    user = graphene.Field("user.schemas.schema.TelegramUserType")
    cart = graphene.Field("cart.schemas.CartType")
    created_cart = graphene.Boolean()

    class Arguments:
        init_data_raw = graphene.String(required=True)
        cart_id = graphene.UUID()

    @classmethod
    def mutate(cls, root, info, init_data_raw, cart_id=None):
        user, cart, created_cart = sign_in_shop_user(init_data_raw=init_data_raw, cart_id=cart_id)

        # Return user and cart
        return SignInShopUserMutation(user=user, cart=cart, created_cart=created_cart)


class SignOutAdminMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        token = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, token):
        user = info.context.user

        if not user.is_authenticated:
            return SignOutAdminMutation(success=True)

        success = sign_out_admin_user(token=token, user=user)

        return SignOutAdminMutation(success=success)


class Mutation(graphene.ObjectType):
    sign_in_shop_user = SignInShopUserMutation.Field()
    sign_in_admin = SignInAdminMutation.Field()
    sign_out_admin = SignOutAdminMutation.Field()

