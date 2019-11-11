FROM node:10-alpine

RUN npm install -g yarn

WORKDIR /oddspot/auth-service

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 30001

ENTRYPOINT [ "yarn", "start" ]
