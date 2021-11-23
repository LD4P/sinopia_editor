import {
  getUserCount,
  getTemplateCount,
  getResourceCount,
} from "sinopiaMetrics"

// Saves global fetch in order to be restored after each test with mocked fetch
const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
})

const countResult = { count: 1 }

describe("getUserCount", () => {
  it("retrieves count", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(countResult),
      ok: true,
    })

    const result = await getUserCount()
    expect(result).toEqual(countResult)
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/metrics/userCount",
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    )
  })
})

describe("getTemplateCount", () => {
  it("retrieves count", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(countResult),
      ok: true,
    })

    const result = await getTemplateCount()
    expect(result).toEqual(countResult)
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/metrics/resourceCount/template",
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    )
  })
})

describe("getResourceCount", () => {
  it("retrieves count", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(countResult),
      ok: true,
    })

    const result = await getResourceCount()
    expect(result).toEqual(countResult)
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/metrics/resourceCount/resource",
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    )
  })
})
