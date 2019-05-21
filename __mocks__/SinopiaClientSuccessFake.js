export default class SinopiaClientSuccessFake {
  async createResourceWithHttpInfo() {
    return {
      response: 'i am a response for a created object'
    }
  }

  async updateResourceWithHttpInfo() {
    return {
      response: 'i am a response for an updated object'
    }
  }
}
