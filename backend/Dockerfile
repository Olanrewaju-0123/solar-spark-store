# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL deps including devDependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript -> dist
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

# Copy only package files
COPY package*.json ./

# Install ONLY production deps
RUN npm ci --only=production

# Copy built JS files from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 4000

# Healthcheck (optional, remove if curl not installed in alpine)
# RUN apk add --no-cache curl
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:4000/api/products || exit 1

# Start the app
CMD ["node", "dist/server.js"]
