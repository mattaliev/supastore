import {
  cartAddItemMutation,
  cartCreateMutation,
  cartRemoveItemMutation,
  cartUpdateItemMutation,
} from "@/lib/api/mutations/cart";
import { invoiceCreateMutation } from "@/lib/api/mutations/invoice";
import { orderCreateMutation } from "@/lib/api/mutations/order";
import {
  shippingDetailsCreateMutation,
  shippingDetailsUpdateMutation,
} from "@/lib/api/mutations/shipping-details";
import { registerUserMutation } from "@/lib/api/mutations/user";
import { cartGetQuery } from "@/lib/api/queries/cart";
import { invoiceGetByOrderIdQuery } from "@/lib/api/queries/invoice";
import {
  orderGetByCartIdQuery,
  orderGetByIdQuery,
} from "@/lib/api/queries/order";
import { productsGetQuery } from "@/lib/api/queries/product";
import { profileQuery } from "@/lib/api/queries/user";
import {
  RegisterUserInput,
  BackendRegisterUserOperation,
  BackendCartAddItemOperation,
  BackendCartCreateOperation,
  BackendCartGetOperation,
  BackendCartRemoveItemOperation,
  BackendCartUpdateItemOperation,
  BackendProductsGetOperation,
  Cart,
  Product,
  TelegramUser,
  BackendOrderCreateOperation,
  Order,
  ShippingDetails,
  BackendShippingDetailsCreateOperation,
  BackendOrderGetByIdOperation,
  BackendOrderGetByCartIdOperation,
  Invoice,
  BackendInvoiceCreateOperation,
  BackendInvoiceGetByOrderIdOperation,
  BackendShippingDetailsUpdateOperation,
} from "@/lib/api/types";

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

export const productsGet = async (): Promise<Product[]> => {
  const { body } = await backendFetch<BackendProductsGetOperation>({
    query: productsGetQuery,
    tags: [TAGS.PRODUCT],
  });

  if (!body.data.productsGet) {
    return [];
  }

  return body.data.productsGet;
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

export const shippingDetailsCreate = async (
  input: ShippingDetails & {
    orderId: string;
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
    orderId: string;
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

export const invoiceCreate = async (input: {
  orderId: string;
  userId: string;
}): Promise<Invoice> => {
  console.log(input);

  const { body } = await backendFetch<BackendInvoiceCreateOperation>({
    query: invoiceCreateMutation,
    variables: {
      input,
    },
    cache: "no-store",
    tags: [TAGS.ORDER],
  });

  return body.data.invoiceCreate.invoice;
};

export const invoiceGetByOrderId = async (
  orderId: string,
): Promise<Invoice | undefined> => {
  const { body } = await backendFetch<BackendInvoiceGetByOrderIdOperation>({
    query: invoiceGetByOrderIdQuery,
    variables: {
      orderId,
    },
    cache: "no-store",
    tags: [TAGS.ORDER],
  });

  return body.data.invoiceGetByOrderId;
};
