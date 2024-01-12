FROM node:20

ENV PORT 8000
EXPOSE 8000

COPY ./src /code
WORKDIR /code

RUN npm install

USER 1000

CMD ["node", "server.js"]
