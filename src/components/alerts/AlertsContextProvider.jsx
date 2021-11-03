import React from "react"
import PropTypes from "prop-types"

export const AlertsContext = React.createContext()

const AlertsContextProvider = ({ value, children }) => (
  <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>
)

AlertsContextProvider.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export default AlertsContextProvider
