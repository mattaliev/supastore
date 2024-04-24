import {
  productDetailQuery,
  productsGetQuery,
  productsPaginatedGetQuery,
} from "@/lib/api/queries/product";
import {
  BackendOrderDeleteOperation,
  BackendOrderGetByIdOperation,
  BackendOrderPaginatedGetOperation,
  BackendOrderStatusUpdateOperation,
  BackendProductCreateOperation,
  BackendProductDeleteOperation,
  BackendProductDetailOperation,
  BackendProductsGetOperation,
  BackendProductsPaginatedGetOperation,
  BackendProductUpdateOperation,
  BackendSalesAnalyticsOperation,
  BackendShippingAddTrackingOperation,
  EntityState,
  FulfilmentStatus,
  Order,
  Paginated,
  PaymentStatus,
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  SalesAnalytics,
  Shipping,
} from "@/lib/api/types";
import {
  productCreateMutation,
  productDeleteMutation,
  productUpdateMutation,
} from "@/lib/api/mutations/product";
import {
  orderGetByIdQuery,
  ordersPaginatedGetQuery,
} from "@/lib/api/queries/order";
import { salesAnalyticsGetQuery } from "@/lib/api/queries/analytics";
import {
  orderDeleteMutation,
  orderStatusUpdateMutation,
} from "@/lib/api/mutations/order";
import { shippingAddTrackingMutation } from "@/lib/api/mutations/shipping";

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : undefined;

const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/graphql/`;

export const TAGS = {
  CART: "cart",
  PRODUCT: "product",
  ORDER: "order",
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

export const orderGetById = async (
  orderId: string,
  state?: EntityState,
): Promise<Order | undefined> => {
  const { body } = await backendFetch<BackendOrderGetByIdOperation>({
    query: orderGetByIdQuery,
    variables: { orderId: orderId, state },
    tags: [TAGS.ORDER],
  });

  return body.data.orderGetById;
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

export const orderStatusUpdate = async (input: {
  orderId: string;
  paymentStatus?: PaymentStatus;
  fulfilmentStatus?: FulfilmentStatus;
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
