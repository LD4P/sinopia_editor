import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { metricsErrorKey } from "utilities/errorKeyFactory"
import { addError } from "actions/errors"
import * as sinopiaMetrics from "../sinopiaMetrics"

const useMetric = (name, params = null) => {
  const dispatch = useDispatch()
  const [metric, setMetric] = useState(null)
  const [isMounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  }, [])

  useEffect(() => {
    sinopiaMetrics[name](params || {})
      .then((results) => {
        if (isMounted) setMetric(results)
      })
      .catch((err) => {
        if (isMounted) {
          dispatch(
            addError(
              metricsErrorKey,
              `Error retrieving metrics: ${err.message || err}`
            )
          )
        }
      })
  }, [name, params, isMounted, dispatch])

  return metric
}

export default useMetric
