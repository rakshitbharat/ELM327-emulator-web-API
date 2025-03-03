# Use Node 20 as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Install bun globally
RUN npm install -g bun

# Copy package files first
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application in development mode
CMD ["bun", "run", "dev"]