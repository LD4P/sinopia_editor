FROM circleci/node:10.11

# Allow build-time arguments (for, e.g., docker-compose)
ARG REACT_APP_SPOOF_SINOPIA_SERVER
ARG REACT_APP_SINOPIA_SERVER_URL

# Pass build-time arguments on to runtime so they are available in application
ENV REACT_APP_SPOOF_SINOPIA_SERVER=$REACT_APP_SPOOF_SINOPIA_SERVER
ENV REACT_APP_SINOPIA_SERVER_URL=$REACT_APP_SINOPIA_SERVER_URL

# This is the directory the user in the circleci/node image can write to
WORKDIR /home/circleci

# Everything that isn't in .dockerignore ships
COPY . .

# Build the app *within* the container because environment variables are fixed at build-time
RUN npm install

# docker daemon maps app's port
EXPOSE 8000

CMD ["npm", "start"]
