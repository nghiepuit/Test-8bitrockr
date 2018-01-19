import { asyncRoute } from 'router'

const ListAddressContainer = asyncRoute(
  () => import('./list_address.container.js'),
  () => import('./list_address.reducers.js'),
)

export default ListAddressContainer
