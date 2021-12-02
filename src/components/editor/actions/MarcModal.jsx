import React from "react"
import { useSelector } from "react-redux"
import { selectMarc } from "selectors/modals"
import ModalWrapper from "../../ModalWrapper"

const MarcModal = () => {
  const marc = useSelector((state) => selectMarc(state))

  const body = (
    <pre className="p-3">
      <bdi>{marc}</bdi>
    </pre>
  )

  return (
    <ModalWrapper
      body={body}
      modalName="MarcModal"
      ariaLabel="MARC record"
      size="lg"
    />
  )
}

export default MarcModal
