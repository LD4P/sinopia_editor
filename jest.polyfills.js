// Polyfill globals needed by dependencies in the jsdom test environment

if (typeof globalThis.setImmediate === "undefined") {
  globalThis.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args)
  globalThis.clearImmediate = (id) => clearTimeout(id)
}

// TextEncoder/TextDecoder are needed by undici (used by @digitalbazaar/http-client)
// eslint-disable-next-line import/newline-after-import
const { TextEncoder, TextDecoder } = require("util")
if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder
}
