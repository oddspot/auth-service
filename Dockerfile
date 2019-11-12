# Builder
FROM alpine AS builder
WORKDIR /oddspot/auth-service
RUN apk add --no-cache --update nodejs nodejs-npm
RUN npm install -g yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage
FROM alpine
WORKDIR /oddspot/auth-service
RUN apk add --no-cache --update nodejs
COPY --from=builder /oddspot/auth-service/node_modules ./node_modules
COPY . .
EXPOSE 30001
ENTRYPOINT [ "node", "./dist" ]
