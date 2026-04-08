# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* bun.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    else npm run build; fi

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3001
CMD ["node", "server.js"]
