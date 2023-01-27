import { OrderStatus } from '@store/types/order'

export const dropdownOrderOptions = [
  {
    status: OrderStatus.SEND_WAIT,
    label: 'Set as dispatched'
  },
  {
    status: OrderStatus.ON_THE_WAY,
    label: 'Set as waiting for pickup'
  }
]
