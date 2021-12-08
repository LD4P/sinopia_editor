import React from "react"
import { useSelector } from "react-redux"
import { selectMarc } from "selectors/modals"
import ModalWrapper from "../../ModalWrapper"
import ClipboardButton from "../../ClipboardButton"

const MarcModal = () => {
  const marc = useSelector((state) => selectMarc(state))

  const body = (
    <React.Fragment>
      <div className="mb-2">
        <ClipboardButton text={marc} label="MARC" />
      </div>
      <pre className="p-3">
        <bdi>{marc}</bdi>
      </pre>
    </React.Fragment>
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
