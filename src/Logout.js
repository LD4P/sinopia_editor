import Config from './Config'
import { clearState } from './localStorage'

class Logout {
  constructor() {
    this.url = Config.awsCognitoLogoutUrl
  }

  cognitoLogout() {
    clearState()
    window.location = this.url
  }
}

export default Logout