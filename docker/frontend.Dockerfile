# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Copy source files
COPY packages/frontend ./packages/frontend
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./

# Install dependencies and build
RUN npm ci
RUN npm run build --workspace=@verp/frontend

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]