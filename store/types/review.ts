import { IOrder } from './order'
import { User } from './user'

export interface IReviewForm {
  text: string
  rating: number
  orderId: string
}

export interface IGetReviewsForm {
  userId: number
  page: number
  take: number
}

export interface IReview {
  id: number
  text: string
  rating: number
  user: User
  order: IOrder
  date: string
}
