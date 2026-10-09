FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=10000
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js spiel.js zugang.js ./
COPY public ./public
EXPOSE 10000
CMD ["node", "server.js"]
