import logging

from graphql import GraphQLError


class GraphqlErrorLogMiddleware(object):
    """
    Logs errors for invalid graphql queries
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger = logging.getLogger(__name__)

        try:
            response = self.get_response(request)
        except ValueError as e:
            logger.error(str(e))
            raise GraphQLError(str(e), extensions={"code": 500})
        except GraphQLError as e:
            logger.error(e.message)
            raise e

        return response
