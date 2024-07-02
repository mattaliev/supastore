import time

import requests
from django.db.models import QuerySet
from tqdm import tqdm

from category.models import Category, Characteristic, CategoryCharacteristic

URL = "https://suppliers-api.wildberries.ru"
API_TOKEN = ""

def get_wildberries_categories(locale: str = "ru"):
    categories_url = f"{URL}/content/v2/object/parent/all"

    categories_request = requests.get(
        categories_url,
        {"locale": locale},
        headers={"Authorization": f"Bearer {API_TOKEN}"},
    )

    if categories_request.status_code != 200:
        raise ValueError(f"Error {categories_request.status_code} while getting categories")

    categories_response = categories_request.json()

    if categories_response["error"] == True:
        raise ValueError(f"Error {categories_response['errorText']} while getting categories")

    for wb_category in categories_response["data"]:
        category, created = Category.objects.get_or_create(
            wb_id=wb_category["id"],
            defaults={
                "wb_id": wb_category["id"],
                "name_ru": wb_category["name"] if locale == "ru" else None,
                "name_en": wb_category["name"] if locale == "en" else None,
                "parent": None,
            },
        )

        if locale == "ru":
            category.name_ru = wb_category["name"]

        if locale == "en":
            category.name_en = wb_category["name"]

        category.save()

    return categories_response["data"]


def get_all_subcategories(locale: str = "ru"):
    category_length = 10000
    offset = 0
    while category_length >= 1000:
        print(f"Current length: {category_length}, Current offset: {offset}")
        categories = get_category_children(1000, offset, locale)
        category_length = len(categories)
        offset += 1000


def get_category_children(limit: int, offset: int, locale: str = "ru"):
    url = f"{URL}/content/v2/object/all"

    response = requests.get(
        url, {"locale": locale, "limit": limit, "offset": offset},
        headers={"Authorization": f"Bearer {API_TOKEN}"}
    )

    if response.status_code != 200:
        raise ValueError(f"Error {response.status_code} while getting category children")

    body = response.json()

    if body["error"] == True:
        raise ValueError(f"Error {body['errorText']} while getting category children")

    for wb_subcategory in body["data"]:
        parent = Category.objects.get(wb_id=wb_subcategory["parentID"])

        category, created = Category.objects.get_or_create(
            wb_id=wb_subcategory["subjectID"],
            defaults={
                "wb_id": wb_subcategory["subjectID"],
                "name_ru": wb_subcategory["subjectName"] if locale == "ru" else None,
                "name_en": wb_subcategory["subjectName"] if locale == "en" else None,
                "parent": parent,
            },
        )

        if locale == "ru":
            category.name_ru = wb_subcategory["subjectName"]

        if locale == "en":
            category.name_en = wb_subcategory["subjectName"]

        category.save()

    return body["data"]

def get_all_category_charcs():
    print("Getting characteristics for categories")
    categories = Category.objects.filter(parent__isnull=False)[580:]
    get_characteristics_for_categories(categories, locale="en")


def get_characteristics_for_categories(categories: QuerySet[Category], locale: str = "ru"):
    # Need to be careful of rate limits. Wildberries allows 100 requests per minute
    request_count = 0
    start_time = time.time()

    for category in tqdm(categories):
        if request_count >= 95:

            end_time = time.time()
            elapsed_time = end_time - start_time

            if elapsed_time < 60:
                print("Rate limit!")
                print("Elapsed time:", elapsed_time)
                print("Sleeping for:", 60 - elapsed_time)
                time.sleep(60 - elapsed_time)

            start_time = time.time()
            request_count = 0

        characteristics = get_category_characteristics(category.wb_id, locale)
        for characteristic in characteristics:
            if characteristic["charcType"] == 1:
                charc_type = "STRING"
            elif characteristic["charcType"] == 0:
                charc_type = "ARRAY_STRING"
            elif characteristic["charcType"] == 4:
                charc_type = "ARRAY_NUMBER"
            else:
                charc_type = "ARRAY_STRING"

            charc, created = Characteristic.objects.get_or_create(
                wb_id=characteristic["charcID"],
                defaults={
                    "wb_id": characteristic["charcID"],
                    "name_ru": characteristic["name"] if locale == "ru" else None,
                    "name_en": characteristic["name"] if locale == "en" else None,
                    "required": characteristic["required"],
                    "unit_name_ru": characteristic["unitName"] if locale == "ru" else None,
                    "unit_name_en": characteristic["unitName"] if locale == "en" else None,
                    "max_count": characteristic["maxCount"],
                    "type": charc_type,
                }
            )

            if locale == "ru":
                charc.name_ru = characteristic["name"]
                charc.unit_name_ru = characteristic["unitName"]

            if locale == "en":
                charc.name_en = characteristic["name"]
                charc.unit_name_en = characteristic["unitName"]

            charc.save()

            category_characteristic, created = CategoryCharacteristic.objects.get_or_create(
                category=category,
                characteristic=charc,
                defaults={
                    "category": category,
                    "characteristic": charc
                }
            )


def get_category_characteristics(subject_id: int, locale: str = "ru"):
    url = f"{URL}/content/v2/object/charcs/{subject_id}"

    response = requests.get(
        url, {"locale": locale},
        headers={"Authorization": f"Bearer {API_TOKEN}"}
    )

    body = response.json()

    if body["error"] == True:
        raise ValueError(f"Error {body['errorText']} while getting category characteristics")

    return body["data"]


if __name__ == "__main__":
    categories = get_wildberries_categories()
    print("Categories:", categories)
    # categories_parsed = parse_wildberries_categories({}, categories)
    # categories = get_wildberries_categories(locale="en")
    # categories_parsed = parse_wildberries_categories(categories_parsed, categories, locale="en")
    # print("Parsed Categories:", categories_parsed)
    # children = get_category_children(3497, categories_parsed[3497])
    # print("Category Children:", children)
    # print("Category children count:", len(children))
    # characteristics = get_category_characteristics(2158)


