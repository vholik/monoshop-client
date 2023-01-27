import { Item } from './item'
import { IReview } from './review'

export enum OrderStatus {
  REJECTED = 'REJECTED',
  SEND_WAIT = 'SEND_WAIT',
  ON_THE_WAY = 'ON_THE_WAY',
  PICKUP_WAIT = 'PICKUP_WAIT',
  DELIVERED = 'DELIVERED'
}

export interface IOrder {
  id: string
  city: string
  country: string
  line1: string
  line2?: string
  postalCode: string
  state: string
  sellerId: string
  fullName: string
  phone: string
  userId: number
  itemId: number
  status: OrderStatus
  date: string
  review?: IReview
  item: Item
}
