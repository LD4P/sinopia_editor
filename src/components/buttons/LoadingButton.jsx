import React from "react"

const LoadingButton = () => (
  <button className="btn btn-link" type="button" disabled>
    <span
      className="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
  </button>
)

export default LoadingButton
