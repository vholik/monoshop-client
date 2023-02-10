import { useAppDispatch } from '@store/hooks/redux'
import { getCategories } from '@store/reducers/category/GetCategoriesSlice'
import { wrapper } from '@store/reducers/store'
import { Gender } from '@store/types/gender.enum'
import { ItemEntity, ItemEntityWithId } from '@store/types/item-entity'
import React, { FC, useEffect, useState } from 'react'
import { CategoriesStyles } from './Categories.styles'
import Router from 'next/router'
import { filterActions } from '@store/reducers/filter/FilterSlice'
import instance from '@utils/axios'
import { getSubcategories } from '@store/reducers/subcategory/GetSubcategoriesSlice'
import Link from 'next/link'
import { redirectCategory, redirectGender } from '@utils/redirectionHelper'

const Categories: FC = () => {
  const dispatch = useAppDispatch()
  const [menCategories, setMenCategories] = useState<ItemEntityWithId[]>([])
  const [womenCategories, setWomenCategories] = useState<ItemEntityWithId[]>([])

  const fetchCategories = async (
    gender: Gender
  ): Promise<ItemEntityWithId[]> => {
    try {
      const res = await instance.get<ItemEntityWithId[]>('category', {
        params: {
          gender: gender
        }
      })

      return res.data
    } catch (error: any) {
      return error
    }
  }

  useEffect(() => {
    fetchCategories(Gender.MEN)
      .then((res) => setMenCategories(res))
      .catch((err) => console.log(err))

    fetchCategories(Gender.WOMEN)
      .then((res) => setWomenCategories(res))
      .catch((err) => console.log(err))
  }, [])

  const categoryHandler = (category: ItemEntityWithId, gender: Gender) => {
    redirectCategory(category, gender, dispatch)
  }

  const genderHandler = (gender: Gender) => {
    redirectGender(gender, dispatch)
  }

  return (
    <CategoriesStyles>
      <div className="category">
        <h2 className="category-name" onClick={() => genderHandler(Gender.MEN)}>
          Menswear
        </h2>
        <div className="category-dropdown">
          <div
            className="category-dropdown__subcategory"
            onClick={() => genderHandler(Gender.MEN)}
          >
            See all
          </div>
          {Array.isArray(menCategories) &&
            menCategories.map((category) => (
              <div
                className="category-dropdown__subcategory"
                key={category.id}
                onClick={() => categoryHandler(category, Gender.MEN)}
              >
                {category.value}
              </div>
            ))}
        </div>
      </div>
      <div className="category">
        <h2
          className="category-name"
          onClick={() => genderHandler(Gender.WOMEN)}
        >
          Womenswear
        </h2>
        <div className="category-dropdown">
          <div
            className="category-dropdown__subcategory"
            onClick={() => genderHandler(Gender.WOMEN)}
          >
            See all
          </div>
          {Array.isArray(womenCategories) &&
            womenCategories.map((category) => (
              <div
                className="category-dropdown__subcategory"
                key={category.id}
                onClick={() => categoryHandler(category, Gender.WOMEN)}
              >
                {category.value}
              </div>
            ))}
        </div>
      </div>
      <div className="category">
        <Link href={'/brands'}>
          <h2 className="category-name">Brands</h2>
        </Link>
      </div>
    </CategoriesStyles>
  )
}

export default Categories
