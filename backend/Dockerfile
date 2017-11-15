FROM node:ansible

WORKDIR /src

COPY package.json .

RUN npm install

COPY . .

EXPOSE 9000

CMD [ "npm", "start" ]
