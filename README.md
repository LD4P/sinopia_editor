[![CircleCI](https://circleci.com/gh/LD4P/sinopia_editor.svg?style=svg)](https://circleci.com/gh/LD4P/sinopia_editor)
[![Coverage Status](https://img.shields.io/coveralls/github/LD4P/sinopia_editor.svg)](https://coveralls.io/github/LD4P/sinopia_editor?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/27fe0fcbf342d0bca13b/maintainability)](https://codeclimate.com/github/LD4P/sinopia_editor/maintainability)

# Sinopia Linked Data Editor

Technical documentation specific to the Sinopia Linked Data Editor may also be found in the [wiki](https://github.com/LD4P/sinopia_editor/wiki/Sinopia-Editor). The Sinopia Editor homepage is available [development.sinopia.io](http://development.sinopia.io), [stage.sinopia.io](https://stage.sinopia.io), and [sinopia.io](https://sinopia.io). The Sinopia Editor is a React application with all new user interfaces and functionality using React and the React ecosystem. Portions of the codebase originally extracted from the Library of Congress [bfe project](https://github.com/lcnetdev/bfe).

## Installation

### Prerequisites

* [node.js](https://nodejs.org/en/download/) JavaScript runtime (>=14 is recommended)
* [npm](https://www.npmjs.com/) JavaScript package manager
* [Docker](https://www.docker.com/)
* A development cognito account: Go to https://development.sinopia.io/ and click "Request Account". This account can be used to authenticate when running locally as described below.

You can use the ["n"](https://www.npmjs.com/package/n) node package management to manage multiple version of node.

### Installation instructions

1.  Run `npm init`, and follow the instructions that appear.
2.  Get latest npm: `npm install -g npm@latest`
3.  Run `npm install`. This installs everything needed for the build to run successfully.
4.  Run `docker-compose pull` to pull down all images.
5.  Add these to your local `.env` file:

```
COGNITO_TEST_USER_NAME='sinopia-devs+client-tester@lists.stanford.edu' # a test user we have on dev and stage
COGNITO_TEST_USER_PASS='<get this from shared_configs or another developer>' # not committing the real value to a public repo
COGNITO_ADMIN_PASSWORD='<get this from shared_configs or another developer>'
```

## Running the application
To start all of the supporting services (ElasticSearch, Trellis, etc.):
`docker-compose up -d`

Note that this will bring up the sinopia-editor app on port 8000, but it will NOT be in a mode where
you can make code changes and see them live.  To do this, start the Express web server and run the
application at [http://localhost:8888](http://localhost:8888):

`npm run dev-start`

This will run the app in development mode and code changes will immediately be loaded without having to restart the server.
Note that sinopia editor being run by docker on port 8000 will still be viewable but will not reflect any code changes you make
immediately, so be careful which port you are accessing the app at to avoid confusion.

Specify the environment variable `USE_FIXTURES=true` as shown below if you would like to use fixture resources and resource templates.
The fixtures are listed in `__tests__/testUtilities/fixtureLoaderHelper.js`. Fixture resource templates will be listed on the
templates list page and fixture resources can be searched on by entering the resource's URI in the Sinopia search box.

`USE_FIXTURES=true npm run dev-start`

## Developers

### Linter for JavaScript

To run eslint:
`npm run eslint`

To automatically fix problems (where possible):
`npm run eslint-fix`

### Unit, feature, and integration tests

Tests are written with jest and react-testing-library.

To run all of the tests:
`npm test`

To run a single test file:
`npx jest __tests__/actionCreators/resources.test.js`

To run a single test:
`npx jest __tests__/actionCreators/resources.test.js -t "newResourceFromN3 loading a resource dispatches actions"`


#### End-to-end tests

End-to-end tests are written with [Cypress](https://www.cypress.io/).

Add these to your local `cypress.env.json` file:
```
{
  "COGNITO_TEST_USER_NAME": "sinopia-devs_client-tester",
  "COGNITO_TEST_USER_PASS": "<get this from shared_configs or another developer>"
}
```

The end-to-end tests run against a complete environment running in docker, so it must be running as described above.

To open Cypress interactively (for test development), execute `npm run cypress-open` and click on the test to run.

To run test non-interactively, execute `npm run cypress-run`.

#### Cross Platform Testing

We use open source BrowserStack accounts for cross-platform/browser testing. See the [Sinopia Editor wiki](https://github.com/LD4P/sinopia_editor/wiki/Cross-Platform-Browser-Testing) for more details about how to get an account.

[![Browserstack](https://github.com/LD4P/sinopia_editor/wiki/images/Browserstack-logo.png)](https://www.browserstack.com)

#### Testing Honeybadger
To trigger a test exception, doubleclick "The underdrawing for the new world of linked data in libraries" on the home page.

### Monitoring ElasticSearch
DejaVu is available for monitoring local ElasticSearch.

To use DejaVu:
1. Uncomment the appropriate section in `docker-compose.yml`. (Do not commit this change.)
2. `docker-compose up -d`
3. Browse to http://localhost:1358.
4. When prompted, enter `http://localhost:9200` as the ElasticSearch URL and `*` as the index name.

### Monitoring Mongo
Mongo-Express is available for monitoring local Mongo.

To use Mongo-Express:
1. Uncomment the appropriate section in `docker-compose.yml`. (Do not commit this change.)
2. `docker-compose up -d`
3. Browse to http://localhost:8082.


#### Changes to environment variables

If you add environment variables to which the Editor needs to pay attention (e.g. for configuring connections to Cognito or other external services on a per-instance basis), you'll need to make sure they're added to lists in three places besides e.g. the `Config.js` function that uses the environment variable.
* the list given to `new webpack.EnvironmentPlugin()` in the `plugins` section of `webpack.config.js`
  * e.g. https://github.com/LD4P/sinopia_editor/commit/aadd9d6170b08ff9261392d5b2ec2c6f56470e20#diff-11e9f7f953edc64ba14b0cc350ae7b9dR58
* the build-time arguments section of `Dockerfile`
  * e.g. https://github.com/LD4P/sinopia_editor/commit/aadd9d6170b08ff9261392d5b2ec2c6f56470e20#diff-3254677a7917c6c01f55212f86c57fbfR10
* the env specific `docker build` commands in the `register_image` section of `.circleci/config.yml`
  * e.g. https://github.com/LD4P/sinopia_editor/commit/1d3e381cb0f937300242cf896f62c2508e4a57e2#diff-1d37e48f9ceff6d8030570cd36286a61R63

## Release Management

The steps to create a tagged release are documented in the tagged-release ticket template. Please create a tagged-release ticket when performing a release.

## State model

![Redux State ER Diagram](redux-state.svg)

```
{
  subjects: {
    <subject key [shortid]>: {<subject>},
    ...
  }
  properties: {
    <property key [shortid]>: {<property>}
    ...
  }
  values: {
    <value key, [shortid]>: {<values>}
    ...
  },
  subjectTemplates: {
    <subject template key [resource template id]>: {<subject template>}
    ...
  },
  propertyTemplates: {
    <property template key [resource template id > property uri]>: {<[property template]>}
    ...
  }
}
```

### Subject model
```
{
  key: <shortid>
  uri: <uri|null>
  subjectTemplateKey: <key of subject template>,
  -> subjectTemplate: {subjectTemplate}
  propertyKeys: [key of property, ...]
  resourceKey: <key of resource that this subject is part of>
  -> properties: [{property}, ...]
}
```
-> Added by selector, not stored in state.

The following are only in the resource subject (that is, the base subject).
```
{
  group: <group that that resource belongs to>,
  bfAdminMetadataRefs: [uri of referenced admin metadata resource, ...],
  bfWorkRefs: [uri of referenced Bibframe Work resource, ...],
  bfInstanceRefs: [uri of referenced Bibframe Instance resource, ...],
  bfItemRefs: [uri of referenced Bibframe Item resources, ...]
}
```

### Subject template model
```
{
  key: <resource template id, e.g., resourceTemplate:bf2:Monograph:Instance>,
  id: <resource template id, e.g., resourceTemplate:bf2:Monograph:Instance>,
  class: <resource URI, e.g., http://id.loc.gov/ontologies/bibframe/Instance>,
  label: <resource label, e.g., "BIBFRAME Instance">,
  author: <author>,
  remark: <remark>,
  date: <date>,
  propertyKeys: [key of property templates, ...]
}
```

### Property model
```
{
  key: <shortid>,
  subjectKey: <key of subject>,
  resourceKey: <key of resource that this subject is part of>
  -> subject: {<subject>}
  propertyTemplateKey: <key of property template>,
  -> propertyTemplate: {<propertyTemplate>},
  valueKeys: [key of value, ...] | null (if not expanded)
  -> values: [{value},...]
  toggleOpen: <true | false>
}
```
-> Added by selector, not stored in state.

### Property template model
```
{
  key: <resource template id > property uri>,
  subjectTemplateKey: <key of subject template>,
  label: <label, e.g., "Title Information">,
  uri: <property uri, e.g., "http://id.loc.gov/ontologies/bibframe/title">
  required: <true | false>
  repeatable: <true | false>
  ordered: <true | false>
  defaults: [{literal: <literal>, lang: <lang>}, {uri: <uri>, label: <label>},...]
  remark: <remark>,
  remarkUrl: <remark url, e.g., "http://access.rdatoolkit.org/2.13.html">
  type: <resource | uri | literal>,
  component: <InputLookupSinopia | InputLookupQA | InputListLOC | InputLiteral | InputURI>,
  valueSubjectTemplateKeys: [<subject template keys>]
  authorities: [{authority}, ...]

}
```

### Authority model
```
{
  uri: <authority uri>
  label: <label>
  authority: <authority, e.g., "geonames_ld4l_cache">
  subauthority: <subauthority, e.g., "area">
  nonldLookup: <true | false>
}
```

### Value model
```
{
  key: <shortid>,
  propertyKey: <key of property>,
  resourceKey: <key of resource that this subject is part of>
  -> property: {<property>},
  literal: <literal>,
  lang: <language for literal>,
  uri: <uri>,
  label: <label for uri>,
  valueSubjectKey: <key for subject for a nested resource>,
  -> valueSubject: {<subject>}
}
```
-> Added by selector, not stored in state.

Note: A value will have literal / lang or uri / label or valueSubjectKey.

## Contributors

* [Jeremy Nelson](https://github.com/jermnelson)
* [Kevin Ford](https://github.com/kefo)
* [Kirk Hess](https://github.com/kirkhess)

[Index Data](http://indexdata.com/):
* [Charles Ledvina](https://github.com/cledvina)
* [Wayne Schneider](https://github.com/wafschneider)

## Maintainer

* **LD4P2 Sinopia Project Team**
  * [GitHub](https://github.com/ld4p/)


## License

Unless otherwise noted, code that is originally developed by Stanford University
in the `Sinopia Editor` is licensed under the [Apache 2](https://www.apache.org/licenses/LICENSE-2.0).

Original `bfe` code is in the [Public Domain](http://creativecommons.org/publicdomain/zero/1.0/).
