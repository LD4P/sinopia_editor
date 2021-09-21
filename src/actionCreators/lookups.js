import { selectLookup } from "selectors/lookups"
import { lookupOptionsRetrieved } from "actions/lookups"
import { nanoid } from "nanoid"
import _ from "lodash"

// A thunk that fetches a lookup, transforms it, and adds to state.
export const fetchLookup = (uri) => (dispatch, getState) => {
  const existingLookup = selectLookup(getState(), uri)
  if (existingLookup) {
    return existingLookup
  }

  if (uri.startsWith("file:")) return dispatch(fetchFileLookup(uri))

  return dispatch(fetchHttpLookup(uri))
}

const fetchFileLookup = (uri) => (dispatch) => {
  /* eslint security/detect-non-literal-require: 'off' */
  const lookupJson = require(`../../static/${uri.substring(6)}`)
  const opts = lookupJson.map((authority) => ({
    id: nanoid(),
    label: authority.label,
    uri: authority.uri,
  }))
  dispatch(lookupOptionsRetrieved(uri, opts))
  return opts
}

const fetchHttpLookup = (uri) => (dispatch) => {
  const url = `${uri}.json`
  return fetch(url)
    .then((resp) => resp.json())
    .then((json) => responseToOptions(json))
    .then((opts) => {
      dispatch(lookupOptionsRetrieved(uri, opts))
      return opts
    })
    .catch((err) => {
      console.error(`Error fetching ${url}: ${err.message || err}`)
      const opts = [
        {
          isError: true,
        },
      ]
      dispatch(lookupOptionsRetrieved(uri, opts))
      return opts
    })
}

const responseToOptions = (json) => {
  const opts = []
  for (const i in json) {
    try {
      const newId = nanoid()
      const item = Object.getOwnPropertyDescriptor(json, i)
      const uri = item.value["@id"]
      const labels =
        item.value["http://www.loc.gov/mads/rdf/v1#authoritativeLabel"]
      labels.forEach((label) =>
        opts.push({ id: newId, label: label["@value"], uri })
      )
    } catch (err) {
      // Ignore
    }
  }

  return _.uniqBy(opts, (opt) => opt.uri)
}

export const noop = () => {}
