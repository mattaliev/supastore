# Supastore Admin Dashboard

A modern Next.js admin dashboard for managing your Telegram-based online stores. Built with TypeScript, TailwindCSS, and shadcn/ui components.

## 🚀 Features

### 🏪 **Store Management**
- Multi-store support and configuration
- Store branding and customization
- Telegram bot integration setup
- Support bot configuration

### 📦 **Product Management**
- Product catalog with variants and images
- Drag-and-drop image uploads via EdgeStore
- Category management and characteristics
- Inventory tracking and stock management
- Bulk product operations

### 📊 **Order Management**
- Order fulfillment workflow
- Payment tracking and processing
- Shipping label generation
- Customer communication tools
- Order analytics and reporting

### 👥 **Customer Management**
- Customer profiles and history
- Order history and analytics
- Customer segmentation
- Communication preferences

### 💳 **Payment Systems**
- Multiple payment gateway integration
- Payment method configuration
- Transaction monitoring
- Revenue analytics

### 📈 **Analytics & Reports**
- Sales analytics and trends
- Customer behavior insights
- Product performance metrics
- Revenue tracking and forecasting

### 🎯 **Marketing Tools**
- Manual mailing campaigns
- Customer segmentation
- Marketing automation
- Campaign analytics

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js with Telegram Login
- **API**: GraphQL with Apollo Client
- **File Upload**: EdgeStore
- **Internationalization**: next-intl (English/Russian)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- Running Supastore API backend
- Telegram Bot Token

### Installation

1. **Navigate to admin directory**
```bash
cd apps/admin-shop
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

The admin dashboard will be available at `http://localhost:3000`

## 🔧 Environment Configuration

### Required Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# File Upload
EDGE_STORE_ACCESS_KEY=your-edgestore-access-key
EDGE_STORE_SECRET_KEY=your-edgestore-secret-key

# Telegram Integration
NEXT_PUBLIC_BOT_USERNAME=your_admin_bot_username
```

### Optional Variables

```bash
# Google Services
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-google-places-api-key

# Production URLs
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXTAUTH_URL=https://your-admin-domain.com
```

## 🏗️ Project Structure

```
apps/admin-shop/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Landing page
│   │   └── store/         # Store management routes
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth configuration
│   │   └── edgestore/     # File upload endpoints
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── customer/         # Customer management
│   ├── order/            # Order management
│   ├── payment/          # Payment configuration
│   ├── product/          # Product management
│   ├── store/            # Store configuration
│   ├── marketing/        # Marketing tools
│   ├── analytics/        # Analytics components
│   └── ui/               # Base UI components
├── lib/                  # Utilities and configurations
├── middleware.ts         # Next.js middleware
└── public/               # Static assets
```

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:

- **Forms**: Input, Select, Textarea, Checkbox, Radio
- **Navigation**: Breadcrumb, Pagination, Tabs
- **Feedback**: Dialog, Drawer, Toast, Badge
- **Layout**: Card, Separator, ScrollArea
- **Data Display**: Table, Timeline, Avatar

### Custom Components

- **MultiFileSortableUpload**: Drag-and-drop image management
- **ProductFormFields**: Comprehensive product editing
- **OrderManagement**: Order workflow components
- **Analytics**: Charts and metrics visualization

## 🔐 Authentication

### Telegram Login Integration

Users authenticate via Telegram Login Widget:

```typescript
// Auth configuration in auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "telegram",
      name: "telegram",
      async authorize(credentials, req) {
        const authResponse = await signInAdmin({
          dataCheckString: new URLSearchParams(req.query).toString(),
        });
        // Handle authentication response
      },
    }),
  ],
  // Additional configuration...
}
```

### Role-based Access

- **Store Owners**: Full access to their stores
- **Admins**: System-wide administrative access
- **Staff**: Limited store management access

## 📊 State Management

### React Query Integration

API calls are managed through React Query for efficient caching and synchronization:

```typescript
// Example: Product queries
const { data: products, isLoading } = useQuery({
  queryKey: ['products', storeId],
  queryFn: () => getProducts({ storeId }),
});

