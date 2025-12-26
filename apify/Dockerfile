# Use Apify's Camoufox image with pre-installed browsers
FROM apify/actor-node-playwright-camoufox:22-1.56.1

# Set working directory
WORKDIR /usr/src/app

# Set npm cache and temp directories
ENV NPM_CONFIG_CACHE=/home/myuser/.npm
ENV NPM_CONFIG_TMP=/home/myuser/.npm_tmp

# Create npm directories and ensure myuser owns them
RUN mkdir -p /home/myuser/.npm /home/myuser/.npm_tmp && \
    chown -R myuser:myuser /home/myuser

# Create node_modules directory with proper permissions
# This prevents Apify's build process from failing when it tries to create it
RUN mkdir -p /usr/src/app/node_modules && \
    chown -R myuser:myuser /usr/src/app

# Copy package files first for better Docker layer caching
COPY --chown=myuser:myuser package*.json ./

# Install dependencies (npm install will use the existing node_modules directory)
RUN npm install --production

# Copy the rest of the source code
COPY --chown=myuser:myuser . .

# Ensure myuser owns all files
RUN chown -R myuser:myuser /usr/src/app

# Switch to non-root user for security
USER myuser

# Set the start command
CMD ["node", "src/main.js"]
