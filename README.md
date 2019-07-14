[![CircleCI](https://circleci.com/gh/LD4P/sinopia_editor.svg?style=svg)](https://circleci.com/gh/LD4P/sinopia_editor)
[![Coverage Status](https://img.shields.io/coveralls/github/LD4P/sinopia_editor.svg)](https://coveralls.io/github/LD4P/sinopia_editor?branch=master)

# Sinopia Linked Data Editor

Technical documentation specific to the Sinopia Linked Data Editor may also be found in the [wiki](https://github.com/LD4P/sinopia_editor/wiki/Sinopia-Editor). The [Sinopia Editor][GIT_REPO] homepage is available in staging at [stage.sinopia.io][staging]. The Sinopia Editor is a [React][REACT] application with all new user interfaces and functionality using React and the React ecosystem. Portions of the codebase originally extracted from the Library of Congress `bfe` [project][BFE_GIT].

## Installation (without docker image)

### Prerequisites
* `node.js` JavaScript runtime https://nodejs.org/en/download/
* `npm` JavaScript package manager https://www.npmjs.com/

### Installation Instructions
1.  Install [node.js](https://nodejs.org/en/download/)
2.  Install [npm](https://www.npmjs.com/)
3.  Run `npm init`, and follow the instructions that appear.
4.  Get latest npm: `npm install -g npm@latest`
5.  Run `npm install`. This installs everything needed for the build to run successfully.

Note: Currently you need to have node version 10 (version 12 may not work).
You can use the "n" node package management to manage multiple version of node: https://www.npmjs.com/package/n

## Build the distribution

`npm run build`

## Running the code

`npm start`

Follow installation instructions, then run `npm start` or `node server.js` to start the web server using Express.
This will start up the code at [http://localhost:8000](http://localhost:8000).

The Sinopia Editor code is currently available via [sinopia.io](https://sinopia.io)

## Creating an account

To log into the sinopia editor in localhost, you will need a development cognito account.  To do this,
go to https://development.sinopia.io/ and click "Request Account".  Create your account here and
confirm the email address.  Once created, you can go back to localhost and login with that account.
You will need to be online to authenticate even when developing in localhost.

## Developers

- See `package.json` for npm package dependencies.
- The web server used is the `express` web framework for node.js
- React components are located in `src/components/` directory

### Use static resource templates instead of hitting Trellis

Specify the environment variable `USE_FIXTURES=true` when building the application if you would like it to load resource templates from the filesystem instead of looking for Trellis.

### Run the server with webpack-dev-webserver

`npm run dev-start`

Runs the webpack-dev-server, allowing immediate loading of live code changes without having to restart the server. The webpack-dev-server is available at [http://localhost:8888](http://localhost:8888).
Note that running the webpack server does NOT call server.js

### Building with webpack

`npm run dev-build`  (no minimization)  or `npm run build` (with minimization)

We are using webpack as a build tool.  See `webpack.config.js` for build dependencies and configuration.

### Running the production server

`npm start` will spin up the production server (this depends on `npm run build` already having been run). The web server is available at [http://localhost:8000](http://localhost:8000).

### Linter for JavaScript

`npm run eslint`

### Running Tests

Tests are written in jest, also utilizing puppeteer for end-to-end tests. Run them with `npm test`.

To properly run all of the tests (including integration), you'll have to provide a couple of environment variables,
so that the tests have valid user info with which to login.  The env vars are:

Add these to your local `.env` file:

```sh
COGNITO_TEST_USER_NAME='sinopia-devs+client-tester@lists.stanford.edu' # a test user we have on dev and stage
COGNITO_TEST_USER_PASS='<get this from shared_configs or another developer>' # not committing the real value to a public repo
```

Putting it all together, to run all of the tests:

```sh
npm test
```

You can also run the tests together with the linter all in one, similar to what happens at CircleCI.

```sh
npm run ci
```

Note that if you have an instance of the dev server already running in a separate terminal, you may need to stop the server or you may get a port conflict
when running the integration tests.

#### Test coverage

To get coverage data, use `npm run jest-cov`.  Be sure to specify the ENV variables as described above:

```sh
npm run jest-cov
```

Once complete, you can start the dev server on your laptop as describe above and visit `http://localhost:8888/coverage/lcov-report/index.html`.
(change localhost port number in the URL as needed to relfect actual one used in your local server)

There is a project view and also a view of each file.  You can also check [coveralls](https://coveralls.io/repos/github/LD4P/sinopia_editor).

### Static Analysis

We use plato (actually es6-plato) to get static analysis info such as code complexity, etc.  `npm run analysis` will create a folder `static-analysis`; use a web browser to open `static-analysis/index.html`.  There is a project view and also a view of each file.

### Continuous Integration

We use [circleci](https://circleci.com/gh/Ld4p/sinopia_profile_editor).  The steps are in `.circleci/config.yml`.

In the "artifacts" tab of a particular build, you can look at code coverage (`coverage/lcov-report/index.html`) and at static analysis output (`static-analysis/index.html`).

## Running with Docker

The [Sinopia Editor][GIT_REPO] supports [Docker](https://www.docker.com/), both
with images hosted on [Dockerhub](https://hub.docker.com/r/ld4p/sinopia_editor/)
and with an available Dockerfile to build locally.

### Running latest Dockerhub Image

To run the Docker image, first download the latest image by
`docker pull ld4p/sinopia_editor:latest` and then to run the editor locally
in the foreground, `docker run -p 8000:8000 --rm --name=sinopia_editor ld4p/sinopia_editor`. The running Sinopia Editor should now be available locally at
[http://localhost:8000](https://hub.docker.com/r/ld4p/sinopia_editor/).

### Docker-Compose

A docker-compose configuration is also provided to allow integration of the editor with Sinopia's platform components, including Trellis, ElasticSearch, ActiveMQ, Postgres, and the Sinopia indexing pipeline. You can spin up these components via:

```sh
$ docker-compose up editor # add the '-d' flag to daemonize and run in background
```

Of particular interest:

* The editor is at http://localhost:8000/
* Trellis is at http://localhost:8080/

Note that this will provide you with "out-of-the-box" Trellis, with no data in it. To spin up Trellis and its dependencies with the Sinopia container structure (root, repository, and group containers) and ACLs (declared on root container) pre-created, you can do using the `platformdata` docker-compose service:

```shell
$ docker-compose run platformdata
```

**NOTE**: In order for the above to work, you will need to set `COGNITO_ADMIN_PASSWORD`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` in a file named `.env` in the sinopia_editor root.

At this point, you will likely want to begin importing resource templates into the editor, after which you can begin creating linked data resources. To import a small set of interesting resource templates, consult the [instructions in this README](https://github.com/LD4P/sinopia_sample_profiles/blob/master/configuration_demo/readme.md).

If you'd like to see how the indexing pipeline is indexing Trellis data into ElasticSearch, you can spy on the ElasticSearch indexes using the DejaVu app included in the `docker-compose` configuration:

```shell
$ docker-compose up searchui # add the '-d' flag to daemonize and run in background
```

To use DejaVu, browse to http://localhost:1358, and when prompted, enter `http://localhost:9200` as the ElasticSearch URL and `*` as the index name.

### Building latest Docker Image

Before building the latest Docker Image, run `npm run build` to update the `dist` folder with the current build.
To build the latest version of the [Sinopia Editor][GIT_REPO], you can build with the `docker build -t ld4p/sinopia_editor:latest --no-cache=true .` command. **NOTE** that images tagged with `latest` will not be deployed to any of our AWS environments. See below for how to build and deploy images

#### Important Docker Image Build Note

If you add environment variables to which the Editor needs to pay attention (e.g. for configuring connections to Cognito or other external services on a per-instance basis), you'll need to make sure they're added to lists in three places besides e.g. the `Config.js` function that uses the environment variable.
* the list given to `new webpack.EnvironmentPlugin()` in the `plugins` section of `webpack.config.js`
  * e.g. https://github.com/LD4P/sinopia_editor/commit/aadd9d6170b08ff9261392d5b2ec2c6f56470e20#diff-11e9f7f953edc64ba14b0cc350ae7b9dR58
* the build-time arguments section of `Dockerfile`
  * e.g. https://github.com/LD4P/sinopia_editor/commit/aadd9d6170b08ff9261392d5b2ec2c6f56470e20#diff-3254677a7917c6c01f55212f86c57fbfR10
* the env specific `docker build` commands in the `register_image` section of `.circleci/config.yml`
  * e.g. https://github.com/LD4P/sinopia_editor/commit/1d3e381cb0f937300242cf896f62c2508e4a57e2#diff-1d37e48f9ceff6d8030570cd36286a61R63

All three of those locations must have the environment variable name added correctly.  If the webpack configuration change is omitted, the environment variable value will not be picked up by the editor, even when running locally on a dev laptop.  If either of the other two changes is omitted, the environment variable value will not make it into the environment specific images that are built and deployed.

### Pushing Docker Image to DockerHub

Run `docker login` and enter the correct credentials to your docker account (hub.docker.com).
Once successfully authenticated, run

`docker push ld4p/sinopia_editor:latest`

Ask a member on the DevOps team to go into the AWS console to update https://sinopia.io

### Updating Docker Image in AWS Dev Environment

This section assumes you've already authenticated to DockerHub via `docker login` in the previous section, and also assumes you've run through the [AWS development environment setup](https://github.com/sul-dlss/terraform-aws/wiki/AWS-DLSS-Dev-Env-Setup) documentation and configured the AWS CLI.

First, build a new `sinopia_editor` image tagged with `dev`. In order to do this, you **MUST** provide the dev-specific build args:

```shell
$ docker build -t ld4p/sinopia_editor:dev --build-arg TRELLIS_BASE_URL=https://trellis.development.sinopia.io --build-arg SINOPIA_URI=https://development.sinopia.io --build-arg AWS_COGNITO_DOMAIN=https://sinopia-development.auth.us-west-2.amazoncognito.com --build-arg COGNITO_CLIENT_ID=2u6s7pqkc1grq1qs464fsi82at .
```

Then push the `dev`-tagged image to DockerHub:

```shell
$ docker push ld4p/sinopia_editor:dev
```

Next, set an environment variable to the name of the AWS `DevelopersRole` profile as described in the documentation above (as stored in `~/.aws/config`):

```shell
$ export AWS_PROFILE=change_to_whatever_you_named_your_dlss_development_profile
```

And, finally, run the following commands to refresh the dev ECS instance that runs the editor:

```shell
$ task_arn=$(aws ecs list-task-definitions --family-prefix sinopia-homepage --region us-west-2 --sort DESC --max-items 1 --profile $AWS_PROFILE | jq --raw-output --exit-status '.taskDefinitionArns[]')
$ cluster_arn=$(aws ecs list-clusters --region us-west-2  --profile $AWS_PROFILE | jq --raw-output --exit-status '.clusterArns[] | select(contains(":cluster/sinopia-dev"))')
$ aws ecs update-service --service sinopia-homepage --region us-west-2 --cluster $cluster_arn --task-definition $task_arn --force-new-deployment --profile $AWS_PROFILE
```

## Release Management

The steps to create a tagged release of the Sinopia's Linked Data Editor are as follows:

1. Update the version in `package.json`
1. Run `npm i` to regenerate `package-lock.json`
1. Publish the version to npm registry by issuing `npm publish` command in the root projects
   directory. (Requires publishing rights to the project in the npmjs.com registry)
1. Create a Github annotated tag and push up to the project's
   [releases](https://github.com/LD4P/sinopia_editor/releases) page along with release notes
1. Build a tagged Docker image i.e. `docker build -t ld4p/sinopia_editor:{version} .`
1. Push the tagged version to Dockerhub with `docker push ld4p/sinopia_editor:{version}`,
   See [documentation](#building-latest-docker-image) for more information


# LD4P's fork of the BIBFRAME Editor
The Sinopia Editor is forked from [https://github.com/lcnetdev/bfe][BFE_GIT].

## History of BFE
From lcnetdev description: `bfe` is a standalone Editor for the Library of Congress's [Bibliographic Framework
(BIBFRAME) Initiative][bfi].  It can be used more generically as an editor for RDF data.
`bfe` uses [BIBFRAME Profiles][profilespec] to render an HTML/UI input form; it is
capable of integrating 'lookup' services, which query data from external Web APIs;
and implementers can define the input and extract the output.
...
From a design standpoint, the objective with `bfe` was to create the simplest
'pluggable' form editor one can to maximize experimental implementer's abilities
to create/edit BIBFRAME data.  The current focus is to transform bfe into a production ready tool.

This repository includes a development example, a "production" example, and
various BIBFRAME Profiles with which to begin experimenting. In order
to get started with `bfe` quickly and easily, there are two main aspects of `bfe`:
a javascript library and an accompanying CSS file.  The packaged javascript
library bundles a few additional libraries, some of which are [JQuery], [Lo-Dash],
elements from Twitter's [Bootstrap.js][Bootstrap], and
Twitter's [typeahead.js].  The CSS bundle includes mostly elements of
Twitter's [Bootstrap] and a few additional custom CSS declarations.

<!-- section links -->

[staging]: http://stage.sinopia.io/
[ontology]: http://id.loc.gov/ontologies/bibframe/
[bfi]: http://www.loc.gov/bibframe/
[profilespec]: http://bibframe.org/documentation/bibframe-profilespec/

Browser Support
---------------

* Chrome 34
* Firefox 24+
* Safari - 6+
* Internet Explorer 10+
* Opera - 12+

**NOTE:** `bfe` has also not been **thoroughly** tested in the browsers for which
support is currently listed.  It has been developed primarily using Chrome.
It has been tested in both Chrome and Safari mobile versions.


Developers
----------

From a design standpoint, the objective with `bfe` was to create the simplest
'pluggable' form editor one can to maximize experimental implementer's abilities
to create/edit linked data.  The current focus is to transform bfe into a production ready tool.

All contributions are welcome.  If you do not code, surely you will discover an
[issue] you can report.

#### User Authentication with AWS Cognito

We currently use AWS Cognito to manage the authentication of users. Cognito uses a client id to manage the connection to
this application (see `awsClientID()` in `src/Config.js`). Whenever changes are made to the AWS configuration this client_id
changes and so you must also submit a PR to change the client id in this application as well. In the production environment
this will be handled via an environment variable, but for local functionality and testing, the hard-coded value must be updated,
or you must set the environment variable `AWS_CLIENT_ID` to be the current client id.

Acknowledgements
----------

In addition to all the good people who have worked on [JQuery], [Lo-Dash],
Twitter's [Bootstrap], Twitter's [typeahead.js], [require.js], [dryice], and
more, all of whom made this simpler, special recognition needs to
go to the developers who have worked on [Ajax.org's Ace editor][ace] and
the fine individuals at [Zepheira].

Using `require.js`, `Ace`'s developers figured out a great way to bundle their code
into a single distributable.  `Ace`'s methods were studied and emulated, and when
that wasn't enough, their code was ported (with credit, of course, and those
snippets were ported only in support of building the package with `dryice`).  The
`Ace`'s devs also just have a really smart way of approaching this type of
javascript project.

In late 2013, and demoed at the American Library Association's Midwinter Conference,
Zepheira developed a prototype BIBFRAME Editor.  Although that project never moved
beyond an experimental phase, Zepheira's work was nevertheless extremely influential,
especially with respect to `bfe`'s UI design. (None of the code in `bfe` was ported
from Zepheira's prototype.)  Zepheira also developed the [BIBFRAME Profile
Specification][profilespec].

<!-- section links -->

[JQuery]: http://jquery.com/
[Lo-Dash]: http://lodash.com/
[Bootstrap]: http://getbootstrap.com/
[typeahead.js]: https://github.com/twitter/typeahead.js
[require.js]: http://requirejs.org/
[ace]: https://github.com/ajaxorg/ace
[Zepheira]: https://zepheira.com/
[profilespec]: http://bibframe.org/documentation/bibframe-profilespec/


Contributors
-----------

* [Jeremy Nelson](https://github.com/jermnelson)
* [Kevin Ford](https://github.com/kefo)
* [Kirk Hess](https://github.com/kirkhess)

[Index Data](http://indexdata.com/):
* [Charles Ledvina](https://github.com/cledvina)
* [Wayne Schneider](https://github.com/wafschneider)

Maintainer
-----------

* **LD4P2 Sinopia Project Team**
  * [GitHub](https://github.com/ld4p/)


License
-------

Unless otherwise noted, code that is originally developed by Stanford University
in the `Sinopia Editor` is licensed under the [Apache 2](https://www.apache.org/licenses/LICENSE-2.0).

Original `bfe` code is in the Public Domain.

http://creativecommons.org/publicdomain/zero/1.0/

**NOTE:**  `bfe` includes or depends on software from other open source projects, all or
most of which will carry their own license and copyright.  The Public Domain mark
stops at `bfe` original code and does not convey to these projects.

[BFE_GIT]: https://github.com/lcnetdev/bfe
[GIT_REPO]: https://github.com/LD4P/sinopia_editor
[REACT]: https://reactjs.org/
