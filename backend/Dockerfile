FROM node:20-alpine

WORKDIR /app

# Install dependensi
COPY package.json package-lock.json* ./
RUN npm install

# Copy seluruh source code
COPY . .

# Generate Prisma Client & Build TypeScript
RUN npx prisma generate
RUN npm run build || npx tsc

EXPOSE 3001

# Jalankan migrasi dan server (Menggunakan npx ts-node atau node dist/index.js)
# Karena ini TypeScript, kita bisa pakai ts-node untuk dev/testing yang cepat
CMD npx prisma db push && npx ts-node src/index.ts
