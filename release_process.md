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
  - [ ] `npm publish` to publish the version to [npm registry](https://npmjs.com).
  - [ ] Commit changes to branch, push to github and create PR for this version bump.  (You can't push directly to main, since it's a protected branch).
  - [ ] _Once PR is merged:_ Publish a [new release](https://github.com/LD4P/sinopia_editor/releases/new) with a version like `v1.0.2` (release number matching what you put in package.json).
  - [ ] Wait for Circleci to complete building and pushing [docker images](https://hub.docker.com/repository/registry-1.docker.io/ld4p/sinopia_editor/tags?page=1&ordering=last_updated). (Refresh until you see your release - see note below.)
3. _If changes since last release:_ Create [Sinopia Indexing Pipeline](https://github.com/LD4P/sinopia_indexing_pipeline) release.
  - [ ] Publish a [new release](https://github.com/LD4P/sinopia_indexing_pipeline/releases/new) with a version like `v1.0.2`.
  - [ ] Wait for Circleci to complete building and pushing [docker images](https://hub.docker.com/repository/registry-1.docker.io/ld4p/sinopia_indexing_pipeline/tags?page=1&ordering=last_updated). (Refresh until you see your release - see note below.)
4. _If changes since last release:_ Create [Sinopia Exporter](https://github.com/LD4P/sinopia_exporter) release.
  - [ ] Publish a [new release](https://github.com/LD4P/sinopia_exporter/releases/new) with a version like `v1.0.2`.
  - [ ] Wait for Circleci to complete building and pushing [docker images](https://hub.docker.com/repository/registry-1.docker.io/ld4p/sinopia_exporter/tags?page=1&ordering=last_updated). (Refresh until you see your release - see note below.)
5. _If changes since last release:_ Create [Sinopia API](https://github.com/LD4P/sinopia_api) release.
  - [ ] Publish a [new release](https://github.com/LD4P/sinopia_api/releases/new) with a version like `v1.0.2`.
  - [ ] Wait for Circleci to complete building and pushing [docker images](https://hub.docker.com/repository/registry-1.docker.io/ld4p/sinopia_api/tags?page=1&ordering=last_updated). (Refresh until you see your release - see note below.)
6. _For dependency update release:_ Deploy
  - [ ] Update [container definitions for stage](https://github.com/sul-dlss/terraform-aws/tree/master/organizations/staging/sinopia/container_definitions). Make sure to update versions in `homepage.json`, `sinopia_api.json`, `sinopia_export.json`, `sinopia_indexing_pipeline.json`, and `sinopia_reindex.json`.
  - [ ] Follow [instructions](https://github.com/sul-dlss/terraform-aws/tree/master/organizations/staging/sinopia#deploying-a-release-to-staging) for pushing a release to AWS staging.
  - [ ] Wait for the containers to restart and verify that the deployment was successful. The displayed Sinopia Editor version should be the same as the version that you deployed.
  - [ ] Update [container definitions for production](https://github.com/sul-dlss/terraform-aws/tree/master/organizations/production/sinopia/container_definitions). Make sure to update versions in `homepage.json`, `sinopia_api.json`, `sinopia_export.json`, `sinopia_indexing_pipeline.json`, and `sinopia_reindex.json`.
  - [ ] Submit a new terraform PR. Include a note indicating that the update has been deployed to stage, but needs to be deployed to production.
7. _For other releases:_ Deploy
  - [ ] Update [container definitions for stage](https://github.com/sul-dlss/terraform-aws/tree/master/organizations/staging/sinopia/container_definitions). Make sure to update versions in `homepage.json`, `sinopia_api.json`, `sinopia_export.json`, `sinopia_indexing_pipeline.json`, and `sinopia_reindex.json`.
  - [ ] Follow [instructions](https://github.com/sul-dlss/terraform-aws/tree/master/organizations/staging/sinopia#deploying-a-release-to-staging) for pushing a release to AWS staging.
  - [ ] Wait for the containers to restart and verify that the deployment was successful. The displayed Sinopia Editor version should be the same as the version that you deployed.
  - [ ] Ask product owner to approve deploy to production. Not all releases will be deployed to production.
  - [ ] _If deploying to production_: Update [container definitions for production](https://github.com/sul-dlss/terraform-aws/tree/master/organizations/production/sinopia/container_definitions). Make sure to update versions in `homepage.json`, `sinopia_api.json`, `sinopia_export.json`, `sinopia_indexing_pipeline.json`, and `sinopia_reindex.json`.
  - [ ] Submit a new terraform PR. Include a note indicating that the update has been deployed to stage, but needs to be deployed to production.

## Notes
* If `package-lock.json` has links to unsecured `http://` registries, try deleting `package-lock.json`, remove the node modules `rm -rf ./node_modules`, run `npm cache clean --force`, and then run `npm i --prefer-online`.
* When naming a version, make sure to include the _v_: `v1.0.2`, NOT `1.0.2`.
* CircleCI builds separate images for Sinopia Editor (only) for stage and prod environments because we need different environment variable settings in the different environments.  (See https://github.com/sul-dlss/DevOpsDocs/blob/master/projects/sinopia/operations-concerns.md#staging)
* When waiting for a docker image to be available from Docker Hub, you will need to refresh the page to see updates. Otherwise, it will be a long wait.
* Example of a terraform PR: https://github.com/sul-dlss/terraform-aws/pull/741

## Development environment
For every change to main for each of the repositories, CircleCI will automatically build a docker image, push it to DockerHub, and update AWS. This will also be triggered when dependency update PRs are merged.

See https://github.com/sul-dlss/DevOpsDocs/blob/master/projects/sinopia/operations-concerns.md#development
