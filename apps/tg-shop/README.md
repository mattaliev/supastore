# Supastore Telegram Web App

The customer-facing Telegram Web App for Supastore, providing a seamless shopping experience within Telegram. Built with Next.js, TypeScript, and optimized for mobile use.

## 🛍️ Features

### 🛒 **Shopping Experience**
- Product catalog browsing with search and filters
- Product detail pages with variants and images
- Shopping cart management
- Wishlist and favorites functionality
- Mobile-optimized responsive design

### 💳 **Checkout & Payments**
- Streamlined checkout process
- Multiple payment method support
- Address autocomplete with Google Places API
- Contact information management
- Order confirmation and tracking

### 📱 **Telegram Integration**
- Native Telegram Web App experience
- Telegram authentication
- Seamless bot integration
- Push notifications via Telegram
- Deep linking and sharing

### 🌍 **Localization**
- Multi-language support (English/Russian)
- Currency and region-specific formatting
- Localized content and messaging

### 🔒 **Security & Privacy**
- Secure Telegram authentication
- Privacy policy and terms of service
- GDPR compliance features
- Secure payment processing

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Custom components with shadcn/ui base
- **Authentication**: Telegram Web App authentication
- **API**: GraphQL client
- **Maps**: Google Places API integration
- **Internationalization**: next-intl
- **State Management**: React Context + localStorage
- **Forms**: React Hook Form with Zod validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- Running Supastore API backend
- Telegram Bot with Web App configured

### Installation

1. **Navigate to tg-shop directory**
```bash
cd apps/tg-shop
```

2. **Install dependencies**
```bash
yarn install
```

3. **Environment setup**
```bash
cp .env.example .env.local
# Configure your environment variables
```

4. **Start development server**
```bash
yarn dev
```

The web app will be available at `http://localhost:3001`

### Telegram Web App Setup

1. Configure your bot with [@BotFather](https://t.me/botfather)
2. Set up Web App URL: `/setmenubutton` → Web App → `https://your-domain.com`
3. Test in Telegram by clicking the menu button

## 🔧 Environment Configuration

### Required Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google Services (Optional)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

### Production Configuration

```bash
# Production API
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Web App URL (configured in bot settings)
# https://your-webapp-domain.com
```

## 🏗️ Project Structure

```
apps/tg-shop/
├── app/                        # Next.js App Router
│   ├── [locale]/              # Internationalized routes
│   │   ├── layout.tsx         # Root layout
│   │   └── store/             # Store-specific routes
│   │       └── [storeId]/     # Dynamic store routes
│   │           ├── (app)/     # Main app pages
│   │           │   ├── page.tsx      # Product catalog
│   │           │   └── cart/         # Shopping cart
│   │           ├── contact-info/     # Contact management
│   │           ├── shipping/         # Shipping details
│   │           └── error.tsx         # Error boundaries
│   └── api/                   # API routes
│       └── auth/              # Authentication
├── components/                # Reusable components
│   ├── apps/                 # Third-party integrations
│   │   └── google-maps/      # Google Maps components
│   ├── auth/                 # Authentication components
│   ├── cart/                 # Shopping cart components
│   ├── checkout/             # Checkout flow components
│   ├── product/              # Product display components
│   ├── store/                # Store context and utilities
│   ├── telegram/             # Telegram-specific components
│   └── ui/                   # Base UI components
├── lib/                      # Utilities and configurations
├── public/                   # Static assets
└── middleware.ts             # Next.js middleware
```

## 📱 Telegram Web App Integration

### Authentication

Uses Telegram Web App authentication:

```typescript
// components/auth/AuthProvider.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      
      // Get user data from Telegram
      const initData = tg.initDataUnsafe;
      if (initData.user) {
        setUser(initData.user);
      }
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Telegram Web App Features

```typescript
// Using Telegram Web App API
useEffect(() => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    // Configure app appearance
    tg.setHeaderColor('#ffffff');
    tg.setBackgroundColor('#f8f9fa');
    
    // Show/hide back button
    tg.BackButton.show();
    tg.BackButton.onClick(() => router.back());
    
    // Main button for actions
    tg.MainButton.setText('Add to Cart');
    tg.MainButton.show();
    tg.MainButton.onClick(handleAddToCart);
  }
}, []);
```

## 🛒 Shopping Flow

### Product Catalog

```typescript
// Product listing with filters and search
export default function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { data: products } = useQuery({
    queryKey: ['products', storeId, searchQuery, selectedCategory],
    queryFn: () => getProducts({ 
      storeId, 
      search: searchQuery,
      categoryId: selectedCategory 
    }),
  });
  
  return (
    <div className="space-y-4">
      <SearchBar onSearch={setSearchQuery} />
      <CategoryFilter onSelect={setSelectedCategory} />
      <ProductGrid products={products} />
    </div>
  );
}
```

### Shopping Cart

```typescript
// Cart management with persistence
export function useCart() {
  const [cart, setCart] = useLocalStorage('cart', []);
  
  const addToCart = (productVariant: ProductVariant, quantity: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.variantId === productVariant.id);
      if (existingItem) {
        return prev.map(item =>
          item.variantId === productVariant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { variantId: productVariant.id, quantity, productVariant }];
    });
  };
  
  return { cart, addToCart, removeFromCart, updateQuantity };
}
```

### Checkout Process

1. **Cart Review**: Review items and quantities
2. **Contact Info**: Customer contact details
3. **Shipping Address**: Delivery address with Google Places autocomplete
4. **Payment Method**: Select from available payment options
5. **Order Confirmation**: Complete purchase and show confirmation

## 🌍 Internationalization

Configured with next-intl for multiple languages:

```typescript
// components/i18n/i18n.ts
export const locales = ['en', 'ru'] as const;
export const defaultLocale = 'en';

