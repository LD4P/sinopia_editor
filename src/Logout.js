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
    clearState()
  }
}

export default Logout