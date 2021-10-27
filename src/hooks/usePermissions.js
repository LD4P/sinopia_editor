import { useSelector } from "react-redux"
import { selectGroups } from "selectors/authenticate"
import _ from "lodash"

const usePermissions = () => {
  const userGroups = useSelector((state) => selectGroups(state)) || []

  const canEdit = (resource) =>
    userGroups.includes(resource?.group) ||
    !!_.intersection(userGroups, resource?.editGroups).length

  const canChangeGroups = (resource) => userGroups.includes(resource.group)

  return { canCreate: !!userGroups.length, canEdit, canChangeGroups }
}

export default usePermissions
