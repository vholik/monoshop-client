import { OrderStatus } from '@store/types/order'

export const OrderStatuses = [
  {
    status: OrderStatus.REJECTED,
    label: 'Rejected',
    color: '#000000'
  },
  {
    status: OrderStatus.SEND_WAIT,
    label: 'Waiting for shipping',
    color: '#3048EA'
  },
  {
    status: OrderStatus.ON_THE_WAY,
    label: 'On the way',
    color: '#FA5C39'
  },
  {
    status: OrderStatus.PICKUP_WAIT,
    label: 'Waiting for pick up',
    color: '#FA5C39'
  },
  {
    status: OrderStatus.DELIVERED,
    label: 'Delivered',
    color: '#3C8224'
  }
]
