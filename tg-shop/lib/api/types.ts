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
  FAILED = "FAILED",
}

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
};

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

export type Order = {
  id: string;
  orderNumber: string;
  subtotalAmount: number;
  totalAmount: number;
  deliveryAmount: number;
  cart: Cart;
  user: TelegramUser;
  shippingDetails: ShippingDetails;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  hasDefaultShippingDetails: boolean;
};

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
