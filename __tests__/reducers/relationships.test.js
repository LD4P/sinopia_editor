import { setRelationships, clearRelationships } from "reducers/relationships"
import { createState } from "stateUtils"
import { createReducer } from "reducers/index"

const reducers = {
  SET_RELATIONSHIPS: setRelationships,
  CLEAR_RELATIONSHIPS: clearRelationships,
}

const reducer = createReducer(reducers)

const relationships = {
  bfAdminMetadataRefs: [
    "http://localhost:3000/resource/72f2f457-31f5-432c-8acf-b4037f7754g",
  ],
  bfItemRefs: [],
  bfInstanceRefs: [],
  bfWorkRefs: [
    "http://localhost:3000/resource/83f2f457-31f5-432c-8acf-b4037f7754h",
  ],
}

describe("setRelationships", () => {
  it("adds to state", () => {
    const oldState = createState()

    const action = {
      type: "SET_RELATIONSHIPS",
      payload: {
        resourceKey: "d7d40ac7",
        relationships,
      },
    }

    const newState = reducer(oldState.entities, action)

    expect(newState.relationships.d7d40ac7).toStrictEqual(relationships)
  })
})

describe("clearRelationships", () => {
  it("removes from state", () => {
    const oldState = createState()
    oldState.entities.relationships.d7d40ac7 = relationships

    const action = {
      type: "CLEAR_RELATIONSHIPS",
      payload: "d7d40ac7",
    }

    const newState = reducer(oldState.entities, action)

    expect(Object.keys(newState.relationships)).toHaveLength(0)
  })
})
