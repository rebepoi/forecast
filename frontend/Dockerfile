FROM node:latest

WORKDIR /src/public/

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm", "start" ]
