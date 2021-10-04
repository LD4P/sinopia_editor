// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { cleanup, render } from "@testing-library/react"
import { setupModal } from "testUtils"
import ModalWrapper, {
  useDisplayStyle,
  useModalCss,
} from "components/ModalWrapper"

const testModal = () => {
  return (
    <div className="modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modal title</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>Modal body text goes here.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary">
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

describe("<ModalWrapper />, A wrapper for moving modals to a different location in the DOM", () => {
  setupModal()

  const { getByText } = render(<ModalWrapper modal={testModal()} />)

  it('modal is rendered in a div"', () => {
    expect(getByText("Modal title")).toBeInTheDocument()
  })

  it("modal div no longer in DOM after component is unmounted", () => {
    cleanup() // Calls the useEffect cleanup function
    expect(document.getElementById("modal").querySelector("div")).toBeFalsy()
  })
})

describe("useModalCss hook for generating modal-specific CSS classes", () => {
  it("returns default modal classes", () => {
    const cssClasses = useModalCss()
    expect(cssClasses).toMatch("modal fade")
    // When show is false returns the same CSS classes
    expect(useModalCss(false)).toMatch("modal fade")
  })

  it("returns all modal classes when show is true", () => {
    const cssClasses = useModalCss(true)
    expect(cssClasses).toMatch("modal fade show")
  })
})

describe("useDisplayStyle hook for setting modal display style", () => {
  it("returns none style as a default and when show is false", () => {
    expect(useDisplayStyle()).toMatch("none")
    // When show is true returns block
    expect(useDisplayStyle(false)).toMatch("none")
  })

  it("returns block style when show is true", () => {
    expect(useDisplayStyle(true)).toMatch("block")
  })
})
