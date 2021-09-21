export const lookupOptionsRetrieved = (uri, lookup) => ({
  type: "LOOKUP_OPTIONS_RETRIEVED",
  payload: {
    uri,
    lookup,
  },
})

export const noop = () => {}
