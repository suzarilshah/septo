# Use Apify's Camoufox image with pre-installed browsers
FROM apify/actor-node-playwright-camoufox:22-1.56.1

WORKDIR /usr/src/app

# Fix npm permissions by setting cache and tmp to user-writable locations
ENV NPM_CONFIG_CACHE=/home/myuser/.npm
ENV NPM_CONFIG_TMP=/home/myuser/.npm_tmp

# Copy package files
COPY package*.json ./

# Create directories with proper permissions
RUN mkdir -p /home/myuser/.npm /home/myuser/.npm_tmp && chown -R myuser:myuser /home/myuser

# Create node_modules directory with proper permissions
RUN mkdir -p node_modules && chown -R myuser:myuser /usr/src/app

# Switch to myuser for npm install
USER myuser

# Install dependencies
RUN npm install --prefer-offline --no-audit --progress=false

# Switch back to root for copying source
USER root

# Copy source code
COPY --chown=myuser:myuser . .

# Switch to myuser for running
USER myuser

# Set the start command
CMD ["node", "src/main.js"]
