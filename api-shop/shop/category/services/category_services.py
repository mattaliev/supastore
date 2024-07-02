from uuid import UUID

from django.db.models import Q

from category.models import Category, Characteristic

__all__ = [
    "categories_get",
    "category_characteristics_get"
]


def categories_get(*, parent_id: UUID = None, search: str = None, locale: str = "en"):
    if search and search != "":
        parent_categories = Category.objects.filter(
            Q(children__name_ru__icontains=search) | Q(
                children__name_en__icontains=search)
        ).distinct()

        subcategories = Category.objects.filter(parent_id=parent_id)
        if parent_id:
            subcategories = filter_categories_by_search(subcategories, search)
        else:
            first_parent = parent_categories.first()
            if first_parent:
                subcategories = filter_categories_by_search(
                    first_parent.children.all(), search)
            else:
                subcategories = None
    else:
        parent_categories = Category.objects.filter(parent__isnull=True)
        subcategories = Category.objects.filter(
            parent_id=parent_id) if parent_id else None

    parent_categories = order_categories(parent_categories, locale)
    subcategories = order_categories(subcategories, locale)

    return parent_categories, subcategories


def filter_categories_by_search(queryset, search):
    return queryset.filter(
        Q(name_ru__icontains=search) | Q(name_en__icontains=search)
    ).distinct()


def order_categories(queryset, locale):
    if not queryset:
        return None
    return queryset.order_by("name_en" if locale == "en" else "name_ru")


def category_characteristics_get(*, category_id: UUID):
    category = Category.objects.filter(id=category_id).first()

    return Characteristic.objects.filter(
        categories__category=category
    )

