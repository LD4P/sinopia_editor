// Copyright 2019 Stanford University see LICENSE for license

import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import reducer from "./reducers/index"

export const initialState = {
  authenticate: {
    user: undefined,
  },
  editor: {
    // The state of the editor
    copyToNewMessage: {
      oldUri: null,
      timestamp: null,
    },
    currentResource: undefined,
    currentPreviewResource: undefined,
    currentComponent: {},
    currentModal: undefined,
    currentLangModalValue: undefined, // the value key of the value to be displayed in the InputLang modal.
    currentDiff: {
      compareFrom: undefined,
      compareTo: undefined,
    },
    errors: {}, // {<error key>: [errors...]} or {<error key>: {<resourceKey>: [errors...]}}
    lastSave: {}, // {<resourceKey>: date}
    resources: [], // Subject keys for open resources
    resourceValidation: {}, // Show validation {<resourceKey>: boolean}
    unusedRDF: {}, // {<resourceKey>: rdf}
  },
  entities: {
    languageLookup: [],
    languages: {},
    scriptLookup: [],
    scripts: {},
    transliterations: {},
    transliterationLookup: [],
    groupMap: {},
    lookups: {},
    exports: [],
    properties: {},
    propertyTemplates: {},
    relationships: {}, // Inferred relationship loaded from API: {<resourceKey>: {bfAdminMetadataRefs, bfItemRefs, bfInstanceRefs, bfWorkRefs}
    subjects: {},
    subjectTemplates: {},
    values: {},
    versions: {}, // {<resourceKey>: [versions...]}
  },
  history: {
    templates: [],
    searches: [],
    resources: [],
  },
  search: {
    // Search model:
    // {
    //   results: [],
    //   totalResults: 0,
    //   facetResults: {},
    //   relationshipResults: {}
    //   query: undefined,
    //   options: {
    //     resultsPerPage: Config.searchResultsPerPage,
    //     startOfRange: 0, // 0 based
    //     sortField: undefined,
    //     sortOrder: undefined,
    //     typeFilter: undefined,
    //     groupFilter: undefined,
    //   },
    //   error: undefined,
    // },
    resource: null,
    template: null,
  },
}

let composeEnhancers

if (process.env.NODE_ENV === "development") {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
} else {
  composeEnhancers = compose
}

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
)

export default store
