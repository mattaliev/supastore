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
  storeApplicationCreateMutation,
  storeConnectToTelegramMutation,
  storeUpdateMutation,
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
  storeBotTokenGetQuery,
  storeCanManageQuery,
  storeCheckpointsQuery,
  storeGetQuery,
  storeListQuery,
  storeLogoGetQuery,
} from "./queries/store";
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
  BackendStoreApplicationCreateOperation,
  BackendStoreBotTokenGetOperation,
  BackendStoreCanManageOperation,
  BackendStoreCheckpointsOperation,
  BackendStoreConnectToTelegramOperation,
  BackendStoreGetOperation,
  BackendStoreListOperation,
  BackendStoreLogoGetOperation,
  BackendStoreUpdateOperation,
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
  Store,
  StoreApplication,
  StoreCheckpoints,
  StoreUpdateInputType,
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
  STORE: "store",
};

export const backendFetch = async <T>({
  query,
  variables,
  cache,
  tags,
  headers,
  formData,
}: {
  query: string;
  variables?: ExtractVariables<T>;
  cache?: RequestCache;
  tags?: string[];
  headers?: HeadersInit;
  formData?: FormData;
}): Promise<{ status: number; body: T }> => {
  try {
    const reqBody = JSON.stringify({ query, variables });
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        ...(!formData ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: formData || reqBody,
      cache,
      ...(tags && { next: { tags } }),
    });

    if (!result.ok) {
      const responseText = await result.text();
      console.error("Response Text: ", responseText);
      throw {
        errors: responseText,
        query,
      };
    }

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
    storeId: string;
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
    storeId: string;
  },
  headers?: HeadersInit,
): Promise<Product[]> => {
  const { body: responseBody } =
    await backendFetch<BackendProductsGetOperation>({
      query: productsGetQuery,
      tags: [TAGS.PRODUCT],
      variables: body,
      headers,
      cache: "no-store",
    });

  if (!responseBody.data.productsGet) {
    return [];
  }

  return responseBody.data.productsGet;
};

export const productsPaginatedGet = async (
  body: {
    storeId: string;
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
  body: { id: string; storeId: string },
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
  body: { cartId?: string; storeId: string },
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

export const cartCreate = async (
  body: { storeId: string },
  headers?: HeadersInit,
): Promise<Cart> => {
  const { body: responseBody } = await backendFetch<BackendCartCreateOperation>(
    {
      query: cartCreateMutation,
      cache: "no-store",
      tags: [TAGS.CART],
      variables: body,
      headers,
    },
  );

  return responseBody.data.cartCreate.cart;
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
    storeId: string;
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
    storeId: string;
  },
  headers?: HeadersInit,
): Promise<Order | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendOrderGetByCartIdOperation>({
      query: orderGetByCartIdQuery,
      variables: body,
      tags: [TAGS.ORDER],
      headers,
    });

  return responseBody.data.orderGetByCartId;
};

export const ordersPaginatedGet = async (
  body: {
    storeId: string;
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
    storeId: string;
    cartId: string;
  },
  headers?: HeadersInit,
): Promise<Order> => {
  const { body: responseBody } =
    await backendFetch<BackendOrderCreateOperation>({
      query: orderCreateMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.ORDER],
      headers,
    });

  return responseBody.data.orderCreate.order;
};

