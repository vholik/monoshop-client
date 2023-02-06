import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IFilter } from '@store/types/filter'
import { SortBy } from '@store/types/filter-by.enum'
import { Gender } from '@store/types/gender.enum'
import { ItemEntity, ItemEntityWithId } from '@store/types/item-entity'
import { MultiValue, SingleValue } from 'react-select'

const initialState: IFilter = {
  price: [0, 10000],
  gender: null,
  category: null,
  subcategory: null,
  size: null,
  condition: null,
  brand: null,
  style: null,
  colour: null,
  sortBy: null,
  page: 1,
  search: ''
}

export const FilterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<ItemEntity>) => {
      state.sortBy = action.payload
    },
    resetFilter: (state) => {
      Object.assign(state, initialState)
    },
    setPrice: (state, action: PayloadAction<[number, number]>) => {
      state.price = action.payload
    },
    setGender: (
      state,
      action: PayloadAction<{ value: string; label: string }>
    ) => {
      state.gender = action.payload
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setCategory: (
      state,
      action: PayloadAction<SingleValue<ItemEntity> | null>
    ) => {
      state.category = action.payload
    },
    setSubcategory: (
      state,
      action: PayloadAction<MultiValue<ItemEntityWithId>>
    ) => {
      state.subcategory = [...action.payload]
    },
    setCondition: (
      state,
      action: PayloadAction<MultiValue<{ label: string; value: number }>>
    ) => {
      state.condition = [...action.payload]
    },
    setBrand: (state, action: PayloadAction<MultiValue<ItemEntity>>) => {
      state.brand = [...action.payload]
    },
    setStyle: (state, action: PayloadAction<MultiValue<ItemEntity>>) => {
      state.style = [...action.payload]
    },
    setColour: (state, action: PayloadAction<MultiValue<ItemEntity>>) => {
      state.colour = [...action.payload]
    },
    setSize: (state, action: PayloadAction<MultiValue<ItemEntity>>) => {
      state.size = [...action.payload]
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    }
  }
})

export const filterActions = FilterSlice.actions

export default FilterSlice.reducer
