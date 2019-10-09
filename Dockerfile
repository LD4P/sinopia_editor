FROM circleci/node:12.6

# Allow build-time arguments (for, environment variables that need to be encoded into the webpack distribution)
ARG USE_FIXTURES
ARG TRELLIS_BASE_URL
ARG DEFAULT_PROFILE_SCHEMA_VERSION
ARG SINOPIA_GROUP
ARG SINOPIA_URI
ARG SINOPIA_ENV
ARG AWS_COGNITO_DOMAIN
ARG COGNITO_CLIENT_ID
ARG COGNITO_USER_POOL_ID
ARG INDEX_URL

# Set environment variables from the build args
ENV INDEX_URL ${INDEX_URL}

# This is the directory the user in the circleci/node image can write to
WORKDIR /home/circleci

# Everything that isn't in .dockerignore ships
COPY . .

RUN mkdir dist
RUN mkdir node_modules

# Allow circleci user to run npm build
USER root
RUN /bin/bash -c 'chown -R circleci dist node_modules'

# Build and run app using non-privileged account
USER circleci

# Install dependencies
RUN npm install --production

# Build the app *within* the container because environment variables are fixed at build-time
RUN npm run build

# docker daemon maps app's port
EXPOSE 8000

CMD ["npm", "start"]
