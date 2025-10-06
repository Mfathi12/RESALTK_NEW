# --- Base Image ---
FROM node:20-alpine AS base

# Create app directory
WORKDIR /usr/src/app

# Copy package.json + package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy app source code
COPY . .

# Expose port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
