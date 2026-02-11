FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

COPY . .
RUN npx tsc

EXPOSE 3000

CMD ["node", "dist/index.js"]
