import { renderApp, createHistory } from "testUtils"
import { screen } from "@testing-library/react"
import { featureSetup } from "featureUtils"

featureSetup()

describe("getting property related info from a resource", () => {
  it("has tooltip text info or a link based on the content of a top-level property remark", async () => {
    const history = createHistory(["/editor/resourceTemplate:testing:uber3"])
    renderApp(null, history)

    // if the tooltip remark is text
    const infoIcon3 = await screen.findByRole("link", {
      name: "Uber template3, property1",
    })
    expect(infoIcon3).toHaveAttribute("data-bs-content", "A literal")

    const infoLink = await screen.findByRole("link", {
      name: "http://access.rdatoolkit.org/1.0.html",
    })

    expect(infoLink).toHaveClass("prop-remark")
  })

  it("has tooltip text info based on the content of a nested property remark", async () => {
    const history = createHistory(["/editor/resourceTemplate:testing:uber1"])
    renderApp(null, history)

    // Finds the parent property
    const infoIcon1 = await screen.findByRole("link", {
      name: "Uber template1, property18",
    })
    expect(infoIcon1).toHaveAttribute(
      "data-bs-content",
      "Mandatory nested resource templates."
    )

    // Finds the nested property info (tooltip remark is text)
    const nestedInfoIcons = await screen.findAllByRole("link", {
      name: "Uber template4, property1",
    })
    expect(nestedInfoIcons[0]).toHaveAttribute(
      "data-bs-content",
      "A repeatable, required literal"
    )
  }, 15000)
})