// Usage in components
import { useTranslations } from 'next-intl';

export default function ProductCard({ product }) {
  const t = useTranslations('products');
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{t('price')}: {product.price}</p>
      <button>{t('addToCart')}</button>
    </div>
  );
}
```

### Adding Translations

Update files in `components/i18n/locales/`:

- `en.json` - English translations
- `ru.json` - Russian translations

## 🎨 UI Components

### Custom Components

- **ProductCard**: Product display with images and variants
- **CartIcon**: Animated cart with item count
- **CheckoutForm**: Multi-step checkout process
- **AddressAutocomplete**: Google Places integration
- **PaymentMethods**: Payment option selection

### Responsive Design

Optimized for mobile-first experience:

```css
/* TailwindCSS responsive classes */
<div className="
  grid grid-cols-1 gap-4 
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4
">
```

## 📦 State Management

### Context Providers

```typescript
// app/[locale]/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <StoreProvider>
            <CartProvider>
              <TelegramProvider>
                {children}
              </TelegramProvider>
            </CartProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Local Storage

Persist cart and preferences:

```typescript
// lib/hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };
  
  return [storedValue, setValue] as const;
}
```

## 🧪 Development

### Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn lint:fix     # Fix linting issues
yarn type-check   # Run TypeScript checks
```

### Development Workflow

1. **Component Development**: Create components in `/components`
2. **Page Routes**: Add pages in `/app/[locale]/store/[storeId]`
3. **API Integration**: Use React Query for data fetching
4. **Styling**: Use TailwindCSS utilities
5. **Testing**: Test in Telegram Web App environment

### Telegram Web App Testing

1. **ngrok**: Expose localhost for testing
```bash
ngrok http 3001
# Use HTTPS URL in bot configuration
```

2. **Telegram Desktop**: Use Web App inspector for debugging

3. **Mobile Testing**: Test on actual mobile devices in Telegram

## 📦 Build & Deployment

### Production Build

```bash
yarn build
yarn start
```

### Docker Deployment

```bash
# Build image
docker build -t supastore-tg-shop .

# Run container
docker run -p 3001:3000 supastore-tg-shop
```

### Environment Variables

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 🔧 Google Integration

### Places API Setup

For address autocomplete:

```typescript
// components/apps/google-maps/PlacesAutocomplete.tsx
export function PlacesAutocomplete({ onPlaceSelected }) {
  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
    onPlaceSelected: (places) => onPlaceSelected(places),
    options: {
      types: ['address'],
      componentRestrictions: { country: 'us' }
    }
  });
  
  return <input ref={ref} placeholder="Enter address..." />;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Telegram Web App not loading**
   - Check HTTPS configuration
   - Verify bot web app URL
   - Ensure domain is accessible

2. **Authentication issues**
   - Check Telegram Web App initialization
   - Verify API backend connection
   - Check browser console for errors

3. **API connection problems**
   - Confirm NEXT_PUBLIC_API_URL
   - Check CORS settings on backend
   - Verify network connectivity

4. **Build/deployment issues**
   - Check environment variables
   - Verify all dependencies installed
   - Check TypeScript compilation

### Debug Mode

```bash
DEBUG=1 yarn dev
```

### Telegram Web App Debugging

Use Telegram Desktop or Web with developer tools enabled to inspect the Web App.

## 📚 Additional Resources

- [Telegram Web Apps Documentation](https://core.telegram.org/bots/webapps)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)

## 🤝 Contributing

1. Follow mobile-first design principles
2. Test thoroughly in Telegram environment
3. Ensure accessibility compliance
4. Add proper error handling
5. Update translations for new features

---

**Shop seamlessly in Telegram!** 🛍️

For more information, check the [main Supastore documentation](../../README.md).