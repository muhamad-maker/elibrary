# Dockerfile sementara untuk Backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm init -y && npm install express
COPY . .
EXPOSE 3001
CMD ["node", "-e", "const express = require('express'); const app = express(); app.get('/', (req, res) => res.send('E-Library Backend API berjalan')); app.listen(3001, () => console.log('Backend berjalan di port 3001'));"]

