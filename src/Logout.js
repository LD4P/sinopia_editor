import Config from './Config'
import { clearState } from './localStorage'

class Logout {
  constructor() {
    this.url = Config.awsCognitoLogoutUrl
  }

  cognitoLogout() {
    window.location = this.url
  }

  stateLogout() {
    clearState('jwtAuth')
  }
}

export default Logout