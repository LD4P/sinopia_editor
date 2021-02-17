# Sinopia Weekly Dependency Updates

This is meant to be a guide to DLSS Infrastructure Team on how to do the weekly dependency update work for all the Sinopia related bits we maintain.

## Which Repos?

The repos that get weekly dependency updates:

(from https://github.com/sul-dlss/access-update-scripts/blob/master/infrastructure/projects)
- LD4P/sinopia_api
- LD4P/sinopia_editor
- LD4P/sinopia_exporter
- LD4P/sinopia_indexing_pipeline

## For Deployed Development Environment

After the automated dependency update PRs are merged (via script, usually - see [First Responder doc](https://github.com/sul-dlss/DeveloperPlaybook/blob/master/infrateam_first_responder.md#merge-em)), CircleCI will automatically build a docker image and push it to DockerHub.

(See https://github.com/sul-dlss/DevOpsDocs/blob/master/projects/sinopia/operations-concerns.md#development)

## For Stage and Production Environments

You do NOT need to create a github tagged release *issue* such as https://github.com/LD4P/sinopia_editor/issues/2755 for dependency updates.

### Tag a New Release for Each Repo

For each of the repos that get weekly dependency updates, after the update PRs are merged, you will need to create a new tagged release for each repository.  Creating a new tag will trigger CircleCI to build versioned docker images for our stage and production environments.

You can do this in a web browser with github releases -- just follow the pattern in each repo's existing releases and tags, creating the next "bug fix" semantic release number.

Note that CircleCI builds separate images for sinopia_editor (only) for stage and prod environments because we need different environment variable settings in the different environments.  (See https://github.com/sul-dlss/DevOpsDocs/blob/master/projects/sinopia/operations-concerns.md#staging)

### Check DockerHub For Tagged Releases

Check that there are docker images in DockerHub for all the new tags.

You will need to sign in to DockerHub and you may also need to make DockerHub do a different sort and then redo sort by "newest" to see the latest images at the top. (this is a DockerHub UI glitch.)

- https://hub.docker.com/repository/registry-1.docker.io/ld4p/sinopia_editor/tags?page=1&ordering=last_updated
  - this should have -stage and -prod flavors of your release, e.g.:
    - v3.5.16-prod
    - v3.5.16-stage
- https://hub.docker.com/repository/registry-1.docker.io/ld4p/sinopia_api/tags?page=1&ordering=last_updated
- https://hub.docker.com/repository/registry-1.docker.io/ld4p/sinopia_exporter/tags?page=1&ordering=last_updated
- https://hub.docker.com/repository/registry-1.docker.io/ld4p/sinopia_indexing_pipeline/tags?page=1&ordering=last_updated

### Create a terraform-aws PR for Ops

Example:  https://github.com/sul-dlss/terraform-aws/pull/741

You might follow up with a post to the ops-aws slack channel.

### Ensure the New Images Have Been Deployed

(someone else can write this part)
