FROM node:22 AS client

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./

RUN rm -rf node_modules

RUN npm install

COPY client/ ./

RUN npm run build

FROM node:22

WORKDIR /app

COPY server/package.json /app

RUN npm install

COPY server /app

COPY --from=client /app/client/dist /app/client

EXPOSE 8080

CMD [ "npm", "start" ]