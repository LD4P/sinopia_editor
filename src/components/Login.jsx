import React from 'react'
import PropTypes from 'prop-types'

import Config from '../../src/Config'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectToReferrer: false,
    }
  }

  cognitoLogin = (url) => {
    setTimeout(function(){
      window.location.assign(url)
    }, 500);
  }

  render() {
    return (
      <div className="jumbotron center-block">
        <p>Please wait to be directed to the login service...</p>
        {this.cognitoLogin(Config.awsCognitoLoginUrl)}
      </div>
    )
  }
}

Login.propTypes = {
  location: PropTypes.object
}

export default Login