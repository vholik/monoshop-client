import { OrderList } from '@components/OrderList/OrderList'
import { IOrder } from '@store/types/order'

interface SoldListProps {
  orders: IOrder[]
}

const SoldItems = ({ orders }: SoldListProps) => {
  return <OrderList orders={orders} />
}
export default SoldItems
