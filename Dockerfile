FROM node:13-alpine

WORKDIR /home/nishant/resortmanagement/rrs-api

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

CMD node app.js