FROM node:20-alpine

# Install openssl untuk Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package.json saja tanpa package-lock untuk menghindari konflik versi
COPY package.json ./

# Install ulang dengan npm v9 yang lebih stabil
RUN npm install --legacy-peer-deps

# Copy seluruh source code (termasuk prisma/schema.prisma)
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3001

# Jalankan migrasi database lalu jalankan server TypeScript
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx ts-node --transpile-only src/index.ts"]
