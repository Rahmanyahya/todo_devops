FROM  node:20-alpine

WORKDIR /app

COPY package.json .
COPY server.js .
COPY prisma ./prisma
COPY public ./public
COPY views ./views
COPY run.sh .

RUN npm install && chmod +x run.sh

EXPOSE 3000

CMD ["sh", "run.sh"]