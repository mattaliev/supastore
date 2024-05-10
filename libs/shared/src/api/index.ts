import {
  cartAddItemMutation,
  cartCreateMutation,
  cartRemoveItemMutation,
  cartUpdateItemMutation,
  orderCreateMutation,
  orderDeleteMutation,
  orderStatusUpdateMutation,
  paymentCreateMutation,
  paymentMethodCreateMutation,
  paymentMethodDeleteMutation,
  paymentMethodUpdateMutation,
  paymentStatusUpdateMutation,
  productCreateMutation,
  productDeleteMutation,
  productUpdateMutation,
  shippingAddTrackingMutation,
  shippingDetailsCreateMutation,
  shippingDetailsUpdateMutation,
  signInShopUserMutation,
  signOutAdminMutation,
  singInAdminMutation,
} from "./mutations";
import {
  cartGetQuery,
  customerDetailQuery,
  customerPaginatedQuery,
  orderGetByCartIdQuery,
  orderGetByIdQuery,
  ordersPaginatedGetQuery,
  paymentMethodsListQuery,
  productDetailQuery,
  productsGetQuery,
  productsPaginatedGetQuery,
  salesAnalyticsGetQuery,
  shopPaymentMethodsListQuery,
} from "./queries";
import {
  BackendCartAddItemOperation,
  BackendCartCreateOperation,
  BackendCartGetOperation,
  BackendCartRemoveItemOperation,
  BackendCartUpdateItemOperation,
  BackendCustomerDetailOperation,
  BackendCustomersPaginatedGetOperation,
  BackendOrderCreateOperation,
  BackendOrderDeleteOperation,
  BackendOrderGetByCartIdOperation,
  BackendOrderGetByIdOperation,
  BackendOrderPaginatedGetOperation,
  BackendOrderStatusUpdateOperation,
  BackendPaymentCreateOperation,
  BackendPaymentMethodCreateOperation,
  BackendPaymentMethodDeleteOperation,
  BackendPaymentMethodsListOperations,
  BackendPaymentMethodUpdateOperation,
  BackendPaymentStatusUpdateOperation,
  BackendProductCreateOperation,
  BackendProductDeleteOperation,
  BackendProductDetailOperation,
  BackendProductsGetOperation,
  BackendProductsPaginatedGetOperation,
  BackendProductUpdateOperation,
  BackendSalesAnalyticsOperation,
  BackendShippingAddTrackingOperation,
  BackendShippingDetailsCreateOperation,
  BackendShippingDetailsUpdateOperation,
  BackendShopPaymentMethodsListOperation,
  BackendSignInAdminOperation,
  BackendSignInShopUserOperation,
  BackendSignOutAdminOperation,
  Cart,
  EntityState,
  FulfilmentStatus,
  Order,
  Paginated,
  ParsedPaymentMethod,
  PaymentProvider,
  PaymentStatus,
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  SafePaymentMethod,
  SalesAnalytics,
  Shipping,
  ShippingDetails,
  TelegramUser,
  TelegramUserDetailParsed,
  TelegramUserList,
} from "./types";

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : undefined;

export type APIFunction<T, U> = (
  body: T,
  headers: { Authorization: string },
) => Promise<U>;

