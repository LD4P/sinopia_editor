import React, { Component }  from 'react'

class StartingPoints extends Component {
  render() {
    let startingPoints = {
      border: '1px dotted',
      float: 'left',
      padding: '20px'
    }
    return (
      <div className="StartingPoints" style={startingPoints}>
        <h3>Create Resource</h3>
        <h4>Starting points:</h4>
        <ul>
          <li>Resource template 1</li>
          <li>Resource template 2</li>
        </ul>
      </div>
    )
  }
}

export default StartingPoints;
