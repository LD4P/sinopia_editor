FROM node:10-alpine

# Use dockerize to force indexer to wait for the broker to be ready
RUN apk add --no-cache openssl
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /opt/sinopia_editor/

# Everything that isn't in .dockerignore ships
COPY . .

# docker daemon maps app's port
EXPOSE 8000

RUN npm install

CMD ["npm", "start"]
