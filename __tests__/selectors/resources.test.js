import { createState } from "stateUtils"
import {
  selectSubject,
  selectProperty,
  selectValue,
  selectFullSubject,
  resourceHasChangesSinceLastSave,
  selectResourceUriMap,
  selectResourceGroup,
} from "selectors/resources"

describe("selectSubject()", () => {
  it("returns null when no match", () => {
    const state = createState()
    expect(selectSubject(state, "abc123")).toBeNull()
  })

  it("returns subject", () => {
    const state = createState({ hasResourceWithNestedResource: true })
    expect(selectSubject(state, "ljAblGiBW")).toBeSubject("ljAblGiBW")
  })
})

describe("selectProperty()", () => {
  it("returns null when no match", () => {
    const state = createState()
    expect(selectProperty(state, "abc123")).toBeNull()
  })

  it("returns property", () => {
    const state = createState({ hasResourceWithNestedResource: true })
    expect(selectProperty(state, "v1o90QO1Qx")).toBeProperty("v1o90QO1Qx")
  })
})

describe("selectValue()", () => {
  it("returns null when no match", () => {
    const state = createState()
    expect(selectValue(state, "abc123")).toBeNull()
  })

  it("returns value", () => {
    const state = createState({ hasResourceWithNestedResource: true })
    const value = selectValue(state, "VDOeQCnFA8")
    expect(value).toBeValue("VDOeQCnFA8")
  })
})

describe("selectFullSubject()", () => {
  it("returns null when no match", () => {
    const state = createState()
    expect(selectFullSubject(state, "abc123")).toBeNull()
  })

  it("returns subject and all descendants", () => {
    const state = createState({ hasResourceWithNestedResource: true })
    const subject = selectFullSubject(state, "ljAblGiBW")
    expect(subject).toBeSubject("ljAblGiBW")
    expect(subject.properties).toHaveLength(1)
    const property = subject.properties[0]
    expect(property).toBeProperty("v1o90QO1Qx")
    expect(property.values).toHaveLength(1)
    const value = property.values[0]
    expect(value).toBeValue("VDOeQCnFA8")
    const nestedSubject = value.valueSubject
    expect(nestedSubject).toBeSubject("XPb8jaPWo")
    expect(nestedSubject.properties).toHaveLength(1)
    const nestedProperty = nestedSubject.properties[0]
    expect(nestedProperty).toBeProperty("7caLbfwwle")
    expect(nestedProperty.values).toHaveLength(1)
    const nestedValue = nestedProperty.values[0]
    expect(nestedValue).toBeValue("pRJ0lO_mT-")
  })
})

describe("resourceHasChangesSinceLastSave", () => {
  it("returns changed for currentResource if key not provided", () => {
    const state = createState({ hasResourceWithNestedResource: true })
    state.entities.subjects.ljAblGiBW.changed = true
    expect(resourceHasChangesSinceLastSave(state)).toBe(true)
  })
  it("returns changed for provided resource", () => {
    const state = createState({ hasResourceWithNestedResource: true })
    state.entities.subjects.ljAblGiBW.changed = true
    expect(resourceHasChangesSinceLastSave(state, "ljAblGiBW")).toBe(true)
  })
})

describe("selectResourceUriMap", () => {
  it("returns map of URIs to keys", () => {
    const state = createState({ hasTwoLiteralResources: true })
    state.entities.subjects.t9zVwg2zO.uri =
      "http://localhost:3000/resource/f383bfff-5364-47a3-a081-8c9e2d79f43f"
    state.entities.subjects.u0aWxh3a1.uri =
      "http://localhost:3000/resource/g493bfff-5364-47a3-a081-8c9e2d79f5fg"
    expect(selectResourceUriMap(state)).toEqual({
      "http://localhost:3000/resource/f383bfff-5364-47a3-a081-8c9e2d79f43f":
        "t9zVwg2zO",
      "http://localhost:3000/resource/g493bfff-5364-47a3-a081-8c9e2d79f5fg":
        "u0aWxh3a1",
    })
  })
})

describe("selectResourceGroup", () => {
  it("returns groups", () => {
    const state = createState({ hasResourceWithNestedResource: true })
    expect(selectResourceGroup(state, "ljAblGiBW")).toEqual({
      group: "stanford",
      editGroups: ["cornell"],
    })
  })
})
