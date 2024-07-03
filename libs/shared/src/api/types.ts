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

export enum EventType {
  PAGE_VIEWED = "PAGE_VIEWED",
  USER_REGISTERED = "USER_REGISTERED",
  USER_VISITED = "USER_VISITED",
  ADDED_TO_CART = "ADDED_TO_CART",
  REMOVED_FROM_CART = "REMOVED_FROM_CART",
  CHECKOUT_STARTED = "CHECKOUT_STARTED",
  PAYMENT_STARTED = "PAYMENT_STARTED",
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
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

export type TelegramUserDetail = {
  lastVisit: string;
  amountSpent: string;
  orders: Order[];
  orderCount: number;
  completedPaymentCount: number;
  cartCount: number;
  totalCartAmount: string;
  addedToCartCount: number;
  favoriteProducts: ProductVariant[];
  events: UnparsedAnalyticsEvent[];
} & TelegramUser;

export type TelegramUserDetailParsed = TelegramUserDetail & {
  events: AnalyticsEvent[];
};

export type TelegramUserList = {
  lastVisit: string;
  orderCount: number;
  amountSpent: number;
  isNew: boolean;
  totalVisitCount: number;
} & TelegramUser;

export type TelegramUserTopList = {
  amountSpent: string;
  totalVisitCount: number;
} & TelegramUser;

export type Shipping = {
  id: string;
  contactInfo: ContactInformation;
  shippingAddress: ShippingAddress;
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

export type ShippingAddress = {
  id: string;
  address: string;
  additionalInfo?: string;
} & BaseEntity;

export type ContactInformation = {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  productVariant: ProductVariant;
  quantity: number;
  size: ProductVariantSize;
} & BaseEntity;

export type Category = {
  id: string;
  nameEn: string;
  nameRu: string;
  wbId: number;
  parent?: Category | null;
  children?: Category[] | null;
} & BaseEntity;

export type Characteristic = {
  id: string;
  nameEn: string;
  nameRu: string;
  wbId: number;
  required: boolean;
  type: CharacteristicType;
  maxCount: number;
  unitNameEn?: string | null;
  unitNameRu?: string | null;
} & BaseEntity;

export enum CharacteristicType {
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  ARRAY_STRING = "ARRAY_STRING",
  ARRAY_NUMBER = "ARRAY_NUMBER",
}

export type CategoryCharacteristic = {
  id: string;
  category: Category;
  characteristic: Characteristic;
} & BaseEntity;

export type Product = {
  id: string;
  category: Category;
  store: Store;
  variants: ProductVariant[];
} & BaseEntity;

export type ProductVariant = {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  brand?: string;
  sku?: string;
  wbId?: number;
  sizes: ProductVariantSize[];
  product: {
    id: string;
    category: Category;
    variants: {
      id: string;
      name: string;
      images: string[];
    }[];
  };
  images: string[];
  productCharacteristics: ProductVariantCharacteristic[];
} & BaseEntity;

export type ProductVariantSize = {
  id: string;
  sizeEn?: string;
  sizeRu?: string;
  price: string;
  discountPrice?: string;
} & BaseEntity;

export type ProductVariantImage = {
  id: string;
  url: string;
  order: number;
} & BaseEntity;

export type ProductVariantCharacteristic = {
  id: string;
  variant: ProductVariant;
  characteristic: Characteristic;
  value: string[];
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
  storeId: string;
  categoryId: string;
  variants: ProductVariantInput[];
};

export type ProductVariantInput = {
  name: string;
  shortDescription?: string;
  description?: string;
  brand?: string;
  sku?: string;
  wbId?: number;
  sizes: ProductVariantSizeInput[];
  images: string[];
  characteristics: ProductVariantCharacteristicInput[];
};

export type ProductVariantUpdateInput = Omit<ProductVariantInput, "sizes"> & {
  productVariantId?: string;
};

export type ProductVariantSizeInput = {
  sizeEn?: string;
  sizeRu?: string;
  price: string;
  discountPrice?: string;
};

export type ProductVariantSizeUpdateInput = ProductVariantSizeInput & {
  productVariantSizeId?: string;
};

export type ProductVariantCharacteristicInput = {
  characteristicId: string;
  value: string;
};

export type ProductUpdateInput = Omit<ProductCreateInput, "variants"> & {
  productId: string;
  variants: ProductVariantUpdateInput[];
};

export type AnalyticsEvent =
  | PageViewedEvent
  | UserRegisteredEvent
  | UserVisitedEvent
  | AddedToCartEvent
  | RemovedFromCartEvent
  | CheckoutStartedEvent
  | PaymentStartedEvent
  | PaymentCompletedEvent;

export type UnparsedAnalyticsEvent = {
  id: string;
  user: TelegramUser;
  eventType: EventType;
  eventData?: string;
} & BaseEntity;

export type PageViewedEvent = UnparsedAnalyticsEvent & {
  eventType: EventType.PAGE_VIEWED;
  eventData: {
    page: string;
  };
};

export type UserRegisteredEvent = UnparsedAnalyticsEvent & {
  eventType: EventType.USER_REGISTERED;
  eventData: undefined;
};

export type UserVisitedEvent = UnparsedAnalyticsEvent & {
  eventType: EventType.USER_VISITED;
  eventData: undefined;
};

export type AddedToCartEvent = UnparsedAnalyticsEvent & {
  eventType: EventType.ADDED_TO_CART;
  eventData: {
    product_id: string;
    cart_id: string;
    cart_total: number;
    quantity: number;
    product_name: string;
  };
};

export type RemovedFromCartEvent = UnparsedAnalyticsEvent & {
  eventType: EventType.REMOVED_FROM_CART;
  eventData: {
    product_id: string;
    cart_id: string;
    cart_total: number;
    product_name: string;
  };
};

export type CheckoutStartedEvent = UnparsedAnalyticsEvent & {
  eventType: EventType.CHECKOUT_STARTED;
  eventData: {
    cart_id: string;
    cart_total: string;
    order_id: string;
    order_number: number;
  };
};

export type PaymentStartedEvent = UnparsedAnalyticsEvent & {
  eventType: EventType.PAYMENT_STARTED;
  eventData: {
    order_id: string;
    order_number: string;
    payment_id: string;
    payment_method_id: string;
    payment_method_name: string;
    payment_amount: string;
  };
};

export type PaymentCompletedEvent = UnparsedAnalyticsEvent & {
  eventType: EventType.PAYMENT_COMPLETED;
  eventData: {
    order_id: string;
    order_number: string;
    payment_id: string;
    payment_method_id: string;
    payment_method_name: string;
    payment_amount: string;
  };
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

export type Store = {
  id: string;
  storeName: string;
  storeDescription?: string;
  storeTimezone: string;
  logoDark?: string;
  logoLight?: string;
  botUsername?: string;
  storeUrl: string;
  owner: TelegramUser;
  admins: TelegramUser[];
  isConnectedToTelegram: boolean;
} & BaseEntity;

export type StoreCheckpoints = {
  hasProducts: boolean;
  isConnectedToTelegram: boolean;
  hasBotToken: boolean;
  hasConnectedPaymentSystem: boolean;
  isDone: boolean;
};

export type StoreApplication = {
  storeName: string;
  storeDescription?: string;
  channels?: string;
  productCategory?: string;
} & BaseEntity;

export type StoreCreateInputType = {
  storeName: string;
  storeDescription?: string;
  logoDark?: File;
  logoLight?: File;
  botUsername?: string;
  botToken?: string;
};

export type StoreUpdateInputType = {
  storeId: string;
  storeName?: string | null;
  storeDescription?: string | null;
  logoDark?: File | null;
  logoLight?: File | null;
  botUsername?: string | null;
  botToken?: string | null;
};

export type SessionAnalyticsByHour = {
  sessionCount: number;
  sessionIncreasePercentage: number;
  sessions: {
    hour: string;
    sessions: number;
  }[];
};

export type BackendSignInShopUserOperation = {
  data: {
    signInShopUser: {
      user: TelegramUser;
    };
  };
  variables: {
    storeId: string;
    initDataRaw: string;
  };
};

export type BackendProductDetailOperation = {
  data: {
    productDetail: ProductVariant;
  };
  variables: {
    id: string;
  };
};

export type BackendAdminProductGetOperation = {
  data: {
    adminProductGet: Product;
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
    storeId: string;
    state?: EntityState;
  };
};

export type BackendProductsPaginatedGetOperation = {
  data: {
    productsPaginatedGet: Paginated<ProductVariant>;
  };
  variables: {
    storeId: string;
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
    storeId: string;
    id: string;
  };
};

export type BackendProductVariantDeleteOperation = {
  data: {
    productVariantDelete: {
      success: boolean;
    };
  };
  variables: {
    storeId: string;
    id: string;
  };
};

export type BackendCartGetOperation = {
  data: {
    cartGet: Cart;
  };
  variables: {
    cartId: string;
    storeId: string;
  };
};

export type BackendCartGetByUserIdOperation = {
  data: {
    cartGetByUserId: Cart;
  };
  variables: {
    storeId: string;
  };
};

export type BackendCartCreateOperation = {
  data: {
    cartCreate: {
      cart: Cart;
    };
  };
  variables: {
    storeId: string;
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
      productVariantId: string;
      productVariantSizeId: string;
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
    storeId: string;
    orderId: string;
    state?: string;
  };
};

export type BackendOrderPaginatedGetOperation = {
  data: {
    ordersPaginatedGet: Paginated<Order>;
  };
  variables: {
    storeId: string;
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
    storeId: string;
    cartId: string;
    state?: string;
  };
};

export type BackendOrderCreateOperation = {
  data: {
    orderCreate: {
      order: Order;
      paymentProvider: PaymentProvider;
      paymentInfo: string;
    };
  };
  variables: {
    storeId: string;
    cartId: string;
    paymentMethodId: string;
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
      storeId: string;
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
    storeId: string;
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
      storeId: string;
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
  variables: {
    storeId: string;
  };
};

export type BackendShopPaymentMethodsListOperation = {
  data: {
    shopPaymentMethodsList: SafePaymentMethod[];
  };
  variables: {
    storeId: string;
    state?: EntityState;
  };
};

export type BackendPaymentMethodsListOperations = {
  data: {
    paymentMethodsList: PaymentMethod[];
  };
  variables: {
    storeId: string;
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
      storeId: string;
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
      storeId: string;
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
    storeId: string;
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
      storeId: string;
      paymentId: string;
      paymentStatus: PaymentStatus;
      notifyCustomer?: boolean;
    };
  };
};

export type BackendCustomerDetailOperation = {
  data: {
    customerDetail: TelegramUserDetail;
  };
  variables: {
    storeId: string;
    userId: string;
  };
};

export type BackendCustomersPaginatedGetOperation = {
  data: {
    customersPaginated: Paginated<TelegramUserList>;
  };
  variables: {
    storeId: string;
    page?: number;
    limit?: number;
    sortBy?: "TOTAL_SALES" | "TOTAL_VISITS";
  };
};

export type BackendCustomersTopOperation = {
  data: {
    customersTop: Paginated<TelegramUserTopList>;
  };
  variables: {
    page?: number;
    limit?: number;
    sortBy?: "TOTAL_SALES" | "TOTAL_VISITS";
  };
};

export type BackendSignInAdminOperation = {
  data: {
    signInAdmin: {
      user: TelegramUser;
      accessToken: string;
    };
  };
  variables: {
    dataCheckString: string;
  };
};

export type BackendSignOutAdminOperation = {
  data: {
    signOutAdmin: {
      success: boolean;
    };
  };
  variables: {
    token: string;
  };
};

export type BackendStoreListOperation = {
  data: {
    storeList: Store[];
  };
};

export type BackendStoreGetOperation = {
  data: {
    storeGet: Store;
  };
  variables: {
    storeId: string;
  };
};

export type BackendStoreCanManageOperation = {
  data: {
    canManageStore: boolean;
  };
  variables: {
    storeId: string;
  };
};

export type BackendStoreCheckpointsOperation = {
  data: {
    storeGet: StoreCheckpoints;
  };
  variables: {
    storeId: string;
  };
};

export type BackendStoreCreateOperation = {
  data: {
    storeCreate: {
      store: Store;
    };
  };
  variables: {
    input: StoreCreateInputType;
  };
};

export type BackendStoreUpdateOperation = {
  data: {
    storeUpdate: {
      store: Store;
    };
  };
  variables: {
    input: StoreUpdateInputType;
  };
};

export type BackendStoreConnectToTelegramOperation = {
  data: {
    storeConnectToTelegram: {
      success: boolean;
    };
  };
  variables: {
    storeId: string;
  };
};

export type BackendStoreApplicationCreateOperation = {
  data: {
    storeApplicationCreate: {
      storeApplication: StoreApplication;
    };
  };
  variables: {
    input: Omit<StoreApplication, "id" | "created" | "updated" | "state">;
  };
};

export type BackendStoreLogoGetOperation = {
  data: {
    storeLogoGet: {
      logoDark: string;
      logoLight: string;
    };
  };
  variables: {
    storeId: string;
  };
};

export type BackendStoreBotTokenGetOperation = {
  data: {
    storeBotTokenGet: string;
  };
  variables: {
    storeId: string;
  };
};

export type BackendStoreBotUsernameGetOperation = {
  data: {
    storeBotUsernameGet: string;
  };
  variables: {
    storeId: string;
  };
};

export type BackendSessionAnalyticsByHourGetOperation = {
  data: {
    sessionAnalyticsByHourGet: SessionAnalyticsByHour;
  };
  variables: {
    storeId: string;
    date?: string;
  };
};

export type BackendShippingAddressListGetOperation = {
  data: {
    shippingAddressListGet: ShippingAddress[];
  };
  variables: {
    storeId: string;
  };
};

export type BackendShippingAddressDefaultGetOperation = {
  data: {
    shippingAddressDefaultGet: ShippingAddress;
  };
  variables: {
    storeId: string;
  };
};

export type BackendShippingAddressCreateOperation = {
  data: {
    shippingAddressCreate: {
      shippingAddress: ShippingAddress;
    };
  };
  variables: {
    input: {
      storeId: string;
      address: string;
      additionalInfo?: string;
    };
  };
};

export type BackendShippingAddressDefaultSetOperation = {
  data: {
    shippingAddressDefaultSet: {
      shippingAddress: ShippingAddress;
    };
  };
  variables: {
    storeId: string;
    shippingAddressId: string;
  };
};

export type BackendShippingAddressDeleteOperation = {
  data: {
    shippingAddressDelete: {
      success: boolean;
    };
  };
  variables: {
    shippingAddressId: string;
  };
};

export type BackendContactInformationListGetOperation = {
  data: {
    contactInformationListGet: ContactInformation[];
  };
  variables: {
    storeId: string;
  };
};

export type BackendContactInformationDefaultGetOperation = {
  data: {
    contactInformationDefaultGet: ContactInformation;
  };
  variables: {
    storeId: string;
  };
};

export type BackendContactInformationCreateOperation = {
  data: {
    contactInformationCreate: {
      contactInformation: ContactInformation;
    };
  };
  variables: {
    input: {
      storeId: string;
      name: string;
      email: string;
      phone: string;
    };
  };
};

export type BackendContactInformationDefaultSetOperation = {
  data: {
    contactInformationDefaultSet: {
      contactInformation: ContactInformation;
    };
  };
  variables: {
    storeId: string;
    contactInformationId: string;
  };
};

export type BackendContactInformationDeleteOperation = {
  data: {
    contactInformationDelete: {
      success: boolean;
    };
  };
  variables: {
    contactInformationId: string;
  };
};

export type BackendOrderCanCreateOperation = {
  data: {
    orderCanCreate: boolean;
  };
  variables: {
    storeId: string;
    cartId: string;
  };
};

export type BackendCategoriesGetOperation = {
  data: {
    categoriesGet: {
      parentCategories: {
        id: string;
        nameEn: string;
        nameRu: string;
      }[];
      subcategories: {
        id: string;
        nameEn: string;
        nameRu: string;
      }[];
    };
  };
  variables: {
    parentId?: string;
    locale?: string;
    search?: string;
  };
};

export type BackendCategoryCharacteristicsGetOperation = {
  data: {
    categoryCharacteristicsGet: Characteristic[];
  };
  variables: {
    categoryId?: string;
  };
};

export type BackendProductVariantsOrderSetOperation = {
  data: {
    productVariantsOrderSet: {
      success: boolean;
    };
  };
  variables: {
    productIds: string[];
    storeId: string;
  };
};