// Example: Product mutations
const createProductMutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries(['products']);
  },
});
```

### Form State

Forms use React Hook Form with Zod validation:

```typescript
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
});
```

## 🌍 Internationalization

Supports English and Russian with next-intl:

```typescript
// Usage in components
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('common');
  
  return (
    <h1>{t('welcome')}</h1>
  );
}
```

### Adding Translations

Update translation files in `components/i18n/locales/`:

- `en.json` - English translations
- `ru.json` - Russian translations

## 🚀 Key Features Walkthrough

### Store Setup

1. **Create Store**: Name, description, timezone configuration
2. **Bot Integration**: Connect Telegram bot tokens
3. **Payment Setup**: Configure payment gateways
4. **Customization**: Upload logos, set branding

### Product Management

1. **Product Creation**: Name, description, pricing
2. **Variants**: Size, color, material options
3. **Images**: Drag-and-drop upload with sorting
4. **Categories**: Organize with characteristics
5. **Inventory**: Stock tracking and alerts

### Order Processing

1. **Order Tracking**: Real-time order status updates
2. **Fulfillment**: Mark items as fulfilled
3. **Payment Processing**: Handle payment confirmations
4. **Customer Communication**: Order updates via Telegram

### Analytics Dashboard

1. **Sales Metrics**: Revenue, orders, conversion rates
2. **Customer Insights**: Top customers, behavior analysis
3. **Product Performance**: Best sellers, inventory turnover
4. **Timeline View**: Activity feed and notifications

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

### Code Style

- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for code quality

### Adding New Features

1. **Create Components**: Follow existing patterns
2. **API Integration**: Use React Query hooks
3. **Form Handling**: Use React Hook Form + Zod
4. **Styling**: Use TailwindCSS utilities
5. **Translations**: Add to both language files

## 📦 Build & Deployment

### Production Build

```bash
yarn build
```

### Docker Deployment

```bash
# Build image
docker build -t supastore-admin .

# Run container
docker run -p 3000:3000 supastore-admin
```

### Environment Variables for Production

```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXTAUTH_URL=https://your-admin-domain.com
NEXTAUTH_SECRET=your-production-secret
```

## 🔧 Configuration

### EdgeStore Setup

Configure file upload service:

```typescript
// lib/edgestore/index.ts
export const edgestore = new EdgeStoreProvider({
  accessKey: process.env.EDGE_STORE_ACCESS_KEY,
  secretKey: process.env.EDGE_STORE_SECRET_KEY,
});
```

### API Client Setup

GraphQL client configuration:

```typescript
// Configured in shared library
import { apiClient } from '@supastore/lib';

// Usage in components
const { data } = await apiClient.products.getAll({ storeId });
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check NEXTAUTH_SECRET and NEXTAUTH_URL
   - Verify API backend is running
   - Confirm Telegram bot configuration

2. **File Upload Issues**
   - Verify EdgeStore credentials
   - Check file size limits
   - Ensure proper CORS configuration

3. **API Connection Problems**
   - Confirm NEXT_PUBLIC_API_URL is correct
   - Check API backend health
   - Verify CORS settings on backend

4. **Build Errors**
   - Run `yarn lint` and fix issues
   - Check TypeScript errors with `yarn type-check`
   - Ensure all environment variables are set

### Debug Mode

Enable debug logging:

```bash
DEBUG=1 yarn dev
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [React Query](https://tanstack.com/query/latest)

## 🤝 Contributing

1. Follow existing component patterns
2. Add proper TypeScript types
3. Include translations for both languages
4. Test forms with various data scenarios
5. Ensure responsive design works on all devices

---

**Ready to manage your Telegram stores!** 🚀

For more information, check the [main Supastore documentation](../../README.md).