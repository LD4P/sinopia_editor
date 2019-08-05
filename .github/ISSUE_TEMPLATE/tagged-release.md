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
- [ ] Once tagged release is live on https://development.sinopia.io, this ticket will be assigned to the product owner who will approve the tagged release for deployment on
  - [ ] Staging at https://stage.sinopia.io/
    - [ ] Create a new terraform PR for staging 
  - [ ] Production at https://sinopia.io
    - [ ] Create a new terraform PR for production
