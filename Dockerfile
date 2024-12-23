# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install ci

# Copy the entire application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm install ci --only=production

# Expose the app port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/src/main.js"]
