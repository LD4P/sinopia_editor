import React from "react"
import { AlertsContext } from "components/alerts/AlertsContextProvider"

const useAlerts = () => {
  const context = React.useContext(AlertsContext)
  if (!context) {
    throw new Error("useAlerts must be used within an AlertsProvider")
  }
  return context
}

export default useAlerts
