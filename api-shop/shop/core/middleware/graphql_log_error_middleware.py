import json
import logging

from django.utils.log import log_response


class GraphqlErrorLogMiddleware(object):
    """
    Logs errors for invalid graphql queries
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        try:
            if 400 >= response.status_code and "graphql" in request.path.lower():
                response_json = json.loads(response.content)

                if "errors" in response_json:
                    log_response(
                        message=f"Graphql Error: {response_json['errors']}",
                        response=response,
                        level="error",
                    )
        except Exception as e:
            logging.debug(f"Error logging Graphql Error: {e}")

        return response
