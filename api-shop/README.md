# Supastore API Backend

The Django GraphQL API backend for Supastore, providing all server-side functionality for the e-commerce platform.

## 🏗️ Architecture

This Django application follows a modular design with separate apps for different business domains:

```
api-shop/shop/
├── shop/                   # Django project settings
├── core/                   # Base models and utilities
├── authentication/         # JWT auth and tokens
├── user/                   # User management
├── store/                  # Store configuration
├── product/                # Product catalog
├── category/               # Product categories
├── cart/                   # Shopping cart
├── order/                  # Order management
├── payment/                # Payment processing
├── shipping/               # Shipping & delivery
├── analytics/              # Usage analytics
├── marketing/              # Email/SMS campaigns
└── telegram/               # Bot integration
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 12+
- Redis (for caching)
- Google Cloud account (for production)

### Installation

1. **Create virtual environment**
```bash
cd api-shop/shop
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database setup**
```bash
python manage.py migrate
python manage.py createsuperuser
```

5. **Start development server**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## 🔧 Environment Configuration

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/supastore

# Security
SECRET_KEY=your-django-secret-key
DEBUG=True

# Services
SERVICE_URL=http://localhost:8000
FRONTEND_CLIENT_URL=http://localhost:3001
ADMIN_CLIENT_URL=http://localhost:3000

# Telegram Integration
TELEGRAM_API_URL=https://api.telegram.org
TELEGRAM_SHOP_BOT_USERNAME=your_shop_bot
TELEGRAM_SUPPORT_BOT_USERNAME=your_support_bot
TELEGRAM_SHOP_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_SUPPORT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_WEB_APP_URL=https://tg.example.com
TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
TELEGRAM_SUPPORT_CHAT_ID=your-support-chat-id

# Payment Gateways
TELEGRAM_WALLET_API_KEY=your-wallet-pay-api-key
TELEGRAM_WALLET_PAY_URL=https://pay.wallet.tg
TELEGRAM_PAYMENT_RETURN_URL=https://tg.example.com

# Encryption
AES_SECRET_KEY=your-aes-key
AES_IV=your-aes-iv
JWT_SECRET_KEY=your-jwt-secret
```

### Google Cloud Configuration

For production deployment:

```bash
# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GS_BUCKET_NAME=your-storage-bucket
SETTINGS_NAME=api-shop-settings  # Secret Manager secret name
CLOUD_RUN_SERVICE_URL=https://your-service-cloudrun.com
```

## 📊 GraphQL API

The API uses GraphQL for all client interactions. Key features:

### Schema Overview

- **Authentication**: Login, logout, token management
- **Users**: Customer and admin user management  
- **Stores**: Multi-tenant store configuration
- **Products**: Full catalog with variants and images
- **Cart**: Shopping cart operations
- **Orders**: Order lifecycle management
- **Payments**: Multiple payment gateway support
- **Analytics**: Sales and customer insights

### GraphQL Endpoint

- **Development**: `http://localhost:8000/graphql/`
- **GraphQL Playground**: Available in DEBUG mode

### Example Queries

```graphql
# Get products
query GetProducts($storeId: ID!) {
  products(storeId: $storeId) {
    edges {
      node {
        id
        name
        description
        price
        images {
          url
        }
        variants {
          id
          sku
          price
          stock
        }
      }
    }
  }
}

# Add to cart
mutation AddToCart($productVariantId: ID!, $quantity: Int!) {
  addToCart(productVariantId: $productVariantId, quantity: $quantity) {
    success
    cart {
      items {
        id
        quantity
        productVariant {
          product {
            name
          }
        }
      }
    }
  }
}
```

## 🤖 Telegram Bot Integration

### Bot Services

The API includes Telegram bot services for:

- **Shop Bot** (`telegram/services/shop/`): Customer interaction
- **Admin Bot** (`telegram/services/admin/`): Store management  
- **Support Bot** (`telegram/services/support/`): Customer service

### Bot Features

- Product browsing and search
- Cart management via inline keyboards
- Order placement and tracking
- Customer support chat
- Admin notifications and management

### Webhook Setup

Configure Telegram webhooks:

```bash
python manage.py shell
>>> from telegram.services.core import setup_webhooks
>>> setup_webhooks()
```

## 💳 Payment Gateways

### Supported Providers

1. **Telegram Payments** - Built-in Telegram payments
2. **Wallet Pay** - Telegram Wallet integration
3. **Crypto Payments** - Cryptocurrency support
4. **Bank Transfer** - Manual bank transfers

### Adding Payment Methods

```python
# In Django admin or via GraphQL
PaymentMethod.objects.create(
    store=store,
    provider='TELEGRAM_PAYMENTS',
    name='Card Payment',
    is_active=True,
    configuration={
        'provider_token': 'your_provider_token'
    }
)
```

## 📈 Analytics & Tracking

### Event Tracking

The analytics app tracks:

- Page views and sessions
- Product views and searches  
- Cart additions/removals
- Order completions
- Customer behavior patterns

### Available Reports

- Sales analytics by period
- Product performance metrics
- Customer segmentation
- Conversion funnel analysis

## 🔒 Authentication & Security

### JWT Authentication

- Telegram-based authentication
- JWT tokens for API access
- Role-based permissions (USER/ADMIN)
- Session management

### Security Features

- CORS configuration
- CSRF protection
- SQL injection prevention
- Rate limiting (via middleware)
- Data encryption for sensitive fields

## 🧪 Testing

### Run Tests

```bash
# All tests
python manage.py test

# Specific app
python manage.py test user

# With coverage
coverage run manage.py test
coverage report
```

### Test Database

Tests use a separate test database automatically created by Django.

## 📦 Deployment

### Docker

```bash
# Build image
docker build -t supastore-api .

# Run container
docker run -p 8000:8000 -e DATABASE_URL="..." supastore-api
```

### Google Cloud Run

```bash
# Deploy using gcloud
gcloud run deploy supastore-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Environment-specific Settings

- **Development**: Uses local `.env` file
- **Production**: Uses Google Cloud Secret Manager
- **Testing**: Uses `.env.test` file

## 🔧 Management Commands

```bash
# Create sample data
python manage.py create_sample_data

# Setup Telegram webhooks  
python manage.py setup_telegram_webhooks

# Export analytics data
python manage.py export_analytics --start-date 2024-01-01

# Import categories from external source
python manage.py import_categories --source wb
```

## 📚 API Documentation

### GraphQL Schema

Generate schema documentation:

```bash
python manage.py graphql_schema --out schema.json
```

### Postman Collection

Import the Postman collection from `/docs/postman/` for testing API endpoints.

## 🐛 Debugging

### Django Debug Toolbar

Enabled in development for SQL query analysis and performance debugging.

### Logging

Configured logging levels:

- **Development**: DEBUG level to console
- **Production**: INFO level to Google Cloud Logging

### Common Issues

1. **Migration conflicts**: Reset with `python manage.py migrate --fake-initial`
2. **CORS errors**: Check `CORS_ALLOWED_ORIGINS` in settings
3. **GraphQL errors**: Enable `DEBUG=True` for detailed error messages

## 🤝 Contributing

### Code Style

- Follow PEP 8 standards
- Use type hints where possible
- Write docstrings for all functions
- Keep functions small and focused

### Adding New Apps

```bash
python manage.py startapp new_app
# Add to INSTALLED_APPS in settings.py
# Create models, schemas, services
```

### Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## 📖 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Graphene Django](https://docs.graphene-python.org/projects/django/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Google Cloud Run](https://cloud.google.com/run/docs)

---

**Need help?** Check the main [Supastore documentation](../README.md) or create an issue.