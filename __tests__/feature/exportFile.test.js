import { renderApp, createHistory } from "testUtils"
import { screen } from "@testing-library/react"
import Config from "Config"

describe("downloading a file that was exported from Sinopia AWS", () => {
  const history = createHistory(["/exports"])

  it("has a list of the downloadable zip files that were built", () => {
    renderApp(null, history)

    const link1 = screen.getByText(
      "sinopia_export_all_2020-01-01T00:00:00.000Z.zip"
    )
    const link2 = screen.getByText("stanford_2020-01-01T00:00:00.000Z.zip")

    expect(link1.href).toBe(
      `${Config.exportBucketUrl}/sinopia_export_all_2020-01-01T00:00:00.000Z.zip`
    )

    expect(link2.href).toBe(
      `${Config.exportBucketUrl}/stanford_2020-01-01T00:00:00.000Z.zip`
    )
  })
})
