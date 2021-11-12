import { renderApp, createHistory } from "testUtils"
import { fireEvent, waitFor, screen } from "@testing-library/react"
import { featureSetup } from "featureUtils"

featureSetup()

describe("editing a literal property", () => {
  const history = createHistory(["/editor/resourceTemplate:testing:uber1"])

  it("allows entering, editing, and removing a non-repeatable literal", async () => {
    renderApp(null, history)

    // Due to issues with the text area component, a new input is created when disabling.
    // Thus, for this using screen.getByPlaceholderText('Uber template1, property4') instead of a variable
    // for input.

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a value
    fireEvent.change(screen.getByPlaceholderText("Uber template1, property4"), {
      target: { value: "foo" },
    })
    fireEvent.keyDown(
      screen.getByPlaceholderText("Uber template1, property4"),
      { key: "Enter", code: 13, charCode: 13 }
    )

    // There is foo text.
    await waitFor(() =>
      expect(screen.getByText("foo")).toHaveClass("form-control")
    )
    // There is remove button
    screen.getByTestId("Remove foo")
    // There is language button.
    expect(screen.getByTestId("Change language for foo")).toHaveTextContent(
      "English"
    )

    // Clicking remove
    fireEvent.change(screen.getByPlaceholderText("Uber template1, property4"), {
      target: { value: "foobar" },
    })

    const removeBtn = screen.getByTestId("Remove foobar")
    fireEvent.click(removeBtn)

    expect(screen.queryAllByText("foobar")).toHaveLength(0)
  }, 15000)

  it("allows entering a repeatable literal", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add two values
    const input = screen.getByPlaceholderText("Uber template1, property2")
    fireEvent.change(input, { target: { value: "foo" } })
    fireEvent.click(screen.getByTestId("Add another Uber template1, property2"))
    fireEvent.keyDown(input, { key: "Enter", code: 13, charCode: 13 })
    const inputs = screen.queryAllByPlaceholderText("Uber template1, property2")
    expect(inputs).toHaveLength(2)
    fireEvent.change(inputs[1], { target: { value: "bar" } })
    fireEvent.keyDown(inputs[1], { key: "Enter", code: 13, charCode: 13 })

    // There is remove button
    screen.getByTestId("Remove foo")
    // There is language button.
    expect(screen.getByTestId("Change language for foo")).toHaveTextContent(
      "English"
    )

    // And bar text.
    // There is remove button
    screen.getByTestId("Remove bar")
    // There is language button.
    expect(screen.getByTestId("Change language for bar")).toHaveTextContent(
      "English"
    )
    // An add another
    screen.getByTestId("Add another Uber template1, property2")

    // Input is not disabled and empty
  }, 15000)

  it("allows entering diacritics", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a value
    const input = screen.getByPlaceholderText("Uber template1, property4")
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
  }, 15000)

  it("allows selecting a language", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a value
    const input = screen.getByPlaceholderText("Uber template1, property4")
    fireEvent.change(input, { target: { value: "foo" } })
    fireEvent.keyDown(input, { key: "Enter", code: 13, charCode: 13 })

    // There is foo text.
    await waitFor(() =>
      expect(screen.getByText("foo")).toHaveClass("form-control")
    )
    // There is language button.
    const langBtn = screen.getByTestId("Change language for foo")
    expect(langBtn).toHaveTextContent("English")

    fireEvent.click(langBtn)
    // Using getByRole here and below because it limits to the visible modal.
    screen.getByRole("heading", { name: "Languages" })

    const radioButtons = await screen.findAllByRole("radio")

    let checkedRadioButtons = radioButtons.filter((el) => el.checked)
    let unCheckedRadioButtons = radioButtons.filter((el) => !el.checked)

    // the correct "language selected" radio button is pre-checked
    expect(checkedRadioButtons[0].value).toEqual("present")
    expect(unCheckedRadioButtons[0].value).toEqual("absent")

    const langInput = screen.getByTestId("langComponent-foo")

    fireEvent.click(langInput)
    fireEvent.change(langInput, { target: { value: "Tai languages" } })
    fireEvent.click(
      screen.getByText("Tai languages", { selector: ".rbt-highlight-text" })
    )

    checkedRadioButtons = radioButtons.filter((el) => el.checked)
    unCheckedRadioButtons = radioButtons.filter((el) => !el.checked)

    // the correct "language selected" radio button is still checked
    expect(checkedRadioButtons[0].value).toEqual("present")
    expect(unCheckedRadioButtons[0].value).toEqual("absent")

    fireEvent.click(screen.getByRole("button", { name: "Submit" }))

    await waitFor(() =>
      expect(
        screen.queryAllByRole("heading", { name: "Languages" }).length
      ).toBeFalsy()
    )
    expect(langBtn).toHaveTextContent("Tai languages")
  }, 25000)

  it("allows selecting no language", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: "h3#resource-header",
    })

    // Add a value
    const input = screen.getByPlaceholderText("Uber template1, property4")
    fireEvent.change(input, { target: { value: "foo" } })
    fireEvent.keyDown(input, { key: "Enter", code: 13, charCode: 13 })

    // There is foo text.
    await waitFor(() =>
      expect(screen.getByText("foo")).toHaveClass("form-control")
    )
    // There is language button.
    const langBtn = screen.getByTestId("Change language for foo")
    expect(langBtn).toHaveTextContent("English")

    fireEvent.click(langBtn)
    screen.getByRole("heading", { name: "Languages" })

    const radioButtons = await screen.findAllByRole("radio")

    let checkedRadioButtons = radioButtons.filter((el) => el.checked)
    let unCheckedRadioButtons = radioButtons.filter((el) => !el.checked)

    // the correct "language selected" radio button is pre-checked
    expect(checkedRadioButtons[0].value).toEqual("present")
    expect(unCheckedRadioButtons[0].value).toEqual("absent")

    // Using testid here because there are multiple modals.
    fireEvent.click(screen.getByTestId("noLangRadio-foo"))
    fireEvent.click(screen.getByTestId("submit-foo"))

    checkedRadioButtons = radioButtons.filter((el) => el.checked)
    unCheckedRadioButtons = radioButtons.filter((el) => !el.checked)

    // the correct "no language selected" radio button is now checked
    expect(checkedRadioButtons[0].value).toEqual("absent")
    expect(unCheckedRadioButtons[0].value).toEqual("present")

    await waitFor(() =>
      expect(
        screen.queryAllByRole("heading", { name: "Languages" })
      ).toHaveLength(0)
    )
    expect(langBtn).toHaveTextContent("No language specified")
  }, 15000)
})
