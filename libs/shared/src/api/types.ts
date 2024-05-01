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

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
  EXPIRED = "EXPIRED",
}

export enum FulfilmentStatus {
  OPEN = "OPEN",
  PENDING = "PENDING",
  UNFULFILLED = "UNFULFILLED",
  FULFILLED = "FULFILLED",
  TRACKING = "TRACKING",
  CANCELLED = "CANCELLED",
}

export enum PaymentProvider {
  WALLET_PAY = "WALLET_PAY",
  TELEGRAM_INVOICE = "TELEGRAM_INVOICE",
  BANK_TRANSFER = "BANK_TRANSFER",
  CRYPTO_TRANSFER = "CRYPTO_TRANSFER",
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
} & BaseEntity;

export type Shipping = {
  id: string;
  details?: ShippingDetails;
  shippingAmount: string; // Decimal
  carrier?: string;
  trackingNumber?: string;
} & BaseEntity;

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
} & BaseEntity;

export type Cart = {
  id: string;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  userId?: string;
} & BaseEntity;

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  variant: CartProductVariant;
} & BaseEntity;

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
} & BaseEntity;

export type ProductVariant = {
  id: string;
  size?: string | null;
  material?: string | null;
  color?: string | null;
  quantity: number;
} & BaseEntity;

export type StrippedProductVariant = Omit<
  ProductVariant,
  "id" | "created" | "updated" | "state"
>;

type CartProductVariant = Omit<ProductVariant, "quantity">;

export type RegisterUserInput = Omit<
  TelegramUser,
  "id" | "created" | "updated" | "shippingDetails"
>;

export type Order = {
  id: string;
  orderNumber: string;
  cart: Cart;
  user?: TelegramUser;
  shipping: Shipping;
  payment?: Payment;
  fulfilmentStatus: FulfilmentStatus;
  fulfilmentDate?: string;
  hasDefaultShippingDetails: boolean;
  subtotalAmount: string;
  shippingAmount: string;
  totalAmount: string;
} & BaseEntity;

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

export type TelegramPaymentOtherInfo = {
  provider_token: string;
  paymentGateway: string;
};

export type CryptoTransferOtherInfo = {
  network: string;
  address: string;
};

export type BankTransferOtherInfo = {
  message: string;
};

export type WalletPayOtherInfo = {
  api_key: string;
  autoConversionCurrency: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  provider: PaymentProvider;
  buttonText?: string;
  otherInfo?: string;
} & BaseEntity;

export type SafePaymentMethod = Omit<PaymentMethod, "otherInfo">;

export type TelegramPaymentMethod = PaymentMethod & {
  provider: PaymentProvider.TELEGRAM_INVOICE;
  otherInfo: TelegramPaymentOtherInfo;
};

export type CryptoTransferPaymentMethod = PaymentMethod & {
  provider: PaymentProvider.CRYPTO_TRANSFER;
  otherInfo: CryptoTransferOtherInfo;
};

export type BankTransferPaymentMethod = PaymentMethod & {
  provider: PaymentProvider.BANK_TRANSFER;
  otherInfo: BankTransferOtherInfo;
};

export type WalletPayPaymentMethod = PaymentMethod & {
  provider: PaymentProvider.WALLET_PAY;
  otherInfo: WalletPayOtherInfo;
};

export type ParsedPaymentMethod = PaymentMethod & {
  otherInfo?:
    | TelegramPaymentOtherInfo
    | CryptoTransferOtherInfo
    | BankTransferOtherInfo
    | WalletPayOtherInfo;
};

export type Payment = {
  id: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotalAmount: string;
  shippingAmount: string;
  totalAmount: string;
  currency: string;
  transactionId?: string;
  paymentDate: string;
  paymentExpiry: string;
  additionalInfo?: string;
} & BaseEntity;

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

export type BackendOrderStatusUpdateOperation = {
  data: {
    orderStatusUpdate: {
      order: Order;
    };
  };
  variables: {
    input: {
      orderId: string;
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

export type BackendPaymentMethodsListOperations = {
  data: {
    paymentMethodsList: PaymentMethod[];
  };
  variables: {
    state?: EntityState;
  };
};

export type BackendPaymentMethodCreateOperation = {
  data: {
    paymentMethodCreate: {
      paymentMethod: PaymentMethod;
    };
  };
  variables: {
    input: {
      name: string;
      provider: PaymentProvider;
      buttonText?: string;
      state?: EntityState;
      otherInfo?: string;
    };
  };
};

export type BackendPaymentMethodUpdateOperation = {
  data: {
    paymentMethodUpdate: {
      paymentMethod: PaymentMethod;
    };
  };
  variables: {
    input: {
      paymentMethodId: string;
      name: string;
      provider: PaymentProvider;
      buttonText?: string;
      state?: EntityState;
      otherInfo?: string;
    };
  };
};

export type BackendPaymentMethodDeleteOperation = {
  data: {
    paymentMethodDelete: {
      success: boolean;
    };
  };
  variables: {
    paymentMethodId: string;
  };
};

export type BackendPaymentCreateOperation = {
  data: {
    paymentCreate: {
      paymentInfo: string;
      provider: PaymentProvider;
    };
  };
  variables: {
    input: {
      currency?: string;
      orderId: string;
      paymentMethodId: string;
      notifyCustomer?: boolean;
    };
  };
};

export type BackendPaymentStatusUpdateOperation = {
  data: {
    paymentStatusUpdate: {
      success: boolean;
    };
  };
  variables: {
    input: {
      paymentId: string;
      paymentStatus: PaymentStatus;
      notifyCustomer?: boolean;
    };
  };
};
