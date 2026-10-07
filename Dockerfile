# Multi-Stage Dockerfile for VocalFlow AI SaaS Application

# --- STAGE 1: Build Frontend & Server ---
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build Vite bundle
COPY . .
RUN npm run build

# --- STAGE 2: Production Runner ---
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

EXPOSE 4000 5173

CMD ["node", "server/index.js"]
