import { asyncRoute } from 'router'

const CreateAddressContainer = asyncRoute(
  () => import('./create_address.container.js'),
)

export default CreateAddressContainer
