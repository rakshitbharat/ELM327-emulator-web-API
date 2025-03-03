# Use Node.js base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install curl for nvm installation
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install nvm
ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Add NVM to path and set Node 20
ENV NODE_VERSION 20
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Install Bun
RUN npm install -g bun

# Copy package files first
COPY package.json ./
COPY bun.lock ./
COPY stream-polyfill.js ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application in development mode
CMD ["bun", "run", "dev"]