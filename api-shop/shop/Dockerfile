# Backend container, built from the repository ROOT context (Railway uploads the
# whole repo and selects this file via railway.json -> build.dockerfilePath).
# Local equivalent: docker build -f api-shop/shop/Dockerfile -t supastore-api .

FROM python:3.11-slim

ENV APP_HOME /app
WORKDIR $APP_HOME

# Removes output stream buffering, allowing for more efficient logging
ENV PYTHONUNBUFFERED 1

# Install dependencies (paths are relative to the repo root build context)
COPY api-shop/shop/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend application code into the image.
COPY api-shop/shop/ .

# Run migrations and collect static files (served by WhiteNoise), then start
# gunicorn bound to the port provided by the platform ($PORT on Railway).
# Workers default to 1; raise on multi-core instances. Timeout 0 disables the
# worker timeout so the platform controls instance scaling.
CMD python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput && \
    exec gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 1 --threads 8 --timeout 0 shop.wsgi:application
