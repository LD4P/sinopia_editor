// Copyright 2019 Stanford University see LICENSE for license

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const ModalWrapper = (props) => {
  const modalRoot = document.getElementById('modal')
  const el = useRef(document.createElement('div'))

  useEffect(() => {
    modalRoot.appendChild(el.current)
  })

  useEffect(() => { () => modalRoot.removeChild(el.current) })

  return createPortal(props.modal, el.current)
}

export default ModalWrapper
