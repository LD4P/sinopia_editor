import React from "react"
import LongDate from "components/LongDate"
import { render, screen } from "@testing-library/react"

describe("<LongDate />", () => {
  it("uses the provided timeZone", async () => {
    render(<LongDate datetime="2012-09-21" timeZone="UTC" />)
    screen.getByText("Sep 21, 2012")
  })

  it("handles invalid dates", async () => {
    const { container } = render(<LongDate datetime="foo" />)
    expect(container).toBeEmpty()
  })

  it("does not render if null", async () => {
    const { container } = render(<LongDate datetime={null} />)
    expect(container).toBeEmpty()
  })
})
