export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
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

export type BackendProductsGetOperation = {
  data: {
    productsGet: Product[];
  };
  variables: {
    state?: "ACTIVE" | "INACTIVE";
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

export type BackendCartGetOperation = {
  data: {
    cartGet: Cart;
  };
  variables: {
    cartId?: string;
  };
};

export type BackendCartCreateOperation = {
  data: {
    cartCreate: {
      cart: Cart;
    };
  };
};

export type BackendCartAddItemOperation = {
  data: {
    addToCart: {
      cart: Cart;
    };
  };
  variables: {
    input: {
      cartId: string;
      productId: string;
      variantId?: string | null;
      quantity: number;
    };
  };
};

export type BackendCartRemoveItemOperation = {
  data: {
    removeFromCart: {
      cart: Cart;
    };
  };
  variables: {
    input: {
      cartId: string;
      cartItemId: string;
      quantity: number;
    };
  };
};

export type BackendCartUpdateItemOperation = {
  data: {
    cartItemUpdate: {
      cart: Cart;
    };
  };
  variables: {
    input: {
      cartId: string;
      cartItemId: string;
      quantity: number;
    };
  };
};

export type BackendOrderGetByIdOperation = {
  data: {
    orderGetById: Order;
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
      shippingId: string;
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
      shippingId: string;
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
