[![CircleCI](https://circleci.com/gh/LD4P/sinopia_editor.svg?style=svg)](https://circleci.com/gh/LD4P/sinopia_editor)
[![Coverage Status](https://coveralls.io/repos/github/LD4P/sinopia_editor/badge.svg?branch=master)](https://coveralls.io/github/LD4P/sinopia_editor?branch=master)

# LD4P's BIBFRAME Editor

forked from https://github.com/lcnetdev/bfe

## Overview
From lcnetdev description: `bfe` is a standalone Editor for the Library of Congress's [Bibliographic Framework
(BIBFRAME) Initiative][bfi].  It can be used more generically as an editor for RDF data.
`bfe` uses [BIBFRAME Profiles][profilespec] to render an HTML/UI input form; it is
capable of integrating 'lookup' services, which query data from external Web APIs;
and implementers can define the input and extract the output.
...
From a design standpoint, the objective with `bfe` was to create the simplest
'pluggable' form editor one can to maximize experimental implementer's abilities
to create/edit BIBFRAME data.  The current focus is to transform bfe into a production ready tool.

# Sinopia BIBFRAME Editor

Technical documentation specific to the Sinopia BIBFRAME Editor may also be found in the [wiki](https://github.com/LD4P/sinopia_editor/wiki/Sinopia-Editor).

## Installation (without docker image)

### Prerequisites
* `node.js` JavaScript runtime https://nodejs.org/en/download/
* `npm` JavaScript package manager https://www.npmjs.com/

### Installation Instructions
1.  Install [node.js](https://nodejs.org/en/download/)
2.  Install [npm](https://www.npmjs.com/)
3.  Run `npm init`, and follow the instructions that appear.
4.  Get latest npm: `npm install -g npm@latest`
5.  Run `npm install grunt-cli` to install grunt-cli.
6.  Run `npm install`. This installs everything needed for the build to run successfully.
7.  Run `grunt` to build the code.

## Running the code

Follow installation instructions, then run `node server-bfe.js`.  This will start up the editor at http://localhost:8000

## Developers

- See `package.json` for npm package dependencies.
- The web server used is `express` web framework for node.js

### Build with grunt

The javascript code uses grunt as a build tool. See `Gruntfile.js` for build dependencies and configuration.

- To build the code, `grunt` or `npm run grunt`

### Linter for JavaScript

`npm run eslint`

#### Generate a list of all eslint errors

```
npx eslint-takeoff
```

creates `.eslintrc-todo.yml` showing which linter rules give errors or warnings for each javascript file, per `.eslintrc.yml`

See https://www.npmjs.com/package/eslint-takeoff for more info.

### test

Tests are written in jest, also utilizing puppeteer for end-to-end tests.  To run them `npm test`.

#### test coverage
To get coverage data, `npm run test-cov`.  Use a web browser to open `coverage/lcov-report/index.html`.  There is a project view and also a view of each file.  You can also check [coveralls](https://coveralls.io/repos/github/LD4P/sinopia_editor).

### static analysis

We use plato (actually es6-plato) to get static analysis info such as code complexity, etc.  `npm run analysis` will create a folder `static-analysis`; use a web browser to open `static-analysis/index.html`.  There is a project view and also a view of each file.

### continuous integration

We use [circleci](https://circleci.com/gh/Ld4p/sinopia_profile_editor).  The steps are in `.circleci/config.yml`.

In the "artifacts" tab of a particular build, you can look at code coverage (`coverage/lcov-report/index.html`) and at static analysis output (`static-analysis/index.html`).


# lcnetdev info below

This repository includes a development example, a "production" example, and
various BIBFRAME Profiles with which to begin experimenting. In order
to get started with `bfe` quickly and easily, there are two main aspects of `bfe`:
a javascript library and an accompanying CSS file.  The packaged javascript
library bundles a few additional libraries, some of which are [JQuery], [Lo-Dash],
elements from Twitter's [Bootstrap.js][Bootstrap], and
Twitter's [typeahead.js].  The CSS bundle includes mostly elements of
Twitter's [Bootstrap] and a few additional custom CSS declarations.

<!-- section links -->

[demo-page]: http://bibframe.org/bibliomata/bfe/index.html
[ontology]: http://id.loc.gov/ontologies/bibframe/
[bfi]: http://www.loc.gov/bibframe/
[profilespec]: http://bibframe.org/documentation/bibframe-profilespec/

Getting Started
---------------
`bfe` is currently submodule of [recto](http://github.com/lcnetdev/recto), an express-based webserver, which uses [verso](http://github.com/lcnetdev/verso) a loopback-based server for backend data. The current recommendation is to install recto and verso and use bfe as part of the demonstration environment.

`bfe` can be run as a demo or development version using a simple express-based server - found in the main `bfe` directory -
that ships with `bfe`:

```bash
node server-bfe.js
```


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


Roadmap
----------
v0.2.x
* Support LC Bibframe Pilot
* Request.js has been deprecated
* Dryice build has been replaced with Grunt.

v0.3.x
* Implement BF 2.0 Ontology
* LC Bibframe Pilot 2.0 support.
* Implement save/load api

v0.4.x
* Additional features to support LC Bibframe Pilot 2.0
* Additional features to support requirements for LD4P2

v1.x
* Support for LD4P2 requirements
* Refactor into MVC
* Implement common javascript framework (React, Angular, etc)
* Implement automated testing.


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
[dryice]: https://github.com/mozilla/dryice
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

* **Kirk Hess**
  * [GitHub](https://github.com/kirkhess)


License
-------

Unless otherwise noted, code that is original to `bfe` is in the Public Domain.

http://creativecommons.org/publicdomain/mark/1.0/

**NOTE:**  `bfe` includes or depends on software from other open source projects, all or
most of which will carry their own license and copyright.  The Public Domain mark
stops at `bfe` original code and does not convey to these projects.
