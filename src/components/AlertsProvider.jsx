import React from "react"
import PropTypes from "prop-types"

export const AlertsContext = React.createContext()

function AlertsProvider({value, children}) {
  console.log('rendering AlertsProvider')
  return <AlertsContext.Provider value={value} children={children} />
}

// AlertsProvider.propTypes = {
//   errorKey: PropTypes.string,
//   warningKey: PropTypes.string
// }

export default AlertsProvider