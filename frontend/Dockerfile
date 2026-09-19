FROM node:20-alpine

WORKDIR /app

# Install dependencies terlebih dahulu (caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy seluruh source code
COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

# Jalankan server Next.js (production mode)
CMD ["npm", "start"]

