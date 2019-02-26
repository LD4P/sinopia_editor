import Config from './Config'

class Logout {
  constructor() {
    this.url = Config.awsCognitoLogoutUrl
  }

  cognitoLogout() {
    window.location = this.url
  }
}

export default Logout