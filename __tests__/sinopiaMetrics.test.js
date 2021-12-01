import {
  getUserCount,
  getTemplateCount,
  getResourceCount,
  getTemplateCreatedCount,
  getResourceCreatedCount,
  getTemplateEditedCount,
  getResourceEditedCount,
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

describe("getTemplateCreatedCount", () => {
  it("retrieves count", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(countResult),
      ok: true,
    })

    const result = await getTemplateCreatedCount({
      startDate: "2021-01-01",
      endDate: "2022-01-01",
      group: "stanford",
      ignore: "me",
    })
    expect(result).toEqual(countResult)
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/metrics/createdCount/template?startDate=2021-01-01&endDate=2022-01-01&group=stanford",
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    )
  })
})

describe("getResourceCreatedCount", () => {
  it("retrieves count", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(countResult),
      ok: true,
    })

    const result = await getResourceCreatedCount({
      startDate: "2021-01-01",
      endDate: "2022-01-01",
    })
    expect(result).toEqual(countResult)
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/metrics/createdCount/resource?startDate=2021-01-01&endDate=2022-01-01",
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    )
  })
})

describe("getTemplateEditedCount", () => {
  it("retrieves count", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(countResult),
      ok: true,
    })

    const result = await getTemplateEditedCount({
      startDate: "2021-01-01",
      endDate: "2022-01-01",
      group: "stanford",
      ignore: "me",
    })
    expect(result).toEqual(countResult)
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/metrics/editedCount/template?startDate=2021-01-01&endDate=2022-01-01&group=stanford",
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    )
  })
})

describe("getResourceEditedCount", () => {
  it("retrieves count", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(countResult),
      ok: true,
    })

    const result = await getResourceEditedCount({
      startDate: "2021-01-01",
      endDate: "2022-01-01",
    })
    expect(result).toEqual(countResult)
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/metrics/editedCount/resource?startDate=2021-01-01&endDate=2022-01-01",
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    )
  })
})
