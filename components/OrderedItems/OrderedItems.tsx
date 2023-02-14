import { IOrder } from '@store/types/order'
import { OrderList } from '@components/OrderList/OrderList'

interface OrderedItemsProps {
  orders: IOrder[]
}

function OrderedItems({ orders }: OrderedItemsProps) {
  return <OrderList orders={orders} />
}
export default OrderedItems
