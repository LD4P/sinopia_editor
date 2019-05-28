// Copyright 2018, 2019 Stanford University see LICENSE for license

export const isResourceWithValueTemplateRef = ( property ) => {
  return Boolean(
    ( property.hasOwnProperty('type') && property.type === 'resource' ) &&
    ( property.hasOwnProperty('valueConstraint') &&
      ( property.valueConstraint.hasOwnProperty('valueTemplateRefs')  &&
       property.valueConstraint.valueTemplateRefs.length > 0))
  )
}

export const resourceToName = (uri) => {
  try{
    return uri.substr(uri.lastIndexOf('/') + 1)
  } catch {
    return undefined
  }
}
