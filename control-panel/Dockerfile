# Use Bun's official image instead of Node
FROM oven/bun:1.0.35

# Set the working directory
WORKDIR /app

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