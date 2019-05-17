// Copyright 2018, 2019 Stanford University see Apache2.txt for license

export const resourceToName = (uri) => {
  return uri.substr(uri.lastIndexOf('/') + 1)
}