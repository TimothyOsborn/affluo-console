# Build stage for React Native app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app (this would typically build for a specific platform)
# For now, we'll just install dependencies
RUN npm run build:android || echo "Build step would be implemented for specific platform"

# Production stage (for serving build artifacts or running tests)
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Expose port for development server (if needed)
EXPOSE 8081

# Default command
CMD ["npm", "start"]
