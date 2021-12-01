import { renderApp, createHistory } from "testUtils"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { featureSetup } from "featureUtils"

featureSetup()

describe("editing a URI property", () => {
  const history = createHistory(["/editor/resourceTemplate:testing:uber1"])

  it("allows entering, editing, and removing a non-repeatable URI", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a URI
    const uriInput = screen.getByPlaceholderText("Uber template1, property5")
    fireEvent.change(uriInput, {
      target: { value: "http://id.loc.gov/authorities/names/n79032058" },
    })
    fireEvent.keyDown(uriInput, { key: "Enter", code: 13, charCode: 13 })

    const labelInput = screen.getByPlaceholderText(
      "Label for Uber template1, property5"
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

    // There is a link out
    screen.getByTestId("Link to http://id.loc.gov/authorities/names/n79032058")

    // There is no add another
    expect(
      screen.queryByTestId("Add another Uber template1, property5")
    ).not.toBeInTheDocument()

    // There is remove button
    screen.getByTestId("Remove http://id.loc.gov/authorities/names/n79032058")
    // There is language button.
    expect(
      screen.getByTestId("Change language for Wittgenstein, Ludwig, 1889-1951")
    ).toHaveTextContent("en")
  }, 10000)

  it("allows entering a non-HTTP URI", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a URI
    const uriInput = screen.getByPlaceholderText("Uber template1, property5")
    fireEvent.change(uriInput, {
      target: { value: "foo:bar" },
    })
    fireEvent.keyDown(uriInput, { key: "Enter", code: 13, charCode: 13 })

    // There is a link out
    expect(screen.queryByTestId("Link to foo:bar")).not.toBeInTheDocument()
  })

  it("allows entering a repeatable URI", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add two values
    const input = screen.getByPlaceholderText("Uber template1, property6")
    fireEvent.change(input, {
      target: { value: "http://id.loc.gov/authorities/names/n79032058" },
    })
    fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 })

    // Add another
    fireEvent.click(
      screen.queryByTestId("Add another Uber template1, property6")
    )
    const inputs = screen.getAllByPlaceholderText("Uber template1, property6")
    expect(inputs).toHaveLength(2)

    const input2 = inputs[1]
    fireEvent.change(input2, {
      target: { value: "http://id.loc.gov/authorities/names/n79056054" },
    })
    fireEvent.keyPress(input2, { key: "Enter", code: 13, charCode: 13 })

    // There is first uri.
    expect(
      screen.getByText("http://id.loc.gov/authorities/names/n79032058")
    ).toHaveClass("form-control")
    // There is remove button
    screen.getByTestId("Remove http://id.loc.gov/authorities/names/n79032058")

    // And second uri.
    expect(
      screen.getByText("http://id.loc.gov/authorities/names/n79056054")
    ).toHaveClass("form-control")
    // There is remove button
    screen.getByTestId("Remove http://id.loc.gov/authorities/names/n79056054")
  })

  it("allows entering diacritics", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a URI
    const uriInput = screen.getByPlaceholderText("Uber template1, property5")
    fireEvent.change(uriInput, {
      target: { value: "foo:bar" },
    })
    fireEvent.keyDown(uriInput, { key: "Enter", code: 13, charCode: 13 })

    // Add a label
    const labelInput = screen.getByPlaceholderText(
      "Label for Uber template1, property5"
    )
    // Yeah, these fireEvent's seem odd but they produce the desired effect.
    fireEvent.change(labelInput, { target: { value: "Fo" } })
    fireEvent.keyDown(labelInput, { key: "F", code: "KeyF", charCode: 70 })
    fireEvent.keyDown(labelInput, { key: "o", code: "Keyo", charCode: 111 })
    expect(labelInput).toHaveValue("Fo")

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
    expect(labelInput).toHaveValue("Foọ")

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
  }, 15000)

  it("allows selecting a language", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a URI
    const uriInput = screen.getByPlaceholderText("Uber template1, property5")
    fireEvent.change(uriInput, {
      target: { value: "foo:bar" },
    })
    fireEvent.keyDown(uriInput, { key: "Enter", code: 13, charCode: 13 })

    // Add a label
    const labelInput = screen.getByPlaceholderText(
      "Label for Uber template1, property5"
    )
    fireEvent.change(labelInput, { target: { value: "foo" } })
    fireEvent.keyDown(labelInput, { key: "Enter", code: 13, charCode: 13 })

    // There is foo text.
    await waitFor(() =>
      expect(screen.getByText("foo")).toHaveClass("form-control")
    )
    // There is language button.
    const langBtn = screen.getByTestId("Change language for foo")
    expect(langBtn).toHaveTextContent("en")

    fireEvent.click(langBtn)
    // Using getByRole here and below because it limits to the visible modal.
    screen.getByRole("heading", { name: "Select language tag for foo" })

    const langInput = screen.getByTestId("langComponent-foo")

    fireEvent.click(langInput)
    fireEvent.change(langInput, { target: { value: "Tai (taw)" } })
    fireEvent.click(
      screen.getByText("Tai (taw)", { selector: ".rbt-highlight-text" })
    )
    fireEvent.click(screen.getByTestId("Select language for foo"))

    await waitFor(() =>
      expect(
        screen.queryAllByRole("heading", {
          name: "Select language tag for foo",
        }).length
      ).toBeFalsy()
    )
    expect(langBtn).toHaveTextContent("taw")
  }, 25000)

  it("validates that a valid URI", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a value
    const input = screen.getByPlaceholderText("Uber template1, property5")
    fireEvent.change(input, { target: { value: "foo" } })
    fireEvent.keyDown(input, { key: "Enter", code: 13, charCode: 13 })

    const saveBtn = screen.getAllByText("Save", { selector: "button" })[0] // there are multiple save buttons, grab the first
    fireEvent.click(saveBtn)

    await screen.findByText("Invalid URI")
  }, 10000)

  it("validates that has a label", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a value
    const input = screen.getByPlaceholderText("Uber template1, property5")
    fireEvent.change(input, {
      target: { value: "http://id.loc.gov/authorities/names/n79032058" },
    })
    fireEvent.keyDown(input, { key: "Enter", code: 13, charCode: 13 })

    const saveBtn = screen.getAllByText("Save", { selector: "button" })[0] // there are multiple save buttons, grab the first
    fireEvent.click(saveBtn)

    expect(
      await screen.findByTestId(
        "Label errors for http://id.loc.gov/authorities/names/n79032058"
      )
    ).toHaveTextContent("Label required")
  }, 10000)

  it("validates that has a URI", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a label
    const labelInput = screen.getByPlaceholderText(
      "Label for Uber template1, property5"
    )
    fireEvent.change(labelInput, {
      target: { value: "Wittgenstein, Ludwig, 1889-1951" },
    })
    fireEvent.keyDown(labelInput, { key: "Enter", code: 13, charCode: 13 })

    const saveBtn = screen.getAllByText("Save", { selector: "button" })[0] // there are multiple save buttons, grab the first
    fireEvent.click(saveBtn)

    expect(
      await screen.findByTestId(
        "URI errors for Wittgenstein, Ludwig, 1889-1951"
      )
    ).toHaveTextContent("URI required")
  }, 10000)

  it("enables save button on keydown for URI", async () => {
    const history = createHistory(["/editor/resourceTemplate:testing:uri"])

    renderApp(null, history)

    await screen.findByText("URI", {
      selector: "h3#resource-header",
    })

    const saveBtn = screen.getAllByLabelText("Save", {
      selector: ".editor-save",
    })[0]
    expect(saveBtn).toBeDisabled()

    // Add a value
    fireEvent.keyDown(screen.getByPlaceholderText("URI input"), {
      key: "F",
      code: 70,
      charCode: 70,
    })

    // There is foo text.
    await waitFor(() => expect(saveBtn).not.toBeDisabled())
  }, 10000)

  it("enables save button on keydown for label", async () => {
    const history = createHistory(["/editor/resourceTemplate:testing:uri"])

    renderApp(null, history)

    await screen.findByText("URI", {
      selector: "h3#resource-header",
    })

    const saveBtn = screen.getAllByLabelText("Save", {
      selector: ".editor-save",
    })[0]
    expect(saveBtn).toBeDisabled()

    // Add a value
    fireEvent.keyDown(screen.getByPlaceholderText("Label for URI input"), {
      key: "F",
      code: 70,
      charCode: 70,
    })

    // There is foo text.
    await waitFor(() => expect(saveBtn).not.toBeDisabled())
  }, 10000)
})
