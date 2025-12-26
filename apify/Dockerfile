# Use Apify's Camoufox image which includes Playwright with browsers
FROM apify/actor-node-playwright-camoufox:22-1.56.1

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --prefer-offline --no-audit --progress=false

# Copy source code
COPY . .

# Set the start command
CMD ["node", "src/main.js"]
