import graphene
from graphene_django import DjangoObjectType

from category.models import Category, Characteristic, CharacteristicsChoice, \
    CategoryCharacteristic


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = "__all__"


class CharacteristicType(DjangoObjectType):
    class Meta:
        model = Characteristic
        fields = "__all__"


class CharacteristicChoiceType(DjangoObjectType):
    class Meta:
        model = CharacteristicsChoice
        fields = "__all__"


class CategoryCharacteristicType(DjangoObjectType):
    class Meta:
        model = CategoryCharacteristic
        fields = "__all__"


class ParentsAndChildrenCategoriesType(graphene.ObjectType):
    parent_categories = graphene.List(CategoryType)
    subcategories = graphene.List(CategoryType)

