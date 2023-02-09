import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IFilter } from '@store/types/filter'
import { SortBy } from '@store/types/filter-by.enum'
import { Gender } from '@store/types/gender.enum'
import { ItemEntity, ItemEntityWithId } from '@store/types/item-entity'
import { IOption } from '@utils/CustomSelector.type'
import { MultiValue, SingleValue } from 'react-select'

const initialState: IFilter = {
  price: [],
  gender: null,
  category: null,
  subcategory: [],
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
    setPrice: (state, action: PayloadAction<[number, number] | []>) => {
      state.price = action.payload
    },
    setGender: (state, action: PayloadAction<Gender | null>) => {
      state.gender = action.payload
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setCategory: (state, action: PayloadAction<IOption | null>) => {
      state.category = action.payload
    },
    setSubcategory: (state, action: PayloadAction<IOption[]>) => {
      state.subcategory = [...action.payload]
    },
    setCondition: (state, action: PayloadAction<IOption[]>) => {
      state.condition = [...action.payload]
    },
    setBrand: (state, action: PayloadAction<IOption[]>) => {
      state.brand = [...action.payload]
    },
    setStyle: (state, action: PayloadAction<IOption[]>) => {
      state.style = [...action.payload]
    },
    setColour: (state, action: PayloadAction<IOption[]>) => {
      state.colour = [...action.payload]
    },
    setSize: (state, action: PayloadAction<IOption[]>) => {
      state.size = [...action.payload]
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    }
  }
})

export const filterActions = FilterSlice.actions

export default FilterSlice.reducer
