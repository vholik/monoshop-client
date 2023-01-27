import { OrderedItemsStyles } from './OrderedItems.styles'
import { OrderStatuses } from './order-status'
import Image from 'next/image'
import SettingsDots from '@public/images/settings-dots.svg'
import { useState } from 'react'
import CustomModal from '@components/CustomModal/CustomModal'
import { IOrder } from '@store/types/order'
import { OrderList } from '@components/OrderList/OrderList'

interface OrderedItemsProps {
  orders: IOrder[]
}

function OrderedItems({ orders }: OrderedItemsProps) {
  return <OrderList orders={orders} />
}
export default OrderedItems
