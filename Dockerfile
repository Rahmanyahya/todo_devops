FROM node:20

WORKDIR /app

COPY server.js .
COPY views ./views
COPY public ./public
COPY .env .
COPY package.json .

RUN npm install
EXPOSE 3000

CMD ["node", "server.js"]