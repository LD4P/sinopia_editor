import React from "react"
import PropTypes from "prop-types"
import _ from "lodash"

const CountCard = ({ title, help = null, count = null, footer = null }) => (
  <div className="card metrics-card">
    <div className="card-header">
      <h5>{title}</h5>
      {help && <div className="form-text">{help}</div>}
    </div>
    <div className="card-body">
      <div className="card-text display-1 text-center">
        {_.isNull(count) ? (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <React.Fragment>{count}</React.Fragment>
        )}
      </div>
    </div>
    {footer && <div className="card-footer">{footer}</div>}
  </div>
)

CountCard.propTypes = {
  title: PropTypes.string.isRequired,
  help: PropTypes.string,
  count: PropTypes.number,
  footer: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export default CountCard
