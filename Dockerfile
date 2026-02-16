FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN mv .env.example .env
RUN npx prisma generate
RUN chmod +x run.sh

EXPOSE 3000

CMD ["sh", "run.sh"]