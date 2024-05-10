export const customerFragment = /* GraphQL */ `
  fragment UserFields on TelegramUserType {
    id
    telegramId
    firstName
    lastName
    username
  }
`;

export const customerDetailFragment = /* GraphQL */ `
  fragment UserDetailFields on TelegramUserType {
    ...UserFields
    created
    updated
    events {
      id
      eventType
      eventData
      created
    }
    orders {
      id
      orderNumber
      payment {
        paymentStatus
      }
      totalAmount
      created
    }
    lastVisit
    orderCount
    completedPaymentCount
    amountSpent
    cartCount
    addedToCartCount
    totalCartAmount
    isNew
    favoriteProducts {
      id
      title
    }
  }
  ${customerFragment}
`;

export const customerListFragment = /* GraphQL */ `
  fragment UserListFields on TelegramUserType {
    ...UserFields
    lastVisit
    orderCount
    amountSpent
    totalVisitCount
    isNew
  }
  ${customerFragment}
`;

export const customerPaginatedFragment = /* GraphQL */ `
  fragment CustomerPaginatedFields on TelegramUserPaginatedType {
    objects {
      ...UserListFields
    }
    page
    pages
    hasNext
    hasPrev
    totalItems
  }
  ${customerListFragment}
`;
