import { useAppDispatch } from '@store/hooks/redux'
import { filterActions } from '@store/reducers/filter/FilterSlice'
import { Gender } from '@store/types/gender.enum'
import { genders } from './ReactSelect/reactSelectUtils'
import Router from 'next/router'
import { AppDispatch } from '@store/reducers/store'
import { ItemEntity, ItemEntityWithId } from '@store/types/item-entity'
import { getCategories } from '@store/reducers/category/GetCategoriesSlice'
import { getSubcategories } from '@store/reducers/subcategory/GetSubcategoriesSlice'

export const redirectGender = (gender: Gender, dispatch: AppDispatch) => {
  const findGender = genders.find((candidate) => candidate.value === gender)

  if (findGender) dispatch(filterActions.setGender(findGender))

  // Reset categories
  dispatch(filterActions.setCategory(null))
  dispatch(filterActions.setSubcategory([]))

  // Fetch categories with that gener
  dispatch(getCategories(gender))
    .unwrap()
    .catch((e) => console.log(e))

  Router.push('/shop')
}

export const redirectCategory = (
  category: ItemEntityWithId,
  gender: Gender,
  dispatch: AppDispatch
) => {
  redirectGender(gender, dispatch)
  dispatch(filterActions.setCategory({ ...category, label: category.value }))

  if (category) {
    // Fetch categories with that gener
    dispatch(getSubcategories(category.id))
      .unwrap()
      .catch((e) => console.log(e))
  }

  // Reset subcategory
  dispatch(filterActions.setSubcategory([]))
}

export const redirectSubcategory = (
  subcategory: ItemEntityWithId,
  category: ItemEntityWithId,
  gender: Gender,
  dispatch: AppDispatch
) => {
  redirectCategory(category, gender, dispatch)

  dispatch(filterActions.setSubcategory([subcategory]))
}
