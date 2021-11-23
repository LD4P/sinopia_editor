import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { metricsErrorKey } from "utilities/errorKeyFactory"
import { addError, clearErrors } from "actions/errors"
import * as sinopiaMetrics from "../sinopiaMetrics"

const useMetric = (name) => {
  const dispatch = useDispatch()
  const [metric, setMetric] = useState(null)

  useEffect(() => {
    dispatch(clearErrors(metricsErrorKey))
    sinopiaMetrics[name]()
      .then((results) => {
        setMetric(results)
      })
      .catch((err) => {
        dispatch(
          addError(
            metricsErrorKey,
            `Error retrieving metrics: ${err.message || err}`
          )
        )
      })
  }, [name, dispatch])

  return metric
}

export default useMetric
