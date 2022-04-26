# Sinopia Release Process

This is meant to be a guide to DLSS Infrastructure Team on how to release Sinopia to stage and production. This includes the Sinopia Editor and related components (e.g., Sinopia API).

These instructions apply for major releases and dependency updates.

## Checklist
1. _Skip for a dependency update:_ Product owner prepares release notes.
  - [ ] Updates `NewsItem.js` component.
  - [ ] Sinopia [Wiki](https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next)
2. Create Sinopia Editor release.
  - [ ] Pull latest main.
  - [ ] Check out a branch.
  - [ ] Update the version in *package.json*
  - [ ] `npm i` to regenerate *package-lock.json* (see note below)
  - [ ] Commit changes to branch, push to github and create PR for this version bump.  (You can't push directly to main, since it's a protected branch).
  - [ ] _Once PR is merged:_ Publish a [new release](https://github.com/LD4P/sinopia_editor/releases/new) with a version like `v1.0.2` (release number matching what you put in package.json).
3. _If changes since last release:_ Create [Sinopia Indexing Pipeline](https://github.com/LD4P/sinopia_indexing_pipeline) release.
  - [ ] Publish a [new release](https://github.com/LD4P/sinopia_indexing_pipeline/releases/new) with a version like `v1.0.2`.
4. _If changes since last release:_ Create [Sinopia Exporter](https://github.com/LD4P/sinopia_exporter) release.
  - [ ] Publish a [new release](https://github.com/LD4P/sinopia_exporter/releases/new) with a version like `v1.0.2`.
5. _If changes since last release:_ Create [Sinopia API](https://github.com/LD4P/sinopia_api) release.
  - [ ] Publish a [new release](https://github.com/LD4P/sinopia_api/releases/new) with a version like `v1.0.2`.
6. _If changes since last release:_ Create [RDF2MARC](https://github.com/LD4P/rdf2marc) release.
  - [ ] Publish a [new release](https://github.com/LD4P/rdf2marc/releases/new) with a version like `v1.0.2`.

## Notes
* If `package-lock.json` has links to unsecured `http://` registries, try deleting `package-lock.json`, remove the node modules `rm -rf ./node_modules`, run `npm cache clean --force`, and then run `npm i --prefer-online`.
* When naming a version, make sure to include the _v_: `v1.0.2`, NOT `1.0.2`.
* Creating a new release will trigger CircleCI to build a docker image, push it to DockerHub, and update AWS for stage and production.

## Create a release from a beta release
1. Get the commit hash for the beta release.
2. From the commandline, create a new tag: `git tag v3.2.0 ba99a63`
3. Push the tag, `git push origin v3.2.0`.
4. Publish a new release, selecting the newly created tag.

## Staging environment
To deploy to stage only, append `-beta` to the version. For example, `v1.0.2-beta`.

## Development environment
For every change to main for each of the repositories, CircleCI will automatically build a docker image, push it to DockerHub, and update AWS. This will also be triggered when dependency update PRs are merged.

See https://github.com/sul-dlss/DevOpsDocs/blob/master/projects/sinopia/operations-concerns.md#development
