// Copyright 2018 Stanford University see LICENSE for license

const mockAWSHeader = {
  kid: "x24+y25+z26",
  alg: "RS256",
}
const mockAWSReponse = {
  sub: "a1b2c3",
  token_use: "access",
  scope: "openid email",
  auth_time: 1234567890,
  iss: "https://cognito-idp.fake-region.amazonaws.com/fake-region_1a2b",
  exp: 1234567890,
  iat: 1234567890,
  version: 2,
  jti: "1a-2b-3c",
  client_id: "1a2b3c",
  username: "fake",
}
const mockAWSsigniture = "fake-signature"
const mockHeader = Buffer.from(JSON.stringify(mockAWSHeader))
  .toString("base64")
  .slice(0, -2)
const mockToken = Buffer.from(JSON.stringify(mockAWSReponse))
  .toString("base64")
  .slice(0, -2)
const mockSignature = Buffer.from(JSON.stringify(mockAWSsigniture))
  .toString("base64")
  .slice(0, -2)
const mockJWTString = `${mockHeader}.${mockToken}.${mockSignature}`

module.exports = mockJWTString
