import { orderFragment, orderPaginatedFragment } from "../fragments";

export const ordersPaginatedGetQuery = /* GraphQL */ `
  query OrderPaginatedGet(
    $storeId: UUID!
    $paymentStatus: String
    $fulfilmentStatus: String
    $state: String
    $page: Int
    $limit: Int
  ) {
    ordersPaginatedGet(
      storeId: $storeId
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
  query OrderGetByIdQuery($orderId: UUID!, $storeId: UUID!, $state: String) {
    orderGetById(orderId: $orderId, storeId: $storeId, state: $state) {
      ...OrderFields
    }
  }
  ${orderFragment}
`;

export const orderGetByCartIdQuery = /* GraphQL */ `
  query orderGetByCartId($cartId: UUID!, $storeId: UUID!, $state: String) {
    orderGetByCartId(cartId: $cartId, storeId: $storeId, state: $state) {
      ...OrderFields
    }
  }
  ${orderFragment}
`;
