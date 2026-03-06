FROM node:20-alpine

WORKDIR /usr/src/app

# Install PM2
RUN npm install -g pm2

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 3000

# Start app with PM2 (DO NOT use node directly)
CMD ["pm2-runtime", "ecosystem.config.js"]
