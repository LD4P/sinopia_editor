import { clearLocalIds, setLocalId } from "reducers/transfer"
import { createReducer } from "reducers/index"

const handlers = {
  CLEAR_LOCAL_IDS: clearLocalIds,
  SET_LOCAL_ID: setLocalId,
}
const reducer = createReducer(handlers)

describe("clearLocalIds", () => {
  it("removes local ids for resource", () => {
    const oldState = {
      localIds: {
        abc123: {
          FOLIO: {
            stanford: "123456",
          },
        },
        def456: {
          FOLIO: {
            stanford: "234567",
          },
        },
      },
    }
    const action = {
      type: "CLEAR_LOCAL_IDS",
      payload: "abc123",
    }

    const newState = reducer(oldState, action)
    expect(newState).toStrictEqual({
      localIds: {
        def456: {
          FOLIO: {
            stanford: "234567",
          },
        },
      },
    })
  })
})

describe("setLocalId", () => {
  describe("when resource does not have existing local ids", () => {
    it("adds local ids for resource", () => {
      const oldState = {
        localIds: {},
      }
      const action = {
        type: "SET_LOCAL_ID",
        payload: {
          resourceKey: "abc123",
          target: "FOLIO",
          group: "stanford",
          localId: "123456",
        },
      }

      const newState = reducer(oldState, action)
      expect(newState).toStrictEqual({
        localIds: {
          abc123: {
            FOLIO: {
              stanford: "123456",
            },
          },
        },
      })
    })
  })

  describe("when resource has existing local ids", () => {
    it("appends local ids for resource", () => {
      const oldState = {
        localIds: {
          abc123: {
            SYMPHONY: {
              stanford: "234567",
            },
          },
        },
      }
      const action = {
        type: "SET_LOCAL_ID",
        payload: {
          resourceKey: "abc123",
          target: "FOLIO",
          group: "stanford",
          localId: "123456",
        },
      }

      const newState = reducer(oldState, action)
      expect(newState).toStrictEqual({
        localIds: {
          abc123: {
            SYMPHONY: {
              stanford: "234567",
            },
            FOLIO: {
              stanford: "123456",
            },
          },
        },
      })
    })
  })
})
