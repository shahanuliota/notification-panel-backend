FROM node:lts-alpine
#LABEL maintainer "ack@baibay.id"

WORKDIR /app


COPY package.json yarn.lock ./
RUN touch .env

RUN set -x && yarn
RUN yarn global add @nestjs/cli

COPY . .
#RUN yarn migrate
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start:prod" ]