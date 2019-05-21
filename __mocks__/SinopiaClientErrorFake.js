export default class SinopiaClientErrorFake {
  async createResourceWithHttpInfo() {
    throw {
      response: 'i am an error for a created object'
    }
  }

  async updateResourceWithHttpInfo() {
    throw {
      response: 'i am an error for an updated object'
    }
  }
}
