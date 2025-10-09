# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Angular app
RUN npm run build --prod

# Install a simple HTTP server to serve the app
RUN npm install -g http-server

# Expose the port
EXPOSE 4200

# Command to serve the app
CMD ["http-server", "dist/issue-tracker-frontend", "-p", "4200"]