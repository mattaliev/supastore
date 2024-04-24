export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
  EXPIRED = "EXPIRED",
}

export enum FulfilmentStatus {
  UNFULFILLED = "UNFULFILLED",
  FULFILLED = "FULFILLED",
  TRACKING = "TRACKING",
  CANCELLED = "CANCELLED",
}

export enum EntityState {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type BaseEntity = {
  created: string;
  updated: string;
  state: EntityState;
};

export type Paginated<T> = {
  hasNext: boolean;
  hasPrev: boolean;
  page: number;
  pages: number;
  totalItems: number;
  objects: T[];
};

export type TelegramUser = {
  id: string;
  telegramId: number;
  username?: string;
  firstName: string;
  created: Date;
  updated: Date;
  shippingDetails?: ShippingDetails | null;
  lastName?: string | null;
  languageCode?: string | null;
  isBot?: boolean | null;
  photoUrl?: string | null;
  allowsNotifications?: boolean;
  chatId?: number;
  email?: string;
};

export type Shipping = {
  id: string;
  details?: ShippingDetails;
  shippingAmount: string; // Decimal
  carrier?: string;
  trackingNumber?: string;
};

export type ShippingDetails = {
  id: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;
  address: string;
  city?: string;
  province?: string;
  postcode: string;
  country: string;
};

export type Cart = {
  id: string;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  userId?: string;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  variant: CartProductVariant;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  sku: string;
  images?: ProductImage[] | null;
  variants?: ProductVariant[] | null;
  quantity?: number;
} & BaseEntity;

export type ProductImage = {
  id: string;
  url: string;
  order: number;
};

export type ProductVariant = {
  id: string;
  size?: string | null;
  material?: string | null;
  color?: string | null;
  quantity: number;
};

export type StrippedProductVariant = Omit<ProductVariant, "id">;

type CartProductVariant = Omit<ProductVariant, "quantity">;

export type RegisterUserInput = Omit<
  TelegramUser,
  "id" | "created" | "updated" | "shippingDetails"
>;

export type OrderItem = CartItem;

export type Order = {
  id: string;
  orderNumber: string;
  subtotalAmount: number;
  totalAmount: number;
  deliveryAmount: number;
  cart?: Cart;
  user?: TelegramUser;
  items: OrderItem[];
  shipping: Shipping;
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  hasDefaultShippingDetails: boolean;
} & BaseEntity;

export type Invoice = {
  id: string;
  telegramInvoiceId: string;
  user: TelegramUser;
  order: Order;
  currencyCode: string;
  autoCurrencyConversionCode: string;
  amount: number;
  paymentLink: string;
  directPaymentLink: string;
};

export type ProductCreateInput = {
  title: string;
  description?: string;
  price: string;
  sku?: string;
  images?: string[];
  variants?: StrippedProductVariant[];
  quantity?: number;
};

export type ProductUpdateInput = ProductCreateInput & {
  productId: string;
};

export type SalesAnalytics = {
  salesThisWeek: number;
  salesThisMonth: number;
  salesIncreaseThisWeek: number;
  salesIncreaseThisMonth: number;
};

export type BackendRegisterUserOperation = {
  data: {
    register: {
      user: TelegramUser;
      cart: Cart;
    };
  };
  variables: {
    input: RegisterUserInput;
    cartId?: string;
  };
};

export type BackendProductDetailOperation = {
  data: {
    productDetail: Product;
  };
  variables: {
    id: string;
  };
};

export type BackendProductsGetOperation = {
  data: {
    productsGet: Product[];
  };
  variables: {
    state?: EntityState;
  };
};

export type BackendProductsPaginatedGetOperation = {
  data: {
    productsPaginatedGet: Paginated<Product>;
  };
  variables: {
    state?: EntityState;
    page?: number;
    limit?: number;
  };
};

export type BackendProductCreateOperation = {
  data: {
    productCreate: {
      product: Product;
    };
  };
  variables: {
    input: ProductCreateInput;
  };
};

export type BackendProductUpdateOperation = {
  data: {
    productUpdate: {
      product: Product;
    };
  };
  variables: {
    input: ProductUpdateInput;
  };
};

export type BackendProductDeleteOperation = {
  data: {
    productDelete: {
      success: boolean;
    };
  };
  variables: {
    id: string;
  };
};

export type BackendOrderPaginatedGetOperation = {
  data: {
    ordersPaginatedGet: Paginated<Order>;
  };
  variables: {
    paymentStatus?: PaymentStatus;
    fulfilmentStatus?: FulfilmentStatus;
    state?: string;
    page?: number;
    limit?: number;
  };
};

export type BackendOrderGetByIdOperation = {
  data: {
    orderGetById?: Order;
  };
  variables: {
    orderId: string;
    state?: string;
  };
};

export type BackendOrderGetByCartIdOperation = {
  data: {
    orderGetByCartId: Order;
  };
  variables: {
    cartId: string;
    state?: string;
  };
};

export type BackendOrderCreateOperation = {
  data: {
    orderCreate: {
      order: Order;
    };
  };
  variables: {
    userId?: string;
    cartId: string;
  };
};

export type BackendShippingDetailsCreateOperation = {
  data: {
    shippingDetailsCreate: {
      shippingDetails: ShippingDetails;
    };
  };
  variables: {
    input: ShippingDetails & {
      orderId: string;
      userId?: string;
      isDefault: boolean;
    };
  };
};

export type BackendShippingDetailsUpdateOperation = {
  data: {
    shippingDetailsUpdate: {
      shippingDetails: ShippingDetails;
    };
  };
  variables: {
    input: ShippingDetails & {
      shippingDetailsId: string;
      orderId: string;
      userId?: string;
      isDefault: boolean;
    };
  };
};

export type BackendInvoiceCreateOperation = {
  data: {
    invoiceCreate: {
      invoice: Invoice;
    };
  };
  variables: {
    input: {
      userId: string;
      orderId: string;
    };
  };
};

export type BackendInvoiceGetByOrderIdOperation = {
  data: {
    invoiceGetByOrderId: Invoice;
  };
  variables: {
    orderId: string;
  };
};

export type BackendSalesAnalyticsOperation = {
  data: {
    salesAnalyticsGet: {
      salesThisWeek: string;
      salesThisMonth: string;
      salesIncreaseThisWeek: string;
      salesIncreaseThisMonth: string;
    };
  };
};

export type BackendOrderStatusUpdateOperation = {
  data: {
    orderStatusUpdate: {
      order: Order;
    };
  };
  variables: {
    input: {
      orderId: string;
      paymentStatus?: PaymentStatus;
      fulfilmentStatus?: FulfilmentStatus;
      notifyUser?: boolean;
    };
  };
};

export type BackendOrderDeleteOperation = {
  data: {
    orderDelete: {
      success: boolean;
    };
  };
  variables: {
    orderId: string;
  };
};

export type BackendShippingAddTrackingOperation = {
  data: {
    shippingAddTracking: {
      shipping: Shipping;
    };
  };
  variables: {
    input: {
      shippingId: string;
      trackingNumber: string;
      carrier: string;
    };
  };
};
