import { CardForm } from '@components/AddCardModal/CardForm.interface'
import { Room } from './chat'
import { Gender } from './gender.enum'
import { ItemEntity, ItemEntityWithId } from './item-entity'
import { Size } from './size.enum'
import { User } from './user'

export interface Item {
  id: number
  user: User
  style: ItemEntity
  images: string[]
  price: number
  size: Size
  category: ItemEntityWithId
  subcategory: ItemEntityWithId
  brand: ItemEntityWithId[]
  colour: ItemEntity
  condition: number
  description: string
  gender: Gender
  name: string
  hashtags: string[]
  isFavorite?: boolean
  room: Room
  roomId: number
  selled: boolean
}

export interface IAddItemFormData {
  categoryId: number
  subcategoryId: number
  condition: number
  style: string
  brand: number[]
  colour: string
  size: string
  price: number
  gender: string
  images: string[]
  cardHolder: string
  cardNumber: number
}

export interface IEditItemFormData extends IAddItemFormData {
  id: number
}
