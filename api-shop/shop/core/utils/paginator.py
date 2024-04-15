from django.core.paginator import Paginator, EmptyPage

__all__ = [
    "get_paginator"
]


def get_paginator(qs, page_size, page, paginated_type, **kwargs):
    paginator = Paginator(qs, page_size)

    try:
        page_obj = paginator.get_page(page)
    except EmptyPage:
        page_obj = paginator.get_page(paginator.num_pages)

    return paginated_type(
        page=page_obj.number,
        pages=paginator.num_pages,
        has_next=page_obj.has_next(),
        has_prev=page_obj.has_previous(),
        objects=page_obj.object_list,
        total_items=paginator.count,
        **kwargs
    )
