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
    //TODO: find way to fix tests, which otherwise throw  "Error: Not implemented: navigation (except hash changes)", meaning that the tests cannot mutate and mock window.location
    if(!this.props.test) {
      setTimeout(function(){
        window.location.assign(url)
      }, 1000);
    }
  }

  render() {
    const pathName = JSON.stringify(this.props.location.state.from.pathname.slice(1))

    let authenticationMessage = ''

    if(pathName === '"templates"') {
      authenticationMessage = <div className="alert alert-warning alert-dismissible">
        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
        You must be logged in to access the {pathName} path
      </div>;
    }

    return (
      <div className="jumbotron center-block">
        { authenticationMessage }
        <p>Please wait to be directed to the login service...</p>
        {this.cognitoLogin(Config.awsCognitoLoginUrl)}
      </div>
    )
  }
}

Login.propTypes = {
  location: PropTypes.object,
  test: PropTypes.bool
}

export default Login