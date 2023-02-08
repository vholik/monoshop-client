import { IOption } from '@utils/CustomSelector.type'
import { MultiValue, SingleValue } from 'react-select'
import { SortBy } from './filter-by.enum'
import { Gender } from './gender.enum'
import { Item } from './item'
import { ItemEntity, ItemEntityWithId } from './item-entity'

export interface IFilter {
  price?: [number, number]
  gender?: Gender | null
  category?: IOption | null
  subcategory?: IOption[]
  size?: MultiValue<ItemEntity> | null
  condition?: MultiValue<{ label: string; value: number }> | null
  brand?: MultiValue<ItemEntity> | null
  style?: MultiValue<ItemEntity> | null
  colour?: MultiValue<ItemEntity> | null
  sortBy?: SingleValue<ItemEntity>
  page?: number
  search?: string
}

export interface IFileringData {
  data: Item[]
  meta: {
    total: number
  }
}
