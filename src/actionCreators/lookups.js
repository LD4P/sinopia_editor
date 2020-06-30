import { selectLookup } from 'selectors/lookups'
import { lookupOptionsRetrieved } from 'actions/lookups'
import shortid from 'shortid'

// A thunk that fetches a lookup, transforms it, and adds to state.
export const fetchLookup = (uri) => (dispatch, getState) => {
  const existingLookup = selectLookup(getState(), uri)
  if (existingLookup) {
    return existingLookup
  }
  const url = `${uri}.json`
  return fetch(url)
    .then((resp) => resp.json())
    .then((json) => responseToOptions(json))
    .then((opts) => {
      dispatch(lookupOptionsRetrieved(uri, opts))
      return opts
    })
    .catch((err) => {
      console.error(`Error fetching ${url}: ${err.toString()}`)
      const opts = [{
        isError: true,
      }]
      dispatch(lookupOptionsRetrieved(uri, opts))
      return opts
    })
}

const responseToOptions = (json) => {
  const opts = []
  for (const i in json) {
    try {
      const newId = shortid.generate()
      const item = Object.getOwnPropertyDescriptor(json, i)
      const uri = item.value['@id']
      const labels = item.value['http://www.loc.gov/mads/rdf/v1#authoritativeLabel']
      labels.forEach((label) => opts.push({ id: newId, label: label['@value'], uri }))
    } catch (err) {
      // Ignore
    }
  }
  return opts
}

export const noop = () => {}