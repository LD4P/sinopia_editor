import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import * as sinopiaApi from "sinopiaApi"
import { featureSetup, resourceHeaderSelector } from "featureUtils"

featureSetup()

describe("requesting MARC", () => {
  const marcJobUrl = "http://fake/job"
  const marcUrl = "http://fake/marc"
  const marc = "fake marc"

  describe("when processing occurs without error", () => {
    const history = createHistory([
      "/editor/resource/a5c5f4c0-e7cd-4ca5-a20f-2a37fe1080d5",
    ])

    beforeEach(() => {
      jest.spyOn(sinopiaApi, "postMarc").mockResolvedValue(marcJobUrl)
      jest.spyOn(sinopiaApi, "getMarcJob").mockResolvedValue([marcUrl, marc])
    })

    it("retrieves the MARC", async () => {
      renderApp(null, history)

      await screen.findByText("Instance1", { selector: resourceHeaderSelector })

      fireEvent.click(screen.getByText("MARC"))
      fireEvent.click(screen.getByText("Request conversion to MARC"))

      await screen.findByText(/Requesting MARC/)

      fireEvent.click(await screen.findByText("MARC"))
      fireEvent.click(screen.getByText("View MARC"))

      // Modal opens.
      await screen.findByText(marc)
      screen.getByText(/Copy MARC/, { selector: "button" })
    })
  })

  describe("when processing occurs with an error", () => {
    const history = createHistory([
      "/editor/resource/a5c5f4c0-e7cd-4ca5-a20f-2a37fe1080d5",
    ])

    beforeEach(() => {
      jest.spyOn(sinopiaApi, "postMarc").mockRejectedValue("Ooops")
    })

    it("displays the alert", async () => {
      renderApp(null, history)

      await screen.findByText("Instance1", { selector: resourceHeaderSelector })

      fireEvent.click(screen.getByText("MARC"))
      fireEvent.click(screen.getByText("Request conversion to MARC"))

      await screen.findByText(/Error requesting MARC: Ooops/)
    })
  })
})
