import React from "react"
import PropTypes from "prop-types"

const CountCard = ({ title, count }) => (
  <div className="card">
    <div className="card-header">
      <h5>{title}</h5>
    </div>
    <div className="card-body">
      <p className="card-text display-1 text-center">{count}</p>
    </div>
  </div>
)

CountCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
}

export default CountCard
