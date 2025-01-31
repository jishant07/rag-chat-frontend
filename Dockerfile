FROM node:latest

RUN mkdir -p app

WORKDIR /app

COPY package*.json .

RUN npm install -g next

RUN npm install . --legacy-peer-deps

COPY . .

EXPOSE 3000

RUN ls

CMD ["npm", "run", "dev"]