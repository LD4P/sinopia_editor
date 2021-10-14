import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"

const TransferButton = ({ label, handleClick }) => {
  const [btnText, setBtnText] = useState(label)
  const timerRef = useRef(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  const handleBtnClick = (event) => {
    setBtnText(<em>Requesting</em>)
    timerRef.current = setTimeout(() => setBtnText(label), 3000)
    handleClick(event)
    event.preventDefault()
  }

  return (
    <button
      type="button"
      className="btn btn-secondary btn-no-outline"
      onClick={handleBtnClick}
    >
      {btnText}
    </button>
  )
}

TransferButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default TransferButton