export const orderStatusUpdate = async (
  body: {
    input: {
      storeId: string;
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
    storeId: string;
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
      storeId: string;
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
  body: {
    storeId: string;
  },
  headers?: HeadersInit,
): Promise<SalesAnalytics> => {
  const { body: responseBody } =
    await backendFetch<BackendSalesAnalyticsOperation>({
      query: salesAnalyticsGetQuery,
      tags: [TAGS.ORDER],
      cache: "no-store",
      headers,
      variables: {
        storeId: body.storeId,
      },
    });

  const {
    salesThisWeek,
    salesThisMonth,
    salesIncreaseThisWeek,
    salesIncreaseThisMonth,
  } = responseBody.data.salesAnalyticsGet;

  return {
    salesThisWeek: parseInt(salesThisWeek),
    salesThisMonth: parseInt(salesThisMonth),
    salesIncreaseThisWeek: parseInt(salesIncreaseThisWeek),
    salesIncreaseThisMonth: parseInt(salesIncreaseThisMonth),
  };
};

export const paymentMethodsList = async (
  body: {
    storeId: string;
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
    storeId: string;
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
      storeId: string;
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
      storeId: string;
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
    storeId: string;
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
      storeId: string;
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
    storeId: string;
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
    storeId: string;
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

export const storeList = async (
  body: {},
  headers?: HeadersInit,
): Promise<Store[]> => {
  const { body: responseBody } = await backendFetch<BackendStoreListOperation>({
    query: storeListQuery,
    cache: "no-store",
    tags: [TAGS.STORE],
    headers,
  });

  return responseBody.data.storeList;
};

export const storeGet = async (
  body: {
    storeId: string;
  },
  headers?: HeadersInit,
): Promise<Store | undefined> => {
  const { body: responseBody } = await backendFetch<BackendStoreGetOperation>({
    query: storeGetQuery,
    variables: body,
    cache: "no-store",
    tags: [TAGS.STORE],
    headers,
  });

  return responseBody.data.storeGet;
};

export const storeCanManage = async (
  body: {
    storeId: string;
  },
  headers?: HeadersInit,
): Promise<boolean> => {
  const { body: responseBody } =
    await backendFetch<BackendStoreCanManageOperation>({
      query: storeCanManageQuery,
      variables: body,
      cache: "no-store",
      tags: [TAGS.STORE],
      headers,
    });

  return responseBody.data.canManageStore;
};

export const storeCheckpointsGet = async (
  body: {
    storeId: string;
  },
  headers?: HeadersInit,
): Promise<StoreCheckpoints | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendStoreCheckpointsOperation>({
      query: storeCheckpointsQuery,
      variables: body,
      cache: "no-store",
      tags: [TAGS.STORE],
      headers,
    });

  return responseBody.data.storeGet;
};

export const storeConnectToTelegram = async (
  body: {
    storeId: string;
  },
  headers: HeadersInit,
): Promise<boolean> => {
  const { body: responseBody } =
    await backendFetch<BackendStoreConnectToTelegramOperation>({
      query: storeConnectToTelegramMutation,
      variables: body,
      cache: "no-store",
      tags: [TAGS.STORE],
      headers,
    });

  return responseBody.data.storeConnectToTelegram.success;
};

export const storeUpdate = async (
  body: {
    input: StoreUpdateInputType;
  },
  headers?: HeadersInit,
): Promise<Store | undefined> => {
  const { logoDark, logoLight, ...rest } = body.input;

  const formData = new FormData();
  formData.append(
    "operations",
    JSON.stringify({
      query: storeUpdateMutation,
      variables: { input: { logoDark: null, logoLight: null, ...rest } },
    }),
  );

  if (logoDark && logoLight) {
    formData.append(
      "map",
      JSON.stringify({
        0: ["variables.input.logoDark"],
        1: ["variables.input.logoLight"],
      }),
    );
    formData.append("0", logoDark);
    formData.append("1", logoLight);
  }

  const { body: responseBody } =
    await backendFetch<BackendStoreUpdateOperation>({
      cache: "no-store",
      query: storeUpdateMutation,
      tags: [TAGS.STORE],
      headers,
      formData,
    });

  return responseBody.data.storeUpdate.store;
};

export const storeApplicationCreate = async (
  body: {
    input: {
      storeName: string;
      storeDescription?: string;
      channels?: string;
      productCategory?: string;
    };
  },
  headers: HeadersInit,
): Promise<StoreApplication | undefined> => {
  const { body: responseBody } =
    await backendFetch<BackendStoreApplicationCreateOperation>({
      query: storeApplicationCreateMutation,
      variables: body,
      headers,
      tags: [TAGS.STORE],
      cache: "no-store",
    });

  return responseBody.data.storeApplicationCreate.storeApplication;
};

export const storeLogoGet = async (
  body: { storeId: string },
  headers?: HeadersInit,
): Promise<{ logoDark?: string | null; logoLight?: string | null }> => {
  const { body: responseBody } =
    await backendFetch<BackendStoreLogoGetOperation>({
      query: storeLogoGetQuery,
      variables: body,
      headers,
      cache: "no-store",
      tags: [TAGS.STORE],
    });

  return responseBody.data.storeLogoGet;
};

export const storeBotTokenGet = async (
  body: { storeId: string },
  headers?: HeadersInit,
): Promise<string | null> => {
  const { body: responseBody } =
    await backendFetch<BackendStoreBotTokenGetOperation>({
      query: storeBotTokenGetQuery,
      variables: body,
      headers,
      cache: "no-store",
      tags: [TAGS.STORE],
    });

  return responseBody.data.storeBotTokenGet;
};
