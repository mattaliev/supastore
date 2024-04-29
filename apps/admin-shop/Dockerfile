ARG NEXT_PUBLIC_API_URL
ARG EDGE_STORE_ACCESS_KEY
ARG EDGE_STORE_SECRET_KEY

FROM node:21-alpine AS base

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV EDGE_STORE_ACCESS_KEY=$EDGE_STORE_ACCESS_KEY
ENV EDGE_STORE_SECRET_KEY=$EDGE_STORE_SECRET_KEY

FROM base AS deps

ARG NEXT_PUBLIC_API_URL
ARG EDGE_STORE_ACCESS_KEY
ARG EDGE_STORE_SECRET_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV EDGE_STORE_ACCESS_KEY=$EDGE_STORE_ACCESS_KEY
ENV EDGE_STORE_SECRET_KEY=$EDGE_STORE_SECRET_KEY

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/admin-shop/package.json ./apps/admin-shop/
COPY libs/shared/package.json ./libs/shared/

RUN yarn --frozen-lockfile

FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ARG EDGE_STORE_ACCESS_KEY
ARG EDGE_STORE_SECRET_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV EDGE_STORE_ACCESS_KEY=$EDGE_STORE_ACCESS_KEY

WORKDIR /app

COPY package.json yarn.lock ./
COPY libs ./libs
COPY apps/admin-shop ./apps/admin-shop
RUN rm -rf ./apps/admin-shop/node_modules

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin-shop/node_modules ./apps/admin-shop/node_modules

RUN yarn workspace @ditch/lib build

RUN yarn workspace @ditch/admin-shop build

FROM base AS runner
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG EDGE_STORE_ACCESS_KEY
ARG EDGE_STORE_SECRET_KEY

ENV NODE_ENV production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV EDGE_STORE_ACCESS_KEY=$EDGE_STORE_ACCESS_KEY
ENV EDGE_STORE_SECRET_KEY=$EDGE_STORE_SECRET_KEY
ENV NEXT_SHARP_PATH=/app/node_modules/sharp
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


# Set the correct permission for prerender cache

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-shop/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin-shop/.next/static ./apps/admin-shop/.next/static

COPY --from=builder /app/apps/admin-shop/public ./apps/admin-shop/public

RUN chown nextjs:nodejs apps/admin-shop/.next

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "apps/admin-shop/server.js"]
