import requests
import json


class WbAPI:
    def __init__(self, wb_api_token: str):
        self.wb_api_token = wb_api_token
        self.wb_api_headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {wb_api_token}"
        }

    def get_products(self, limit: int = 100, updated_at: str = None, nm_id: int = None):
        url = "https://suppliers-api.wildberries.ru/content/v2/get/cards/list"

        body = {
            "settings": {
                "filter": {
                    "withPhoto": -1
                },
                "cursor": {
                    "limit": limit
                },
                "sort": {
                    "ascending": True
                }
            }
        }

        if nm_id and updated_at:
            body["settings"]["cursor"]["nmId"] = nm_id
            body["settings"]["cursor"]["updatedAt"] = updated_at

        payload = json.dumps(body)

        response = requests.request("POST", url, headers=self.wb_api_headers, data=payload)

        json_response = response.json()

        return json_response["cards"], json_response["cursor"]

    def get_all_products(self, limit: int = 100):
        all_products, cursor = self.get_products(limit=limit)

        while cursor["total"] < limit:
            new_products, cursor = self.get_products(limit=limit, updated_at=cursor["updatedAt"], nm_id=cursor["nmId"])
            all_products += new_products

        return all_products

    def get_product_sizes(self, limit: int = 1000, offset: int = 0):
        url = "https://discounts-prices-api.wildberries.ru/api/v2/list/goods/filter?limit=" + str(limit) + "&offset=" + str(offset)

        response = requests.get(url, headers=self.wb_api_headers)
        if response.status_code != 200:
            raise ValueError(f"Error {response.status_code} while getting product prices from Wildberries")

        json_response = response.json()
        products = json_response["data"]["listGoods"]
        sizes = map(lambda product: product["sizes"], products)

        return list(sizes), len(products)

    def get_all_product_sizes(self, limit: int = 1000):
        offset = 0
        sizes, total_products = self.get_product_sizes(limit=limit)

        while total_products < limit:
            offset += limit
            new_sizes, total_products = self.get_product_sizes(limit=limit, offset=offset)
            sizes += new_sizes

        return sizes
