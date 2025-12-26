# Apify Actor Dockerfile for SEPTO OSINT Scraper
FROM apify/actor-node-playwright:20

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --prefer-offline --no-audit --progress=false

# Copy source code
COPY . .

# Install Playwright browsers (required for Firefox)
RUN npx playwright install --with-deps firefox 2>/dev/null || npx playwright install firefox

# Set the start command
CMD ["node", "src/main.js"]
