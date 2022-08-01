import { renderApp, createHistory } from "testUtils"
import { fireEvent, waitFor, screen } from "@testing-library/react"
import { featureSetup, resourceHeaderSelector } from "featureUtils"
import * as lookup from "utilities/Lookup"
import Config from "Config"

featureSetup()

const result1 = {
  authorityConfig: {
    uri: "urn:discogs",
    label: "Discogs",
    authority: "discogs",
    subauthority: "all",
    nonldLookup: true,
  },
  results: [
    {
      uri: "https://www.discogs.com/artist/130060-Shania-Twain",
      id: "130060",
      label: "Shania Twain",
      context: [
        {
          property: "Image URL",
          values: [
            "https://img.discogs.com/UEmmU0QMRdgs0al-anILSp7I9i0=/600x600…quality(90)/discogs-images/A-130060-1601173975-7025.jpeg.jpg",
          ],
        },
        {
          property: "Year",
          values: [""],
        },
        {
          property: "Record Labels",
          values: [""],
        },
        {
          property: "Formats",
          values: [""],
        },
        {
          property: "Type",
          values: ["artist"],
        },
      ],
    },
    {
      uri: "https://www.discogs.com/artist/2266242-Donald-Twain",
      id: "2266242",
      label: "Donald Twain",
      context: [
        {
          property: "Image URL",
          values: [
            "https://img.discogs.com/3a11940a0981896d8eafe3d3f3690e94440eda7d/images/spacer.gif",
          ],
        },
        {
          property: "Year",
          values: [""],
        },
        {
          property: "Record Labels",
          values: [""],
        },
        {
          property: "Formats",
          values: [""],
        },
        {
          property: "Type",
          values: ["artist"],
        },
      ],
    },
  ],
  totalHits: 4830,
}

const result2 = {
  authorityConfig: {
    uri: "urn:discogs:release",
    label: "Discogs Releases",
    authority: "discogs",
    subauthority: "release",
    nonldLookup: true,
  },
  results: [
    {
      uri: "https://www.discogs.com/Shania-Twain-Shania-Twain/master/132553",
      id: "132553",
      label: "Shania Twain - Shania Twain",
      context: [
        {
          property: "Image URL",
          values: [
            "https://img.discogs.com/v-Gvq7D2Sjxz9QtYt4rlcBNtkuY=/fit-in/…quality(90)/discogs-images/R-429801-1476775497-2961.jpeg.jpg",
          ],
        },
        {
          property: "Year",
          values: ["1993"],
        },
        {
          property: "Record Labels",
          values: [
            "Mercury",
            "PolyGram Records, Inc.",
            "PolyGram Records, Inc.",
            "PolyGram Group Canada Inc.",
            "PolyGram Group Canada Inc.",
            "Cinram",
          ],
        },
        {
          property: "Formats",
          values: ["CD", "Album"],
        },
        {
          property: "Type",
          values: ["master"],
        },
      ],
    },
  ],
  totalHits: 1,
}

const result3 = {
  authorityConfig: {
    uri: "urn:discogs:master",
    label: "Discogs Masters",
    authority: "discogs",
    subauthority: "master",
    nonldLookup: true,
  },
  results: [],
  totalHits: 0,
}

beforeEach(() => {
  lookup.getLookupResult = jest
    .fn()
    .mockResolvedValueOnce(result1)
    .mockResolvedValueOnce(result2)
    .mockResolvedValueOnce(result3)
})

jest.spyOn(Config, "maxRecordsForQALookups", "get").mockReturnValue(2)

