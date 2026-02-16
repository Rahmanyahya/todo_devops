FROM  node:20-alpine

WORKDIR /app

COPY . .

RUN mv .env.example .env

RUN npm install && chmod +x run.sh

EXPOSE 3000

CMD ["sh", "run.sh"]