import { IOrder } from '@store/types/order'
import { OrderBar } from '@components/OrderBar/OrderBar'
import Order from '@components/Order/Order'
import { OrderListStyles } from './OrderList.styles'
import { useRouter } from 'next/router'
import { isRouteSold } from './route.helper'

interface OrderListProps {
  orders: IOrder[]
}

export const OrderList = ({ orders }: OrderListProps) => {
  return (
    <>
      {orders && !orders.length ? (
        <p className="no-items">
          {isRouteSold()
            ? "You haven't selled anything"
            : "You haven't bought anything"}
        </p>
      ) : (
        <OrderListStyles>
          <OrderBar />
          {orders &&
            orders.map((order, key) => <Order order={order} key={key} />)}
        </OrderListStyles>
      )}
    </>
  )
}