const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/graphql/`;

export const TAGS = {
  CART: "cart",
  PRODUCT: "product",
  ORDER: "order",
  PAYMENT: "payment",
  USER: "user",
};

export const backendFetch = async <T>({
  query,
  variables,
  cache,
  tags,
  headers,
}: {
  query: string;
  variables?: ExtractVariables<T>;
  cache?: RequestCache;
  tags?: string[];
  headers?: HeadersInit;
}): Promise<{ status: number; body: T }> => {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw {
        errors: body.errors[0],
        query,
      };
    }
    return { status: result.status, body };
  } catch (e: any) {
    console.error(e);

    const error = e.errors ? e.errors.message : e;
    const errorCode =
      e.errors && e.errors.extensions && e.errors.extensions.code
        ? e.errors.extensions.code
        : "UNKNOWN";

    throw {
      message: error,
      errorCode,
      query,
    };
  }
};

export const signInShopUser = async (
  body: {
    initDataRaw: string;
    cartId?: string;
  },
  headers?: HeadersInit,
): Promise<{ user: TelegramUser; cart: Cart }> => {
  const { body: responseBody } =
    await backendFetch<BackendSignInShopUserOperation>({
      query: signInShopUserMutation,
      variables: body,
      cache: "no-store",
      headers,
    });

  return responseBody.data.signInShopUser;
};

export const productsGet = async (
  body: {
    state?: EntityState;
  },
  headers?: HeadersInit,
): Promise<Product[]> => {
  const { body: responseBody } =
    await backendFetch<BackendProductsGetOperation>({
      query: productsGetQuery,
      tags: [TAGS.PRODUCT],
      variables: body,
      headers,
    });

  if (!responseBody.data.productsGet) {
    return [];
  }

  return responseBody.data.productsGet;
};

export const productsPaginatedGet = async (
  body: {
    state?: EntityState;
    page?: number;
    limit?: number;
  },
  headers?: HeadersInit,
): Promise<Paginated<Product>> => {
  const { body: responseBody } =
    await backendFetch<BackendProductsPaginatedGetOperation>({
      query: productsPaginatedGetQuery,
      variables: body,
      tags: [TAGS.PRODUCT],
      headers,
    });

  return responseBody.data.productsPaginatedGet;
};

export const productDetail = async (
  body: {
    id: string;
  },
  headers?: HeadersInit,
): Promise<Product | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendProductDetailOperation>({
      query: productDetailQuery,
      variables: body,
      tags: [TAGS.PRODUCT],
      headers,
    });

  if (!responseBody.data.productDetail) {
    return undefined;
  }

  return responseBody.data.productDetail;
};

export const productCreate = async (
  body: {
    input: ProductCreateInput;
  },
  headers?: HeadersInit,
): Promise<Product | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendProductCreateOperation>({
      query: productCreateMutation,
      tags: [TAGS.PRODUCT],
      variables: body,
      headers,
    });

  if (!responseBody.data.productCreate.product) {
    return undefined;
  }

  return responseBody.data.productCreate.product;
};

export const productUpdate = async (
  body: {
    input: ProductUpdateInput;
  },
  headers?: HeadersInit,
): Promise<Product | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendProductUpdateOperation>({
      query: productUpdateMutation,
      tags: [TAGS.PRODUCT],
      variables: body,
      headers,
    });

  if (!responseBody.data.productUpdate.product) {
    return undefined;
  }

  return responseBody.data.productUpdate.product;
};

export const productDelete = async (
  body: { id: string },
  headers?: HeadersInit,
): Promise<boolean> => {
  const { body: responseBody } =
    await backendFetch<BackendProductDeleteOperation>({
      query: productDeleteMutation,
      tags: [TAGS.PRODUCT],
      variables: body,
      headers,
    });

  return responseBody.data.productDelete.success;
};

export const cartGet = async (
  body: { cartId?: string },
  headers?: HeadersInit,
): Promise<Cart | undefined> => {
  const { body: responseBody } = await backendFetch<BackendCartGetOperation>({
    query: cartGetQuery,
    variables: body,
    tags: [TAGS.CART],
    headers,
  });

  if (!responseBody.data.cartGet) {
    return undefined;
  }

  return responseBody.data.cartGet;
};

export const cartCreate = async (headers?: HeadersInit): Promise<Cart> => {
  const { body } = await backendFetch<BackendCartCreateOperation>({
    query: cartCreateMutation,
    cache: "no-store",
    tags: [TAGS.CART],
    headers,
  });

  return body.data.cartCreate.cart;
};

export const cartAddItem = async (
  body: {
    input: {
      cartId: string;
      productId: string;
      variantId: string | null;
      quantity: number;
    };
  },
  headers?: HeadersInit,
): Promise<Cart | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendCartAddItemOperation>({
      query: cartAddItemMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.CART],
      headers,
    });

  if (!responseBody.data.addToCart.cart) {
    return undefined;
  }

  return responseBody.data.addToCart.cart;
};

export const cartRemoveItem = async (
  body: {
    input: {
      cartId: string;
      cartItemId: string;
      quantity: number;
    };
  },
  headers?: HeadersInit,
): Promise<Cart | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendCartRemoveItemOperation>({
      query: cartRemoveItemMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.CART],
      headers,
    });

  if (!responseBody.data.removeFromCart.cart) {
    return undefined;
  }

  return responseBody.data.removeFromCart.cart;
};

export const cartUpdateItem = async (
  body: {
    input: {
      cartId: string;
      cartItemId: string;
      quantity: number;
    };
  },
  headers?: HeadersInit,
): Promise<Cart | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendCartUpdateItemOperation>({
      query: cartUpdateItemMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.CART],
      headers,
    });

  if (!responseBody.data.cartItemUpdate.cart) {
    return undefined;
  }

  return responseBody.data.cartItemUpdate.cart;
};

export const orderGetById = async (
  body: {
    orderId: string;
    state?: string;
  },
  headers?: HeadersInit,
): Promise<Order | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendOrderGetByIdOperation>({
      query: orderGetByIdQuery,
      variables: body,
      tags: [TAGS.ORDER],
      headers,
    });

  if (!responseBody.data.orderGetById) {
    return undefined;
  }

  return responseBody.data.orderGetById;
};

export const orderGetByCartId = async (
  body: {
    cartId: string;
    state?: string;
  },
  headers?: HeadersInit,
): Promise<Order | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendOrderGetByCartIdOperation>({
      query: orderGetByCartIdQuery,
      variables: {
        ...body,
      },
      tags: [TAGS.ORDER],
      headers,
    });

  return responseBody.data.orderGetByCartId;
};

export const ordersPaginatedGet = async (
  body: {
    state?: EntityState;
    paymentStatus?: PaymentStatus;
    fulfilmentStatus?: FulfilmentStatus;
    page?: number;
    limit?: number;
  },
  headers?: HeadersInit,
): Promise<Paginated<Order>> => {
  const { body: responseBody } =
    await backendFetch<BackendOrderPaginatedGetOperation>({
      query: ordersPaginatedGetQuery,
      variables: body,
      tags: [TAGS.ORDER],
      cache: "no-store",
      headers,
    });

  return responseBody.data.ordersPaginatedGet;
};

export const orderCreate = async (
  body: {
    cartId: string;
  },
  headers?: HeadersInit,
): Promise<Order> => {
  const { body: responseBody } =
    await backendFetch<BackendOrderCreateOperation>({
      query: orderCreateMutation,
      variables: {
        ...body,
      },
      cache: "no-store",
      tags: [TAGS.ORDER],
      headers,
    });

  return responseBody.data.orderCreate.order;
};

export const orderStatusUpdate = async (
  body: {
    input: {
      orderId: string;
      fulfilmentStatus: FulfilmentStatus;
      notifyCustomer?: boolean;
    };
  },
  headers?: HeadersInit,
): Promise<Order> => {
  const { body: responseBody } =
    await backendFetch<BackendOrderStatusUpdateOperation>({
      query: orderStatusUpdateMutation,
      tags: [TAGS.ORDER],
      variables: body,
      cache: "no-store",
      headers,
    });

  return responseBody.data.orderStatusUpdate.order;
};

export const orderDelete = async (
  body: {
    orderId: string;
  },
  headers?: HeadersInit,
): Promise<{
  success: boolean;
}> => {
  const { body: responseBody } =
    await backendFetch<BackendOrderDeleteOperation>({
      query: orderDeleteMutation,
      tags: [TAGS.ORDER],
      variables: body,
      cache: "no-store",
      headers,
    });

  return responseBody.data.orderDelete;
};

export const shippingAddTracking = async (
  body: {
    input: {
      shippingId: string;
      trackingNumber: string;
      carrier: string;
    };
  },
  headers?: HeadersInit,
): Promise<Shipping> => {
  const { body: responseBody } =
    await backendFetch<BackendShippingAddTrackingOperation>({
      query: shippingAddTrackingMutation,
      tags: [TAGS.ORDER],
      variables: body,
      cache: "no-store",
      headers,
    });

  return responseBody.data.shippingAddTracking.shipping;
};

export const shippingDetailsCreate = async (
  body: {
    input: ShippingDetails & {
      shippingId: string;
      userId?: string;
      isDefault: boolean;
    };
  },
  headers?: HeadersInit,
): Promise<ShippingDetails> => {
  const { body: responseBody } =
    await backendFetch<BackendShippingDetailsCreateOperation>({
      query: shippingDetailsCreateMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.ORDER],
      headers,
    });

  return responseBody.data.shippingDetailsCreate.shippingDetails;
};

export const shippingDetailsUpdate = async (
  body: {
    input: ShippingDetails & {
      shippingDetailsId: string;
      shippingId: string;
      userId?: string;
      isDefault: boolean;
    };
  },
  headers?: HeadersInit,
): Promise<ShippingDetails> => {
  const { body: responseBody } =
    await backendFetch<BackendShippingDetailsUpdateOperation>({
      query: shippingDetailsUpdateMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.ORDER],
      headers,
    });

  return responseBody.data.shippingDetailsUpdate.shippingDetails;
};

export const salesAnalyticsGet = async (
  headers?: HeadersInit,
): Promise<SalesAnalytics> => {
  const { body } = await backendFetch<BackendSalesAnalyticsOperation>({
    query: salesAnalyticsGetQuery,
    tags: [TAGS.ORDER],
    cache: "no-store",
    headers,
  });

  const {
    salesThisWeek,
    salesThisMonth,
    salesIncreaseThisWeek,
    salesIncreaseThisMonth,
  } = body.data.salesAnalyticsGet;

  return {
    salesThisWeek: parseInt(salesThisWeek),
    salesThisMonth: parseInt(salesThisMonth),
    salesIncreaseThisWeek: parseInt(salesIncreaseThisWeek),
    salesIncreaseThisMonth: parseInt(salesIncreaseThisMonth),
  };
};

export const paymentMethodsList = async (
  body: {
    state?: EntityState;
  },
  headers?: HeadersInit,
): Promise<ParsedPaymentMethod[]> => {
  const { body: responseBody } =
    await backendFetch<BackendPaymentMethodsListOperations>({
      query: paymentMethodsListQuery,
      variables: body,
      tags: [TAGS.PAYMENT],
      headers,
    });

  return responseBody.data.paymentMethodsList.map((paymentMethod) => {
    return {
      ...paymentMethod,
      otherInfo: paymentMethod.otherInfo
        ? JSON.parse(paymentMethod.otherInfo)
        : undefined,
      provider: paymentMethod.provider as PaymentProvider,
    };
  });
};

export const shopPaymentMethodsList = async (
  body: {
    state?: EntityState;
  },
  headers?: HeadersInit,
): Promise<SafePaymentMethod[]> => {
  const { body: responseBody } =
    await backendFetch<BackendShopPaymentMethodsListOperation>({
      query: shopPaymentMethodsListQuery,
      variables: body,
      tags: [TAGS.PAYMENT],
      headers,
    });

  return responseBody.data.paymentMethodsList;
};

export const paymentMethodCreate = async (
  body: {
    input: {
      name: string;
      provider: PaymentProvider;
      otherInfo?: string;
      buttonText?: string;
      state?: EntityState;
    };
  },
  headers?: HeadersInit,
) => {
  const { body: responseBody } =
    await backendFetch<BackendPaymentMethodCreateOperation>({
      query: paymentMethodCreateMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.PAYMENT],
      headers,
    });

  return responseBody.data.paymentMethodCreate.paymentMethod;
};

export const paymentMethodUpdate = async (
  body: {
    input: {
      paymentMethodId: string;
      name: string;
      provider: PaymentProvider;
      otherInfo?: string;
      buttonText?: string;
      state?: EntityState;
    };
  },
  headers?: HeadersInit,
) => {
  const { body: responseBody } =
    await backendFetch<BackendPaymentMethodUpdateOperation>({
      query: paymentMethodUpdateMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.PAYMENT],
      headers,
    });

  return responseBody.data.paymentMethodUpdate.paymentMethod;
};

export const paymentMethodDelete = async (
  body: {
    paymentMethodId: string;
  },
  headers?: HeadersInit,
): Promise<boolean> => {
  const { body: responseBody } =
    await backendFetch<BackendPaymentMethodDeleteOperation>({
      query: paymentMethodDeleteMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.PAYMENT],
      headers,
    });

  return responseBody.data.paymentMethodDelete.success;
};

export const paymentCreate = async (
  body: {
    input: {
      orderId: string;
      paymentMethodId: string;
      currency?: string;
      notifyCustomer?: boolean;
    };
  },
  headers?: HeadersInit,
): Promise<{ paymentInfo: string; provider: PaymentProvider } | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendPaymentCreateOperation>({
      query: paymentCreateMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.PAYMENT, TAGS.ORDER],
      headers,
    });

  return responseBody.data.paymentCreate;
};

export const paymentStatusUpdate = async (
  body: {
    input: {
      paymentId: string;
      paymentStatus: PaymentStatus;
      notifyCustomer?: boolean;
    };
  },
  headers?: HeadersInit,
): Promise<boolean> => {
  const { body: responseBody } =
    await backendFetch<BackendPaymentStatusUpdateOperation>({
      query: paymentStatusUpdateMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.PAYMENT, TAGS.ORDER],
      headers,
    });

  return responseBody.data.paymentStatusUpdate.success;
};

export const customerDetail = async (
  body: {
    userId: string;
  },
  headers?: HeadersInit,
): Promise<TelegramUserDetailParsed> => {
  const { body: responseBody } =
    await backendFetch<BackendCustomerDetailOperation>({
      query: customerDetailQuery,
      variables: body,
      cache: "no-store",
      tags: [TAGS.USER],
      headers,
    });

  const parsedEvents = responseBody.data.customerDetail.events.map((event) => {
    return {
      ...event,
      eventData: event.eventData ? JSON.parse(event.eventData) : undefined,
    };
  });

  return {
    ...responseBody.data.customerDetail,
    events: parsedEvents,
  };
};

export const customersPaginated = async (
  body: {
    page?: number;
    limit?: number;
    sortBy?: "TOTAL_SALES" | "TOTAL_VISITS";
  },
  headers?: HeadersInit,
): Promise<Paginated<TelegramUserList>> => {
  const { body: responseBody } =
    await backendFetch<BackendCustomersPaginatedGetOperation>({
      query: customerPaginatedQuery,
      variables: body,
      tags: [TAGS.USER],
      cache: "no-store",
      headers,
    });

  return responseBody.data.customersPaginated;
};

export const signInAdmin = async (
  {
    dataCheckString,
  }: {
    dataCheckString: string;
  },
  headers?: HeadersInit,
): Promise<{ user: TelegramUser; accessToken: string } | undefined> => {
  const { body } = await backendFetch<BackendSignInAdminOperation>({
    query: singInAdminMutation,
    variables: {
      dataCheckString,
    },
    cache: "no-store",
    tags: [TAGS.USER],
    headers,
  });

  return body.data.signInAdmin;
};

export const signOutAdmin = async (
  body: {
    token: string;
  },
  headers?: HeadersInit,
): Promise<boolean> => {
  const { body: responseBody } =
    await backendFetch<BackendSignOutAdminOperation>({
      query: signOutAdminMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.USER],
      headers,
    });

  return responseBody.data.signOutAdmin.success;
};
