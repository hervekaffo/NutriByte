FROM node:18-alpine
WORKDIR /app

# install only production deps
COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 5000
CMD ["node", "backend/server.js"]