describe("selecting a value from lookup", () => {
  const history = createHistory(["/editor/test:resource:DiscogsLookup"])

  it("allows manually entering a literal", async () => {
    lookup.getLookupResult = jest
      .fn()
      .mockResolvedValue({ results: [], totalHits: 0 })

    renderApp(null, history)

    await screen.findByText("Testing discogs lookup", {
      selector: resourceHeaderSelector,
    })

    const input = screen.getByPlaceholderText(
      "Enter lookup query for Instance of (lookup)"
    )

    fireEvent.change(input, { target: { value: "test" } })
    expect(input).toHaveValue("test")
    fireEvent.click(screen.getByTestId("Submit lookup"))

    // Lookup opens
    screen.getByTestId("test lookup", { selector: "div.lookup" })

    // Click Add Literal button
    fireEvent.click(await screen.findByText(/Add "test" as literal/))

    // Value added
    await screen.findByText("test", { selector: ".form-control" })

    // Lookup closes
    expect(screen.queryByTestId("test lookup")).not.toBeInTheDocument()
  })

  it("allows manually entering a uri", async () => {
    lookup.getLookupResult = jest
      .fn()
      .mockResolvedValue({ results: [], totalHits: 0 })

    renderApp(null, history)

    await screen.findByText("Testing discogs lookup", {
      selector: resourceHeaderSelector,
    })

    fireEvent.click(screen.getByText("Enter your own URI and label"))

    // Add a URI
    const uriInput = screen.getByPlaceholderText("Instance of (lookup)")
    fireEvent.change(uriInput, {
      target: { value: "http://id.loc.gov/authorities/names/n79032058" },
    })
    fireEvent.keyDown(uriInput, { key: "Enter", code: 13, charCode: 13 })

    const labelInput = screen.getByPlaceholderText(
      "Label for Instance of (lookup)"
    )
    fireEvent.change(labelInput, {
      target: { value: "Wittgenstein, Ludwig, 1889-1951" },
    })
    fireEvent.keyDown(labelInput, { key: "Enter", code: 13, charCode: 13 })

    // There is uri text.
    expect(
      screen.getByText("http://id.loc.gov/authorities/names/n79032058")
    ).toHaveClass("form-control")
    expect(screen.getByText("Wittgenstein, Ludwig, 1889-1951")).toHaveClass(
      "form-control"
    )
  })

  it("allows entering diacritics", async () => {
    renderApp(null, history)

    await screen.findByText("Testing discogs lookup", {
      selector: resourceHeaderSelector,
    })

    // Add a value
    const input = screen.getByPlaceholderText(
      "Enter lookup query for Instance of (lookup)"
    )

    // Yeah, these fireEvent's seem odd but they produce the desired effect.
    fireEvent.change(input, { target: { value: "Fo" } })
    fireEvent.keyDown(input, { key: "F", code: "KeyF", charCode: 70 })
    fireEvent.keyDown(input, { key: "o", code: "Keyo", charCode: 111 })
    expect(input).toHaveValue("Fo")

    // Click diacritic button
    expect(screen.queryAllByText("Latin")).toHaveLength(0)
    const diacriticBtn = screen.getByTestId("Select diacritics for Fo")
    fireEvent.click(diacriticBtn)

    // Click a diacritic
    await screen.findByText("Latin")
    fireEvent.change(screen.getByTestId("Select vocabulary"), {
      target: { value: "latin" },
    })
    fireEvent.click(await screen.findByText("ọ"))
    expect(input).toHaveValue("Foọ")

    // press backspace while the focus is on the diacritic panel and make sure we are still on the edit page
    fireEvent.keyDown(await screen.findByText("ọ"), {
      key: "Backspace",
      code: 8,
      charCode: 8,
    })
    expect(screen.queryAllByText("Latin")).toHaveLength(1)

    // Close it
    fireEvent.click(diacriticBtn)
    expect(screen.queryAllByText("Latin")).toHaveLength(0)
  })

  it("allows paging", async () => {
    const nextPageResult = {
      authorityConfig: {
        uri: "urn:discogs",
        label: "Discogs",
        authority: "discogs",
        subauthority: "all",
        nonldLookup: true,
      },
      results: [
        {
          uri: "https://www.discogs.com/artist/245720-Steve-Twain",
          id: "245720",
          label: "Steve Twain",
          context: [
            {
              property: "Image URL",
              values: [
                "https://img.discogs.com/LjA9Lu6ms4dTT9acCDWW2tYkjnE=/500x747…gb():quality(90)/discogs-images/A-245720-1153787863.jpeg.jpg",
              ],
            },
            {
              property: "Year",
              values: [""],
            },
            {
              property: "Record Labels",
              values: [""],
            },
            {
              property: "Formats",
              values: [""],
            },
            {
              property: "Type",
              values: ["artist"],
            },
          ],
        },
      ],
      totalHits: 4830,
    }

    lookup.getLookupResult = jest
      .fn()
      .mockResolvedValueOnce(result1)
      .mockResolvedValueOnce(result2)
      .mockResolvedValueOnce(result3)
      .mockResolvedValueOnce(nextPageResult)

    renderApp(null, history)

    await screen.findByText("Testing discogs lookup", {
      selector: resourceHeaderSelector,
    })

    const input = screen.getByPlaceholderText(
      "Enter lookup query for Instance of (lookup)"
    )

    fireEvent.change(input, { target: { value: "twain" } })
    expect(input).toHaveValue("twain")
    fireEvent.click(screen.getByTestId("Submit lookup"))

    // Lookup opens
    // expect(container.querySelector(".lookup")).toBeInTheDocument()
    screen.getByTestId("twain lookup", { selector: "div.lookup" })

    // Pagination only appears for 1 tab.
    await waitFor(() =>
      expect(screen.queryAllByTestId("pagination")).toHaveLength(1)
    )

    // Click next page
    fireEvent.click(screen.getByText("›", { selector: "button" }))

    // Next page appears
    await screen.findByText("Steve Twain")
  })

  it("allows selecting a lookup", async () => {
    renderApp(null, history)

    await screen.findByText("Testing discogs lookup", {
      selector: resourceHeaderSelector,
    })

    // List the authorities
    screen.getByText("Lookup with: Discogs, Discogs Releases, Discogs Masters")

    const input = screen.getByPlaceholderText(
      "Enter lookup query for Instance of (lookup)"
    )

    fireEvent.change(input, { target: { value: "twain" } })
    expect(input).toHaveValue("twain")
    fireEvent.click(screen.getByTestId("Submit lookup"))

    // Lookup opens
    screen.getByTestId("twain lookup", { selector: "div.lookup" })

    // Tabs appear
    await screen.findByText("Discogs Masters (0)")
    await screen.findByText("Discogs Releases (1)")
    await screen.findByText("Discogs (4830)")

    // Add the lookup
    fireEvent.click(
      screen.getByText("Shania Twain", { selector: ".context-heading" })
    )

    // Lookup closes
    expect(screen.queryByTestId("twain lookup")).not.toBeInTheDocument()

    // There is uri text.
    expect(
      screen.getByText("https://www.discogs.com/artist/130060-Shania-Twain")
    ).toHaveClass("form-control")
    expect(screen.getByText("Shania Twain")).toHaveClass("form-control")

    // Now remove it
    fireEvent.click(
      screen.getByTestId(
        "Remove https://www.discogs.com/artist/130060-Shania-Twain"
      )
    )

    // Value removed
    await waitFor(() =>
      expect(
        screen.queryByText(
          "https://www.discogs.com/artist/130060-Shania-Twain",
          {
            selector: ".form-control",
          }
        )
      ).not.toBeInTheDocument()
    )

    // Blank lookup
    expect(
      screen.getByPlaceholderText("Enter lookup query for Instance of (lookup)")
    ).toHaveValue("")
  })
})

describe("adding a template from Sinopia lookup", () => {
  const history = createHistory(["/editor/test:resource:SinopiaLookup"])

  it("clicking on button creates new editor tab with template", async () => {
    renderApp(null, history)

    await screen.findByText("Testing sinopia lookup", {
      selector: resourceHeaderSelector,
    })

    // Click Create New button
    fireEvent.click(await screen.findByText(/Create New/))

    // Click on available template button
    fireEvent.click(
      await screen.getAllByRole("button", {
        name: /testing wikidata lookup \(test:resource:wikidatalookup\)/i,
      })[0]
    )

    // New tab with template is now present
    await screen.findByText("Testing wikidata lookup", {
      selector: "a.tab-link span",
    })
  }, 10000)
})
