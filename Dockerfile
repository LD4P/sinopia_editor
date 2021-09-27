FROM cimg/node:16.8

# Allow build-time arguments (for, environment variables that need to be encoded into the webpack distribution)
ARG USE_FIXTURES
ARG SINOPIA_API_BASE_URL=http://localhost:3000
ARG SINOPIA_URI
ARG SINOPIA_ENV
ARG AWS_COGNITO_DOMAIN
ARG COGNITO_CLIENT_ID
ARG COGNITO_USER_POOL_ID
ARG INDEX_URL
ARG EXPORT_BUCKET_URL
ARG HONEYBADGER_API_KEY
ARG HONEYBADGER_REVISION
ENV HONEYBADGER_API_KEY=$HONEYBADGER_API_KEY

# Set environment variables from the build args
ENV INDEX_URL ${INDEX_URL}

COPY --chown=circleci:circleci package.json .
COPY --chown=circleci:circleci package-lock.json .

# Install dependencies
RUN npm install --no-optional

# Everything that isn't in .dockerignore ships
COPY --chown=circleci:circleci . .

# Build the app *within* the container because environment variables are fixed at build-time
RUN npm run build

# Send source map to HB
RUN if [ -n "$HONEYBADGER_API_KEY" ]; then curl https://api.honeybadger.io/v1/source_maps \
  -F api_key=$HONEYBADGER_API_KEY \
  -F revision=$HONEYBADGER_REVISION \
  -F minified_url=$SINOPIA_URI/dist/bundle.js \
  -F source_map=@dist/bundle.js.map \
  -F minified_file=@dist/bundle.js ; fi

# docker daemon maps app's port
EXPOSE 8000

CMD ["npm", "start"]
