FROM node:14.19.0-alpine3.14

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY ./ .

EXPOSE 5000

CMD [ "node","app.js" ]