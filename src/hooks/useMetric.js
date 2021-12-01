import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { metricsErrorKey } from "utilities/errorKeyFactory"
import { addError } from "actions/errors"
import * as sinopiaMetrics from "../sinopiaMetrics"

const useMetric = (name, params = null) => {
  const dispatch = useDispatch()
  const [metric, setMetric] = useState(null)
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    sinopiaMetrics[name](params || {})
      .then((results) => {
        if (isMountedRef.current) setMetric(results)
      })
      .catch((err) => {
        if (isMountedRef.current) {
          dispatch(
            addError(
              metricsErrorKey,
              `Error retrieving metrics: ${err.message || err}`
            )
          )
        }
      })
  }, [name, params, dispatch])

  return metric
}

export default useMetric
