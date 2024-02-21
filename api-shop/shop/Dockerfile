# Build the file from the root of the project with the following command:
# docker build -t ditch/tg-api -f ./api-shop/Dockerfile .

# The build directory needs to be api-shop/shop, for gunicorn to work properly

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

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
# Timeout is set to 0 to disable the timeouts of the workers to allow Cloud Run to handle instance scaling.
EXPOSE 8080

CMD exec gunicorn --bind 0.0.0.0:8080 --workers 1 --threads 8 --timeout 0 shop.wsgi:application
