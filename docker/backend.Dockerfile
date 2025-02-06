FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

# Copy source files
COPY packages/backend ./packages/backend
COPY packages/shared ./packages/shared
COPY tsconfig.base.json ./

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build --workspace=@verp/backend

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start", "--workspace=@verp/backend"]