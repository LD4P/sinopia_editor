export const isBfInstance = (classes) => {
  if (!classes) return false
  return classes.includes("http://id.loc.gov/ontologies/bibframe/Instance")
}

export const isBfWork = (classes) => {
  if (!classes) return false
  return classes.includes("http://id.loc.gov/ontologies/bibframe/Work")
}

export const isBfItem = (classes) => {
  if (!classes) return false
  return classes.includes("http://id.loc.gov/ontologies/bibframe/Item")
}

export const isBfWorkInstanceItem = (classes) =>
  isBfWork(classes) || isBfInstance(classes) || isBfItem(classes)

export const isBfAdminMetadata = (classes) => {
  if (!classes) return false
  return classes.includes("http://id.loc.gov/ontologies/bibframe/AdminMetadata")
}
