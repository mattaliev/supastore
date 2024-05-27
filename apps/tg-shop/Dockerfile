ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

FROM node:21-alpine AS base

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=$NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

FROM base AS deps

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=$NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/tg-shop/package.json ./apps/tg-shop/
COPY libs/shared/package.json ./libs/shared/
RUN cd ./libs/shared && ls
RUN ls
RUN yarn workspaces info
RUN yarn --frozen-lockfile

FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=$NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

WORKDIR /app

COPY package.json yarn.lock ./
COPY libs ./libs
COPY apps/tg-shop ./apps/tg-shop
RUN rm -rf ./apps/tg-shop/node_modules

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/tg-shop/node_modules ./apps/tg-shop/node_modules

RUN yarn workspace @ditch/lib build

RUN yarn workspace @ditch/tg-shop build

FROM base AS runner
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

ENV NODE_ENV production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=$NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
ENV NEXT_SHARP_PATH=/app/node_modules/sharp
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


# Set the correct permission for prerender cache

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/tg-shop/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/tg-shop/.next/static ./apps/tg-shop/.next/static

COPY --from=builder /app/apps/tg-shop/public ./apps/tg-shop/public

RUN chown nextjs:nodejs apps/tg-shop/.next

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "apps/tg-shop/server.js"]
