# Supastore

**Build and manage your online store directly in Telegram**

Supastore is a complete e-commerce platform that enables you to create, manage, and operate online stores through Telegram bots. With an intuitive admin dashboard and seamless Telegram integration, you can sell products to millions of Telegram users worldwide.

## ✨ Features

### 🛍️ **Complete E-commerce Solution**
- Product catalog management with variants, images, and categories
- Shopping cart and checkout flow
- Order management and fulfillment tracking
- Customer management and analytics
- Multi-language support (English/Russian)

### 💳 **Multiple Payment Options**
- Telegram Payments (built-in)
- Wallet Pay integration
- Cryptocurrency payments
- Bank transfer support
- Custom payment gateway integrations

### 🚀 **Admin Dashboard**
- Modern Next.js-based administration panel
- Real-time analytics and sales tracking
- Product management with drag-and-drop image uploads
- Order fulfillment and customer service tools
- Marketing automation and customer messaging

### 🤖 **Telegram Integration**
- Interactive Telegram bot for customers
- Admin bot for store management
- Support bot for customer service
- Telegram Web App integration
- Push notifications and order updates

## 🏗️ Architecture

This is a monorepo containing multiple applications:

```
supastore/
├── api-shop/          # Django GraphQL API backend
├── apps/
│   ├── admin-shop/    # Next.js admin dashboard
│   ├── tg-shop/       # Next.js Telegram Web App
│   └── docs/          # Documentation site
└── libs/
    └── shared/        # Shared TypeScript library
```

### Technology Stack

- **Backend**: Django, GraphQL, PostgreSQL, Google Cloud
- **Frontend**: Next.js, TypeScript, TailwindCSS, shadcn/ui
- **Bot Framework**: aiogram (Python Telegram Bot API)
- **Deployment**: Docker, Google Cloud Run
- **Storage**: Google Cloud Storage
- **Authentication**: Telegram Login, JWT tokens

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL
- Yarn package manager
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))

### 1. Clone and Setup

```bash
git clone https://github.com/mattaliev/supastore.git
cd supastore
yarn install
```

### 2. Environment Configuration

Copy environment files and configure:

```bash
# API Backend
cp api-shop/shop/.env.example api-shop/shop/.env

# Admin Dashboard
cp apps/admin-shop/.env.example apps/admin-shop/.env

# Telegram Web App
cp apps/tg-shop/.env.example apps/tg-shop/.env
```

See individual README files for detailed configuration instructions.

### 3. Database Setup

```bash
cd api-shop/shop
python manage.py migrate
python manage.py createsuperuser
```

### 4. Start Development Servers

```bash
# Start all services
yarn dev:admin    # Admin dashboard on http://localhost:3000
yarn dev:tg       # Telegram Web App on http://localhost:3001

# Start API backend
cd api-shop/shop
python manage.py runserver  # API on http://localhost:8000
```

### 5. Bot Configuration

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Set up your bot commands and web app
3. Configure webhook endpoints

See detailed setup instructions in [/apps/docs/](/apps/docs/).

## 📚 Documentation

- **[API Documentation](/api-shop/README.md)** - Backend setup and GraphQL schema
- **[Admin Dashboard](/apps/admin-shop/README.md)** - Admin panel setup and features
- **[Telegram Web App](/apps/tg-shop/README.md)** - Customer-facing web app
- **[Shared Library](/libs/shared/README.md)** - Common utilities and types
- **[Deployment Guide](/apps/docs/)** - Production deployment instructions

## 🛠️ Development

### Project Structure

```
supastore/
├── api-shop/shop/
│   ├── authentication/     # User auth and JWT tokens
│   ├── cart/              # Shopping cart logic
│   ├── order/             # Order management
│   ├── payment/           # Payment processing
│   ├── product/           # Product catalog
│   ├── store/             # Store configuration
│   ├── telegram/          # Bot services
│   └── user/              # User management
├── apps/admin-shop/
│   ├── app/               # Next.js app router
│   ├── components/        # Reusable UI components
│   └── lib/               # Utilities and configurations
└── apps/tg-shop/
    ├── app/               # Telegram Web App pages
    ├── components/        # Customer-facing components
    └── lib/               # Web app utilities
```

### Available Scripts

```bash
# Development
yarn dev:admin         # Start admin dashboard
yarn dev:tg           # Start Telegram web app

# Building
yarn build:admin      # Build admin dashboard
yarn build:tg        # Build Telegram web app
yarn build:lib       # Build shared library

# Code Quality
yarn lint            # Lint all projects
yarn lint:fix        # Fix linting issues
```

### Database Migrations

```bash
cd api-shop/shop
python manage.py makemigrations
python manage.py migrate
```

## 🐳 Deployment

### Docker Deployment

Each component includes a Dockerfile for containerized deployment:

```bash
# Build images
docker build -t supastore-api ./api-shop
docker build -t supastore-admin ./apps/admin-shop
docker build -t supastore-tg ./apps/tg-shop
```

### Google Cloud Deployment

The project is configured for Google Cloud Run deployment with:

- Cloud SQL for PostgreSQL
- Cloud Storage for media files
- Secret Manager for environment variables
- Cloud Build for CI/CD

See deployment guides in individual app README files.

## 🔧 Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `SECRET_KEY` | Django secret key | `your-secret-key` |
| `TELEGRAM_SHOP_TOKEN` | Main bot token | `123456:ABC-DEF...` |
| `TELEGRAM_WEB_APP_URL` | Web app URL | `https://tg.example.com` |

### Optional Integrations

- **Google Places API** - Address autocomplete
- **EdgeStore** - File upload service
- **Telegram Payments** - Built-in payments
- **Custom Payment Gateways** - External processors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all linting and tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [/apps/docs/](/apps/docs/)
- **Issues**: [GitHub Issues](https://github.com/mattaliev/supastore/issues)
- **Community**: Join our discussions

## 🌟 Acknowledgments

- Built with [Django](https://djangoproject.com/) and [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Telegram integration via [aiogram](https://aiogram.dev/)
- Deployment on [Google Cloud Platform](https://cloud.google.com/)

---

**Start building your Telegram store today with Supastore!** 🚀