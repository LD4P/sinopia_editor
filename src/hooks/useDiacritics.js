import { useState } from "react"

const useDiacritics = (
  inputRef,
  inputId,
  diacriticsId,
  diacriticsBtnId,
  defaultContent
) => {
  const [showDiacritics, setShowDiacritics] = useState(false)
  const [currentContent, setCurrentContent] = useState(defaultContent)
  const [currentPosition, setCurrentPosition] = useState(0)

  const handleKeyDownDiacritics = (event) => {
    // Handle any position changing
    setCurrentPosition(event.target.selectionStart + 1)
  }

  const handleChangeDiacritics = (event) => {
    setCurrentContent(event.target.value)
    event.preventDefault()
  }

  const handleBlurDiacritics = (event) => {
    if (focusIn(event, diacriticsId)) {
      setCurrentPosition(inputRef.current.selectionStart)
      return false
    }
    if (focusIn(event, inputId)) return false
    if (focusIn(event, diacriticsBtnId)) return false

    setShowDiacritics(false)

    return true
  }

  const toggleDiacritics = (event) => {
    setShowDiacritics(!showDiacritics)

    event.preventDefault()
  }

  const closeDiacritics = () => {
    setShowDiacritics(false)
    inputRef.current.focus()
  }

  const focusIn = (event, checkId) => {
    if (event.relatedTarget === null) return false

    let node = event.relatedTarget

    while (node !== null) {
      if (node.id === checkId) return true
      node = node.parentNode
    }

    return false
  }

  const handleAddCharacter = (character) => {
    setCurrentContent(
      currentContent.slice(0, currentPosition) +
        character +
        currentContent.slice(currentPosition)
    )
    setCurrentPosition(currentPosition + 1)
  }

  const handleClickDiacritics = () => {
    setCurrentPosition(inputRef.current.selectionStart)
  }

  return {
    handleKeyDownDiacritics,
    handleChangeDiacritics,
    handleBlurDiacritics,
    toggleDiacritics,
    closeDiacritics,
    handleAddCharacter,
    handleClickDiacritics,
    currentContent,
    showDiacritics,
  }
}

export default useDiacritics
