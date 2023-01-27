import { useRouter } from 'next/router'
import { OrderBarStyles } from './OrderBar.styles'
import { OrderRoutes } from './order-routes.data'

export const OrderBar = () => {
  const router = useRouter()

  const currentRoute = () => {
    const route = router.pathname

    return OrderRoutes.find((f) => f.route === route)
  }

  return (
    <OrderBarStyles>
      <p className="bar-label">Order ID</p>
      <p className="bar-label">Date</p>
      <p className="bar-label">{currentRoute()?.label}</p>
      <p className="bar-label">Item</p>
      <p className="bar-label">Destination</p>
      <p className="bar-label">Status</p>
    </OrderBarStyles>
  )
}
