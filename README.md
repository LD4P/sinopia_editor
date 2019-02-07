[![CircleCI](https://circleci.com/gh/LD4P/sinopia_editor.svg?style=svg)](https://circleci.com/gh/LD4P/sinopia_editor)
[![Coverage Status](https://coveralls.io/repos/github/LD4P/sinopia_editor/badge.svg?branch=master)](https://coveralls.io/github/LD4P/sinopia_editor?branch=master)


# Sinopia BIBFRAME Editor

Technical documentation specific to the Sinopia BIBFRAME Editor may also be found in the [wiki](https://github.com/LD4P/sinopia_editor/wiki/Sinopia-Editor). The [Sinopia Editor][GIT_REPO] homepage is available in staging at [stage.sinopia.io][staging]. The Sinopia Editor is a [React][REACT] application with all new user interfaces and functionality using React and the React ecosystem. Portions of the codebase originally extracted from the Library of Congress `bfe` [project][BFE_GIT].

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

## Running the code

`npm start`

Follow installation instructions, then run `npm start` or `node server.js` to start the web server using Express.
This will start up the code at [http://localhost:8000](http://localhost:8000).

The Sinopia Editor code is currently available via [sinopia.io](https://sinopia.io)

## Developers

- See `package.json` for npm package dependencies.
- The web server used is the `express` web framework for node.js
- React components are located in `src/components/` directory

### Run the server with webpack-dev-webserver

`npm run dev-start`

Runs the webpack-dev-server, allowing immediate loading of live code changes without having to restart the server. The webpack-dev-server is available on at [http://localhost:8080](http://localhost:8080).  
Note that running the webpack server does NOT call server.js

### Building with webpack

`npm run dev-build`  (no minimization)  or `npm run build` (with minimization)

We are using webpack as a build tool.  See `webpack.config.js` for build dependencies and configuration.

##### Running the server with express directory

`npm start` will spin up express directly.
The express server is available on at [http://localhost:8000](http://localhost:8000).  

>>>>>>> Update README and remove references to grunt
### Linter for JavaScript

`npm run eslint`

#### Generate a list of all eslint errors

```
npx eslint-takeoff
```

creates `.eslintrc-todo.yml` showing which linter rules give errors or warnings for each javascript file, per `.eslintrc.yml`

See https://www.npmjs.com/package/eslint-takeoff for more info.

### Test

Tests are written in jest, also utilizing puppeteer for end-to-end tests.  
To run them `npm test`.

#### Test coverage
To get coverage data, `npm run test-cov`.  Use a web browser to open `coverage/lcov-report/index.html`.  There is a project view and also a view of each file.  You can also check [coveralls](https://coveralls.io/repos/github/LD4P/sinopia_editor).

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

### Building latest Docker Image
Before building the latest Docker Image, run `npm run build` to update the `dist` folder with the current build.
To build the latest version of the [Sinopia Editor][GIT_REPO], you
can build with the
`docker build -t ld4p/sinopia_editor --no-cache=true .` command.

### Pushing Docker Image to Dockerhub
Run `docker login` and enter the correct credentials to your docker account.
Once successfully authenticated, run `docker push ld4p/sinopia_editor:latest`.
Ask a member on the DevOps team to go into the AWS console to udpate https://sinopia.io

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
to create/edit BIBFRAME data.  The current focus is to transform bfe into a production ready tool.

All contributions are welcome.  If you do not code, surely you will discover an
[issue] you can report.  

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
