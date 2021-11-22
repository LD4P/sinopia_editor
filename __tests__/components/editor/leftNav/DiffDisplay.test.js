import React from "react"
import { render, screen, within } from "@testing-library/react"
import DiffDisplay from "components/editor/leftNav/DiffDisplay"

describe("<DiffDisplay />", () => {
  it("displays added literal property", async () => {
    const diff = {
      addedProperties: [
        {
          propertyTemplate: {
            label: "Property 1",
            key: "prop1",
          },
          values: [
            {
              literal: "Value 1",
              lang: "en",
              key: "abc0",
            },
            {
              literal: "Value 2",
              lang: null,
              key: "abc1",
            },
          ],
        },
      ],
      removedProperties: [],
      changedPropertyDiffs: [],
    }
    render(<DiffDisplay diff={diff} />)
    const property1 = screen.getByText("Property 1", { selector: ".add" })
    within(property1).getByText("Value 1 [en]")
    within(property1).getByText("Value 2")
  })

  it("displays added URI property", async () => {
    const diff = {
      addedProperties: [
        {
          propertyTemplate: {
            label: "Property 1",
            key: "prop1",
          },
          values: [
            {
              uri: "http://test/value1",
              label: "Value 1",
              lang: "en",
              key: "abc0",
            },
            {
              uri: "test:value2",
              label: null,
              lang: null,
              key: "abc1",
            },
          ],
        },
      ],
      removedProperties: [],
      changedPropertyDiffs: [],
    }
    render(<DiffDisplay diff={diff} />)
    const property1 = screen.getByText("Property 1", { selector: ".add" })
    within(property1).getByText("http://test/value1", { selector: "a" })
    within(property1).getByText(/Value 1 \[en\]/)
    within(property1).getByText("test:value2")
  })

  it("displays removed literal property", async () => {
    const diff = {
      addedProperties: [],
      removedProperties: [
        {
          propertyTemplate: {
            label: "Property 1",
            key: "prop1",
          },
          values: [
            {
              literal: "Value 1",
              lang: "en",
              key: "abc0",
            },
          ],
        },
      ],
      changedPropertyDiffs: [],
    }
    render(<DiffDisplay diff={diff} />)
    const property1 = screen.getByText("Property 1", { selector: ".remove" })
    within(property1).getByText("Value 1 [en]")
  })

  it("displays removed URI property", async () => {
    const diff = {
      addedProperties: [],
      removedProperties: [
        {
          propertyTemplate: {
            label: "Property 1",
            key: "prop1",
          },
          values: [
            {
              uri: "http://test/value1",
              label: "Value 1",
              lang: "en",
              key: "abc0",
            },
          ],
        },
      ],
      changedPropertyDiffs: [],
    }
    render(<DiffDisplay diff={diff} />)
    const property1 = screen.getByText("Property 1", { selector: ".remove" })
    within(property1).getByText("http://test/value1", { selector: "a" })
    within(property1).getByText(/Value 1 \[en\]/)
  })

  it("displays changed properties", async () => {
    const diff = {
      addedProperties: [],
      removedProperties: [],
      changedPropertyDiffs: [
        {
          key: "abc3",
          propertyTemplate: {
            label: "Property 1",
            key: "prop1",
          },
          addedValues: [
            {
              literal: "Value 1",
              lang: "en",
              key: "abc0",
            },
          ],
          removedValues: [
            {
              literal: "Value 2",
              lang: "en",
              key: "abc1",
            },
          ],
          changedValues: [
            [
              {
                literal: "Value 3",
                lang: "en",
                key: "abc2",
              },
              {
                literal: "Value 3",
                lang: "bhu",
                key: "abc2",
              },
            ],
          ],
          changedSubjectValueDiffs: [],
        },
      ],
    }
    render(<DiffDisplay diff={diff} />)
    const property1 = screen.getByText("Property 1")
    within(property1).getByText("Value 1 [en]", { selector: ".add" })
    within(property1).getByText("Value 2 [en]", { selector: ".remove" })
    within(property1).getByText("Value 3 [en]", { selector: ".remove" })
    within(property1).getByText("Value 3 [bhu]", { selector: ".add" })
  })

  it("displays changed subject values", async () => {
    const diff = {
      addedProperties: [],
      removedProperties: [],
      changedPropertyDiffs: [
        {
          key: "abc3",
          propertyTemplate: {
            label: "Property 1",
            key: "prop1",
          },
          addedValues: [],
          removedValues: [],
          changedValues: [],
          changedSubjectValueDiffs: [
            {
              key: "abc4",
              subjectTemplate: {
                label: "Template 1",
                key: "template1",
              },
              addedProperties: [
                {
                  propertyTemplate: {
                    label: "Property 2",
                    key: "prop2",
                  },
                  values: [
                    {
                      literal: "Value 1",
                      lang: "en",
                      key: "abc0",
                    },
                  ],
                },
              ],
              removedProperties: [],
              changedPropertyDiffs: [],
            },
          ],
        },
      ],
    }
    render(<DiffDisplay diff={diff} />)
    const property1 = screen.getByText("Property 1")
    const template1 = within(property1).getByText("Template 1")
    const property2 = within(template1).getByText("Property 2", {
      selector: ".add",
    })
    within(property2).getByText("Value 1 [en]")
  })
})
