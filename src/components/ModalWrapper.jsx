// Copyright 2019 Stanford University see LICENSE for license

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export const useModalCss = (show) => {
  const classes = ['modal', 'fade']
  if (show) {
    classes.push('show')
  }
  return classes.join(' ')
}

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
