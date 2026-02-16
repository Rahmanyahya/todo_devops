FROM  node:20-alpine

WORKDIR /app

COPY package.json .
COPY server.js .
COPY prisma ./prisma
COPY public ./public
COPY views ./views
COPY run.sh .

RUN npm install
EXPOSE 3000

CMD ["run.sh"]