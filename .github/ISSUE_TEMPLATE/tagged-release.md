---
name: Tagged Release
about: Steps for Tagged Release
title: Tagged Release Checklist
labels: ''
assignees: ''

---

- [ ] Update the version in *package.json*
- [ ] `npm i` to regenerate *package-lock.json*
- [ ] `npm publish` to publish the version to [npm registry](https://npmjs.com).
- [ ] Git annotated tag and push to Github
  - [ ] `git tag -a v{version} -m "{your message}"` to create an annotated tag 
  - [ ] `git push origin v{version}` to push up to the project's
   [releases](https://github.com/LD4P/sinopia_editor/releases)
- [ ] Docker build and publish tagged Image, see See [documentation](https://github.com/LD4P/sinopia_editor/#building-latest-docker-image) for more information
  - [ ] Build a tagged Docker image i.e. `docker build -t ld4p/sinopia_editor:{version} .`
  - [ ] Push the tagged version to Dockerhub with `docker push ld4p/sinopia_editor:{version}`
- [ ] Create Release notes for the tagged version on Github
- [ ] Once tagged release is live on https://development.sinopia.io, the project owner will approve the tagged release for deployment on
  - [ ] Staging at https://stage.sinopia.io/
  - [ ] Production at https://sinopia.io
