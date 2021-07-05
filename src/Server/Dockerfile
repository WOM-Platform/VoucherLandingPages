FROM 16.3.0-alpine3.11

ENV PORT 8000
EXPOSE 8000

USER 1000

COPY ./src /code
WORKDIR /code

CMD ["node", "server.js"]
