import { orderFragment, orderPaginatedFragment } from "../fragments";

export const orderListQuery = /* GraphQL */ `
  query OrderListQuery($state: String) {
    orders(state: $state) {
      objects {
        ...OrderFields
      }
      hasNext
      hasPrev
      pages
      totalItems
    }
  }
  ${orderFragment}
`;

export const ordersPaginatedGetQuery = /* GraphQL */ `
  query OrderPaginatedGet(
    $paymentStatus: String
    $fulfilmentStatus: String
    $state: String
    $page: Int
    $limit: Int
  ) {
    ordersPaginatedGet(
      paymentStatus: $paymentStatus
      fulfilmentStatus: $fulfilmentStatus
      state: $state
      page: $page
      limit: $limit
    ) {
      ...PaginatedOrdersFields
    }
  }
  ${orderPaginatedFragment}
`;

export const orderGetByIdQuery = /* GraphQL */ `
  query OrderGetByIdQuery($orderId: UUID!, $state: String) {
    orderGetById(orderId: $orderId, state: $state) {
      ...OrderFields
    }
  }
  ${orderFragment}
`;

export const orderGetByCartIdQuery = /* GraphQL */ `
  query orderGetByCartId($cartId: UUID!) {
    orderGetByCartId(cartId: $cartId) {
      ...OrderFields
    }
  }
  ${orderFragment}
`;
