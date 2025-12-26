# Apify Actor Dockerfile for SEPTO OSINT Scraper
# Uses official Apify Playwright image with JavaScript support

FROM apify/actor-node-playwright:20

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=prod

# Copy source code
COPY . .

# Set the start command - runs main.js directly
CMD ["node", "src/main.js"]
