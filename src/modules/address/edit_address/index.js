import { asyncRoute } from 'router'

const EditAddressContainer = asyncRoute(
  () => import('./edit_address.container.js'),
)

export default EditAddressContainer
