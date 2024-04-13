import {
  productDetailQuery,
  productsGetQuery,
} from "@/lib/api/queries/product";
import {
  BackendProductsGetOperation,
  Product,
  BackendProductCreateOperation,
  BackendProductUpdateOperation,
  ProductCreateInput,
  ProductUpdateInput,
  BackendProductDetailOperation,
  BackendProductDeleteOperation,
} from "@/lib/api/types";
import {
  productCreateMutation,
  productDeleteMutation,
  productUpdateMutation,
} from "@/lib/api/mutations/product";

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
