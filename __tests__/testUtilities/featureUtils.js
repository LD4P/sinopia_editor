import Config from "Config"
import * as sinopiaApi from "sinopiaApi"
import * as sinopiaSearch from "sinopiaSearch"

export const featureSetup = (opts = {}) => {
  jest.spyOn(Config, "useResourceTemplateFixtures", "get").mockReturnValue(true)
  jest.spyOn(Config, "useLanguageFixtures", "get").mockReturnValue(true)
  // Mock out document.elementFromPoint used by useNavigableComponent.
  global.document.elementFromPoint = jest.fn()
  // Mock out scrollIntoView used by useNavigableComponent. See https://github.com/jsdom/jsdom/issues/1695
  Element.prototype.scrollIntoView = jest.fn()
  window.scrollTo = jest.fn()
  // Mock out so does not try to update API.
  if (!opts.noMockSinopiaApi)
    jest.spyOn(sinopiaApi, "putUserHistory").mockResolvedValue()
  if (!opts.noMockSinopiaSearch)
    jest
      .spyOn(sinopiaSearch, "getSearchResultsByUris")
      .mockResolvedValue({ results: [] })
}

export const noop = () => {}
