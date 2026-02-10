FROM node:20

WORKDIR /app

COPY server.js .
COPY views ./views
COPY public ./public
COPY .env .
copy package.json .

RUN npm i

CMD ['npm', 'start']