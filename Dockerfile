FROM circleci/node:10.11

# Allow build-time arguments (for, e.g., docker-compose)
ARG SPOOF_SINOPIA_SERVER
ARG TRELLIS_BASE_URL
ARG DEFAULT_PROFILE_SCHEMA_VERSION
ARG SINOPIA_GROUP
ARG SINOPIA_URI
ARG AWS_COGNITO_DOMAIN
ARG COGNITO_CLIENT_ID

# This is the directory the user in the circleci/node image can write to
WORKDIR /home/circleci

# Everything that isn't in .dockerignore ships
COPY . .

# Allow circleci user to run npm build
USER root
RUN /bin/bash -c 'chown -R circleci dist'

# Run app using non-privileged account
USER circleci

# Build the app *within* the container because environment variables are fixed at build-time
RUN npm install
RUN npm run build

# docker daemon maps app's port
EXPOSE 8000

CMD ["npm", "start"]
