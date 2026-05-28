# --- Build Stage ---
FROM node:22-bookworm AS builder

# Install Meteor dependencies and Meteor itself
RUN apt-get update && apt-get install -y curl build-essential && \
    curl https://install.meteor.com/ | sh

# Allow running Meteor as root inside Docker
ENV METEOR_ALLOW_SUPERUSER=true

WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install package dependencies
RUN meteor npm clean-install

# Copy project source
COPY . .

# Build Argument for Module Federation Public Path
ARG PUBLIC_PATH
ENV PUBLIC_PATH=$PUBLIC_PATH

# Build Meteor app into ../output directory
RUN meteor build ../output --directory --server-only

# --- Run Stage ---
FROM node:22-bookworm-slim

# Install system dependencies if any native node modules need compilation
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the built server bundle from the builder stage
COPY --from=builder /output/bundle ./

# Install production dependencies for the Meteor server bundle
RUN cd programs/server && npm clean-install --production

# Expose default remote app port
EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

CMD ["node", "main.js"]
