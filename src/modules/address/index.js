import ListAddressContainer from './list_address'
import CreateAddressContainer from './create_address'
import EditAddressContainer from './edit_address'

const routes = [
  {
    path: '/',
    exact: true,
    component: ListAddressContainer,
  },
  {
    path: '/address/list',
    exact: true,
    component: ListAddressContainer,
  },
  {
    path: '/address/create',
    exact: true,
    component: CreateAddressContainer,
  },
  {
    path: '/address/edit/:id',
    exact: true,
    component: EditAddressContainer,
  },
]

export default routes
