# Backend container for Railway (build context = this directory, api-shop/shop).
# Set the Railway service's Root Directory to "api-shop/shop" so this Dockerfile
# is used with the correct context.

FROM python:3.11-slim

ENV APP_HOME /app
WORKDIR $APP_HOME

# Removes output stream buffering, allowing for more efficient logging
ENV PYTHONUNBUFFERED 1

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy local code to the container image.
COPY . .

# Run migrations and collect static files (served by WhiteNoise), then start
# gunicorn bound to the port provided by the platform ($PORT on Railway).
# Workers default to 1; raise on multi-core instances. Timeout 0 disables the
# worker timeout so the platform controls instance scaling.
CMD python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput && \
    exec gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 1 --threads 8 --timeout 0 shop.wsgi:application
