module.exports = (path, options) => {
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(path, {
    ...options,
    // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
    packageFilter: (pkg) => {
      // This is a workaround for https://github.com/uuidjs/uuid/pull/616
      //
      // jest-environment-jsdom 28+ tries to use browser exports instead of default exports,
      // but uuid and nanoid only offers an ESM browser export and not a CommonJS one. Jest does not yet
      // support ESM modules natively, so this causes a Jest error related to trying to parse
      // "export" syntax.
      //
      // This workaround prevents Jest from considering uuid and nanoid's module-based exports at all;
      // it falls back to uuid's CommonJS+node "main" property.
      //
      // This is based on https://github.com/microsoft/accessibility-insights-web/pull/5421/commits/9ad4e618019298d82732d49d00aafb846fb6bac7
      // See https://github.com/microsoft/accessibility-insights-web/pull/5421#issuecomment-1109168149
      if (pkg.name === "nanoid" || pkg.name === "uuid") {
        delete pkg.exports
        delete pkg.module
      }
      return pkg
    },
  })
}
