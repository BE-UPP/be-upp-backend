FROM node:12.22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .