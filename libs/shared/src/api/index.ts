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
  registerUserMutation,
  shippingAddTrackingMutation,
  shippingDetailsCreateMutation,
  shippingDetailsUpdateMutation,
} from "./mutations";
import {
  cartGetQuery,
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
  BackendRegisterUserOperation,
  BackendSalesAnalyticsOperation,
  BackendShippingAddTrackingOperation,
  BackendShippingDetailsCreateOperation,
  BackendShippingDetailsUpdateOperation,
  BackendShopPaymentMethodsListOperation,
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
  RegisterUserInput,
  SafePaymentMethod,
  SalesAnalytics,
  Shipping,
  ShippingDetails,
  TelegramUser,
} from "./types";

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : undefined;

const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/graphql/`;

export const TAGS = {
  CART: "cart",
  PRODUCT: "product",
  ORDER: "order",
  PAYMENT: "payment",
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
  } catch (e) {
    console.error(e);

    throw {
      error: e,
      query,
    };
  }
};

export const registerUser = async (
  input: RegisterUserInput,
  cartId?: string,
): Promise<{ user: TelegramUser; cart: Cart }> => {
  const { body } = await backendFetch<BackendRegisterUserOperation>({
    query: registerUserMutation,
    variables: {
      input,
      cartId,
    },
    cache: "no-store",
  });

  return body.data.register;
};

export const productsGet = async ({
  state,
}: {
  state?: EntityState;
}): Promise<Product[]> => {
  const { body } = await backendFetch<BackendProductsGetOperation>({
    query: productsGetQuery,
    tags: [TAGS.PRODUCT],
    variables: {
      state,
    },
  });

  if (!body.data.productsGet) {
    return [];
  }

  return body.data.productsGet;
};

export const productsPaginatedGet = async ({
  state,
  page,
  limit,
}: {
  state?: EntityState;
  page?: number;
  limit?: number;
}): Promise<Paginated<Product>> => {
  const { body } = await backendFetch<BackendProductsPaginatedGetOperation>({
    query: productsPaginatedGetQuery,
    variables: { state, page, limit },
    tags: [TAGS.PRODUCT],
  });

  return body.data.productsPaginatedGet;
};

export const productDetail = async (
  id: string,
): Promise<Product | undefined> => {
  const { body } = await backendFetch<BackendProductDetailOperation>({
    query: productDetailQuery,
    variables: { id },
    tags: [TAGS.PRODUCT],
  });

  if (!body.data.productDetail) {
    return undefined;
  }

  return body.data.productDetail;
};

export const productCreate = async (
  input: ProductCreateInput,
): Promise<Product | undefined> => {
  const { body } = await backendFetch<BackendProductCreateOperation>({
    query: productCreateMutation,
    tags: [TAGS.PRODUCT],
    variables: {
      input,
    },
  });

  if (!body.data.productCreate.product) {
    return undefined;
  }

  return body.data.productCreate.product;
};

export const productUpdate = async (
  input: ProductUpdateInput,
): Promise<Product | undefined> => {
  const { body } = await backendFetch<BackendProductUpdateOperation>({
    query: productUpdateMutation,
    tags: [TAGS.PRODUCT],
    variables: {
      input,
    },
  });

  if (!body.data.productUpdate.product) {
    return undefined;
  }

  return body.data.productUpdate.product;
};

export const productDelete = async (id: string): Promise<boolean> => {
  const { body } = await backendFetch<BackendProductDeleteOperation>({
    query: productDeleteMutation,
    tags: [TAGS.PRODUCT],
    variables: {
      id,
    },
  });

  return body.data.productDelete.success;
};

export const cartGet = async (cartId?: string): Promise<Cart | undefined> => {
  const { body } = await backendFetch<BackendCartGetOperation>({
    query: cartGetQuery,
    variables: {
      cartId,
    },
    cache: "no-store",
    tags: [TAGS.CART],
  });

  if (!body.data.cartGet) {
    return undefined;
  }

  return body.data.cartGet;
};

export const cartCreate = async (): Promise<Cart> => {
  const { body } = await backendFetch<BackendCartCreateOperation>({
    query: cartCreateMutation,
    cache: "no-store",
    tags: [TAGS.CART],
  });

  return body.data.cartCreate.cart;
};

export const cartAddItem = async (input: {
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
}): Promise<Cart | undefined> => {
  const { body } = await backendFetch<BackendCartAddItemOperation>({
    query: cartAddItemMutation,
    variables: {
      input,
    },
    cache: "no-store",
    tags: [TAGS.CART],
  });

  if (!body.data.addToCart.cart) {
    return undefined;
  }

  return body.data.addToCart.cart;
};

export const cartRemoveItem = async (input: {
  cartId: string;
  cartItemId: string;
  quantity: number;
}): Promise<Cart | undefined> => {
  const { body } = await backendFetch<BackendCartRemoveItemOperation>({
    query: cartRemoveItemMutation,
    variables: {
      input,
    },
    cache: "no-store",
    tags: [TAGS.CART],
  });

  if (!body.data.removeFromCart.cart) {
    return undefined;
  }

  return body.data.removeFromCart.cart;
};

export const cartUpdateItem = async (input: {
  cartId: string;
  cartItemId: string;
  quantity: number;
}): Promise<Cart | undefined> => {
  const { body } = await backendFetch<BackendCartUpdateItemOperation>({
    query: cartUpdateItemMutation,
    variables: {
      input,
    },
    cache: "no-store",
    tags: [TAGS.CART],
  });

  if (!body.data.cartItemUpdate.cart) {
    return undefined;
  }

  return body.data.cartItemUpdate.cart;
};

export const orderGetById = async (
  orderId: string,
  state?: string,
): Promise<Order | undefined> => {
  const { body } = await backendFetch<BackendOrderGetByIdOperation>({
    query: orderGetByIdQuery,
    variables: {
      orderId,
      state,
    },
    cache: "no-store",
    tags: [TAGS.ORDER],
  });

  if (!body.data.orderGetById) {
    return undefined;
  }

  return body.data.orderGetById;
};

export const orderGetByCartId = async (
  cartId: string,
  state?: string,
): Promise<Order | undefined> => {
  const { body } = await backendFetch<BackendOrderGetByCartIdOperation>({
    query: orderGetByCartIdQuery,
    variables: {
      cartId,
      state,
    },
    cache: "no-store",
    tags: [TAGS.ORDER],
  });

  return body.data.orderGetByCartId;
};

export const ordersPaginatedGet = async ({
  state,
  page,
  limit,
  paymentStatus,
  fulfilmentStatus,
}: {
  state?: EntityState;
  paymentStatus?: PaymentStatus;
  fulfilmentStatus?: FulfilmentStatus;
  page?: number;
  limit?: number;
}): Promise<Paginated<Order>> => {
  const { body } = await backendFetch<BackendOrderPaginatedGetOperation>({
    query: ordersPaginatedGetQuery,
    variables: { paymentStatus, fulfilmentStatus, state, page, limit },
    tags: [TAGS.ORDER],
    cache: "no-store",
  });

  return body.data.ordersPaginatedGet;
};

export const orderCreate = async (
  cartId: string,
  userId?: string,
): Promise<Order> => {
  const { body } = await backendFetch<BackendOrderCreateOperation>({
    query: orderCreateMutation,
    variables: {
      userId,
      cartId,
    },
    cache: "no-store",
    tags: [TAGS.ORDER],
  });

  return body.data.orderCreate.order;
};

export const orderStatusUpdate = async (input: {
  orderId: string;
  fulfilmentStatus: FulfilmentStatus;
  notifyCustomer?: boolean;
}): Promise<Order> => {
  const { body } = await backendFetch<BackendOrderStatusUpdateOperation>({
    query: orderStatusUpdateMutation,
    tags: [TAGS.ORDER],
    variables: { input },
  });

  return body.data.orderStatusUpdate.order;
};

export const orderDelete = async (
  orderId: string,
): Promise<{
  success: boolean;
}> => {
  const { body } = await backendFetch<BackendOrderDeleteOperation>({
    query: orderDeleteMutation,
    tags: [TAGS.ORDER],
    variables: {
      orderId,
    },
  });

  return body.data.orderDelete;
};

export const shippingAddTracking = async (input: {
  shippingId: string;
  trackingNumber: string;
  carrier: string;
}): Promise<Shipping> => {
  const { body } = await backendFetch<BackendShippingAddTrackingOperation>({
    query: shippingAddTrackingMutation,
    tags: [TAGS.ORDER],
    variables: { input },
  });

  return body.data.shippingAddTracking.shipping;
};

export const shippingDetailsCreate = async (
  input: ShippingDetails & {
    shippingId: string;
    userId?: string;
    isDefault: boolean;
  },
): Promise<ShippingDetails> => {
  const { body } = await backendFetch<BackendShippingDetailsCreateOperation>({
    query: shippingDetailsCreateMutation,
    variables: {
      input,
    },
    cache: "no-store",
    tags: [TAGS.ORDER],
  });

  return body.data.shippingDetailsCreate.shippingDetails;
};

export const shippingDetailsUpdate = async (
  input: ShippingDetails & {
    shippingDetailsId: string;
    shippingId: string;
    userId?: string;
    isDefault: boolean;
  },
): Promise<ShippingDetails> => {
  const { body } = await backendFetch<BackendShippingDetailsUpdateOperation>({
    query: shippingDetailsUpdateMutation,
    variables: {
      input,
    },
    cache: "no-store",
    tags: [TAGS.ORDER],
  });

  return body.data.shippingDetailsUpdate.shippingDetails;
};

export const salesAnalyticsGet = async (): Promise<SalesAnalytics> => {
  const { body } = await backendFetch<BackendSalesAnalyticsOperation>({
    query: salesAnalyticsGetQuery,
    tags: [TAGS.ORDER],
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
  state?: EntityState,
): Promise<ParsedPaymentMethod[]> => {
  const { body } = await backendFetch<BackendPaymentMethodsListOperations>({
    query: paymentMethodsListQuery,
    cache: "no-store",
    variables: {
      state,
    },
    tags: [TAGS.PAYMENT],
  });

  return body.data.paymentMethodsList.map((paymentMethod) => {
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
  state?: EntityState,
): Promise<SafePaymentMethod[]> => {
  const { body } = await backendFetch<BackendShopPaymentMethodsListOperation>({
    query: shopPaymentMethodsListQuery,
    cache: "no-store",
    variables: {
      state,
    },
    tags: [TAGS.PAYMENT],
  });

  return body.data.paymentMethodsList;
};

export const paymentMethodCreate = async (input: {
  name: string;
  provider: PaymentProvider;
  otherInfo?: string;
  buttonText?: string;
  state?: EntityState;
}) => {
  const { body } = await backendFetch<BackendPaymentMethodCreateOperation>({
    query: paymentMethodCreateMutation,
    variables: {
      input,
    },
    cache: "no-store",
    tags: [TAGS.PAYMENT],
  });

  return body.data.paymentMethodCreate.paymentMethod;
};

export const paymentMethodUpdate = async (input: {
  paymentMethodId: string;
  name: string;
  provider: PaymentProvider;
  otherInfo?: string;
  buttonText?: string;
  state?: EntityState;
}) => {
  const { body } = await backendFetch<BackendPaymentMethodUpdateOperation>({
    query: paymentMethodUpdateMutation,
    variables: {
      input,
    },
    cache: "no-store",
    tags: [TAGS.PAYMENT],
  });

  return body.data.paymentMethodUpdate.paymentMethod;
};

export const paymentMethodDelete = async (
  paymentMethodId: string,
): Promise<boolean> => {
  const { body } = await backendFetch<BackendPaymentMethodDeleteOperation>({
    query: paymentMethodDeleteMutation,
    variables: {
      paymentMethodId,
    },
    cache: "no-store",
    tags: [TAGS.PAYMENT],
  });

  return body.data.paymentMethodDelete.success;
};

export const paymentCreate = async (input: {
  orderId: string;
  paymentMethodId: string;
  currency?: string;
  notifyCustomer?: boolean;
}): Promise<{ paymentInfo: string; provider: PaymentProvider } | undefined> => {
  const { body } = await backendFetch<BackendPaymentCreateOperation>({
    query: paymentCreateMutation,
    variables: {
      input,
    },
    cache: "no-store",
    tags: [TAGS.PAYMENT, TAGS.ORDER],
  });

  return body.data.paymentCreate;
};

export const paymentStatusUpdate = async (input: {
  paymentId: string;
  paymentStatus: PaymentStatus;
  notifyCustomer?: boolean;
}): Promise<boolean> => {
  const { body } = await backendFetch<BackendPaymentStatusUpdateOperation>({
    query: paymentStatusUpdateMutation,
    variables: {
      input,
    },
    cache: "no-store",
    tags: [TAGS.PAYMENT, TAGS.ORDER],
  });

  return body.data.paymentStatusUpdate.success;
};
