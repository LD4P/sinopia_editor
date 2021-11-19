import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen, within } from "@testing-library/react"
import { featureSetup } from "featureUtils"

featureSetup()

describe("editing a language", () => {
  const history = createHistory(["/editor/resourceTemplate:testing:literal"])
  it("allows selecting a language", async () => {
    renderApp(null, history)

    await screen.findByText("Literal", {
      selector: "h3#resource-header",
    })

    // Add a value
    const input = screen.getByPlaceholderText("Literal input")
    fireEvent.change(input, { target: { value: "foo" } })
    fireEvent.keyDown(input, { key: "Enter", code: 13, charCode: 13 })

    // There is language button.
    const langBtn = screen.getByTestId("Change language for foo")
    expect(langBtn).toHaveTextContent("en")

    fireEvent.click(langBtn)
    // Using getByRole here and below because it limits to the visible modal.
    screen.getByRole("heading", { name: "Select language tag for foo" })

    const currentTagRow = screen.getByText(/Current tag/).parentElement
    within(currentTagRow).getByText("en")

    const newTagRow = screen.getByText(/New tag/).parentElement
    within(newTagRow).getByText("en")

    const scriptInput = screen.getByTestId("scriptComponent-foo")
    // Select a script.
    fireEvent.click(scriptInput)
    fireEvent.change(scriptInput, { target: { value: "Latin (Latn)" } })
    fireEvent.click(
      screen.getByText("Latin (Latn)", { selector: ".rbt-highlight-text" })
    )
    within(newTagRow).getByText("en-Latn")

    // Clear script.
    fireEvent.click(screen.getByTestId("Clear script for foo"))
    within(newTagRow).getByText("en")

    const transliterationInput = screen.getByTestId(
      "transliterationComponent-foo"
    )

    // Select a transliteration
    fireEvent.click(transliterationInput)
    fireEvent.change(transliterationInput, {
      target: {
        value: "American Library Association-Library of Congress (alalc)",
      },
    })
    fireEvent.click(
      screen.getByText(
        "American Library Association-Library of Congress (alalc)",
        { selector: ".rbt-highlight-text" }
      )
    )
    within(newTagRow).getByText("en-t-en-m0-alalc")

    // Clear transliteration
    fireEvent.click(screen.getByTestId("Clear transliteration for foo"))
    within(newTagRow).getByText("en")

    const langInput = screen.getByTestId("langComponent-foo")

    // Select a language
    fireEvent.click(langInput)
    fireEvent.change(langInput, { target: { value: "Tai (taw)" } })
    fireEvent.click(
      screen.getByText("Tai (taw)", { selector: ".rbt-highlight-text" })
    )
    within(newTagRow).getByText("taw")

    // Clear language
    fireEvent.click(screen.getByTestId("Clear language for foo"))
    within(newTagRow).getByText("None specified")
    expect(scriptInput).toBeDisabled()
    expect(transliterationInput).toBeDisabled()
  }, 15000)
})
