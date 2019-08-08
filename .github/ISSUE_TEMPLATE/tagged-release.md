---
name: Tagged Release
about: Steps for Tagged Release
title: Tagged Release Checklist
labels: ''
assignees: ''

---

- [ ] Update the version in *package.json*
- [ ] `npm i` to regenerate *package-lock.json*
- [ ] Create a feature branch in git for the version (suggest `patch-{verson}`)
- [ ] `npm publish` to publish the version to [npm registry](https://npmjs.com).
- [ ] Product owner assigned Release notes
  - [ ] Updates `NewsItem.js` component, creates commit on feature branch.
  - [ ] Sinopia [Wiki](https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next)
- [ ] Feature branch merged and circle-ci has successfully pushed new builds for
      the `latest`, `stage`, and `prod` to docker hub.
- [ ] Git annotated tag and push to Github
  - [ ] `git tag -a v{version} -m "{your message}"` to create an annotated tag
  - [ ] `git push origin v{version}` to push up to the project's
   [releases](https://github.com/LD4P/sinopia_editor/releases)
- [ ] Dockerhub Images Management
  - [ ] Pull latest **stage** and **prod** images
    - [ ] `docker pull ld4p/sinopia_editor:stage`
    - [ ] `docker pull ld4p/sinopia_editor:prod`
  - [ ] Tag **stage** and **prod** images with version
    - [ ] `docker tag ld4p/sinopia_editor:stage ld4p/sinopia_editor:{version}-stage`
    - [ ] `docker tag ld4p/sinopia_editor:prod ld4p/sinopia_editor:{version}-prod`
  - [ ] Push the tagged versions to Dockerhub
    - [ ] `docker push ld4p/sinopia_editor:{version}-stage`
    - [ ] `docker push ld4p/sinopia_editor:{version}-prod`
- [ ] AWS Images for supporting projects - the Sinopia stack requires
  a number of other projects to run successfully both locally and on AWS. If any of
  these projects changed between tagged releases, you will need to update and tag the
  latest image on Dockerhub along with corresponding update to Terraform with the tagged
  release.
  - [ ] Sinopia ACL https://github.com/LD4P/sinopia_acl
    - [ ] Download the latest image `docker pull ld4p/sinopia_acl:latest`
    - [ ] Create a tagged version `docker tag ld4p/sinopia_acl:latest ld4p/sinopia_acl:{version}`
    - [ ] Push new tagged version `docker push ld4p/sinopia_acl:{version}`
    - [ ] Update Terraform with the new tagged version and create PR
  - [ ] Sinopia Indexing Pipeline https://github.com/LD4P/sinopia_indexing_pipeline
    - [ ] Download the latest image `docker pull ld4p/sinopia_indexing_pipeline:latest`
    - [ ] Create a tagged version `docker tag ld4p/sinopia_indexing_pipeline:latest ld4p/sinopia_indexing_pipeline:{version}`
    - [ ] Push new tagged version `docker push ld4p/sinopia_indexing_pipeline:{version}`
    - [ ] Update Terraform with the new tagged version and create PR
- [ ] Once tagged release is live on https://development.sinopia.io, this ticket will be assigned to the product owner who will approve the tagged release for deployment on
  - [ ] Staging at https://stage.sinopia.io/
    - [ ] Create a new terraform PR for staging
  - [ ] Production at https://sinopia.io
    - [ ] Create a new terraform PR for production
