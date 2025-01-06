# Use the official Node.js image as a base
FROM node:18

# Install required libraries for Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libxss1 \
    libgbm-dev \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxrandr2 \
    libxdamage1 \
    libxext6 \
    libxi6 \
    libxtst6 \
    fonts-liberation \
    libappindicator3-1 \
    libnspr4 \
    libxshmfence1 \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (if necessary, adjust if your app uses a different port)
EXPOSE 3000

# Command to run your application
CMD ["node", "app.js"]
