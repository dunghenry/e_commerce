FROM node:alpine

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 4000

CMD [ "npm", "start" ]