import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react'
import ChevronUp from '@public/images/chevron-up.svg'
import ChevronDown from '@public/images/chevron-down.svg'
import CheckIcon from '@public/images/check.svg'
import Image from 'next/image'
import styled from 'styled-components'
import { IOption } from '../CustomSelector.type'
import { Gender } from '@store/types/gender.enum'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { getCategories } from '@store/reducers/category/GetCategoriesSlice'
import { getSubcategories } from '@store/reducers/subcategory/GetSubcategoriesSlice'
import { filterActions } from '@store/reducers/filter/FilterSlice'
import { ItemEntityWithId } from '@store/types/item-entity'

interface CustomSelectorProps<T extends IOption> {
  onChange?: (value: T[]) => any
  value?: T[]
  inputValue?: (value: string) => any
  options?: T[]
}

export const CategorySelector = <T extends IOption>({
  onChange,
  value,
  inputValue,
  options
}: CustomSelectorProps<T>) => {
  const dispatch = useAppDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [currentGender, setCurrentGender] = useState<null | Gender>(null)
  const [currentCategory, setCurrentCategory] = useState<null | number>(null)

  const filter = useAppSelector((state) => state.filterReducer)

  const categoriesStatus = useAppSelector(
    (state) => state.getCategoriesReducer.status
  )
  const categories = useAppSelector(
    (state) => state.getCategoriesReducer.categories
  )

  const selectRef = useRef<HTMLDivElement>(null)

  const switchHandler = () => {
    setIsOpen((prev) => !prev)
  }

  const clearHandler = () => {
    setCurrentGender(null)
    setCurrentCategory(null)

    dispatch(filterActions.setGender(null))
    dispatch(filterActions.setCategory(null))
    dispatch(filterActions.setSubcategory([]))
  }

  const closeSelectByWindow = (e: MouseEvent) => {
    if (!selectRef.current?.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('click', closeSelectByWindow, { capture: true })

    if (filter.gender) {
      setCurrentGender(filter.gender)
    }

    if (filter.category?.id) {
      setCurrentCategory(filter.category.id)
    }

    return () => {
      window.removeEventListener('click', closeSelectByWindow, {
        capture: true
      })
    }
  }, [])

  const genderHandler = (gender: Gender) => {
    if (currentGender === gender) {
      setCurrentGender(null)
    } else {
      setCurrentGender(gender)

      dispatch(getCategories(gender))
        .unwrap()
        .catch((err) => console.log('rejected', err))
    }
  }

  const categoryHandler = (e: ItemEntityWithId) => {
    if (e.id === currentCategory) {
      setCurrentCategory(null)
      dispatch(filterActions.setCategory(null))
      dispatch(filterActions.setSubcategory([]))
    } else {
      setCurrentCategory(e.id)

      if (currentGender) {
        dispatch(filterActions.setGender(currentGender))
      }

      setIsOpen(false)

      dispatch(filterActions.setCategory(e as IOption))

      dispatch(filterActions.setSubcategory([]))

      dispatch(getSubcategories(e.id))
        .unwrap()
        .catch((err) => console.log('rejected', err))
    }
  }

  return (
    <CustomSelectorStyles ref={selectRef}>
      <button
        className="label-btn"
        onClick={switchHandler}
        style={
          currentCategory
            ? { backgroundColor: 'var(--dark)', color: 'var(--white)' }
            : {}
        }
      >
        Category
        {isOpen ? (
          <Image
            src={ChevronUp}
            alt="Chevron down"
            width={20}
            height={20}
            color={'#fff'}
            style={
              currentCategory
                ? { filter: 'invert(1)' }
                : { filter: 'invert(0)' }
            }
          />
        ) : (
          <Image
            src={ChevronDown}
            alt="Chevron down"
            width={20}
            height={20}
            style={
              currentCategory
                ? { filter: 'invert(1)' }
                : { filter: 'invert(0)' }
            }
          />
        )}
      </button>
      <div
        className="select"
        style={
          isOpen
            ? { opacity: 1, pointerEvents: 'all' }
            : { opacity: 0, pointerEvents: 'none' }
        }
      >
        <div className="select-container">
          <button
            className="clear-btn"
            onClick={clearHandler}
            disabled={!currentCategory}
          >
            Clear all
          </button>
        </div>
        <ul className="select-inner">
          <li className="gender" onClick={() => genderHandler(Gender.MEN)}>
            Menswear
            <Image
              src={currentGender === Gender.MEN ? ChevronUp : ChevronDown}
              alt="Chevron down"
              width={20}
              height={20}
            />
          </li>
          <ul className="categories-wrapper">
            {categoriesStatus !== 'loading' &&
              currentGender === Gender.MEN &&
              categories.map((category) => (
                <Fragment key={category.id}>
                  <li
                    className="category"
                    onClick={() => categoryHandler(category)}
                  >
                    {category.value}
                    {currentCategory === category.id && (
                      <Image
                        src={CheckIcon}
                        alt="Check"
                        width={15}
                        height={15}
                      />
                    )}
                  </li>
                </Fragment>
              ))}
          </ul>
          <li className="gender" onClick={() => genderHandler(Gender.WOMEN)}>
            Womenswear
            <Image
              src={currentGender === Gender.WOMEN ? ChevronUp : ChevronDown}
              alt="Chevron down"
              width={20}
              height={20}
            />
          </li>
          <ul className="categories-wrapper">
            {categoriesStatus !== 'loading' &&
              currentGender === Gender.WOMEN &&
              categories.map((category) => (
                <Fragment key={category.id}>
                  <li
                    className="category"
                    onClick={() => categoryHandler(category)}
                  >
                    {category.value}
                    {currentCategory === category.id && (
                      <Image
                        src={CheckIcon}
                        alt="Check"
                        width={15}
                        height={15}
                      />
                    )}
                  </li>
                </Fragment>
              ))}
          </ul>
        </ul>
      </div>
    </CustomSelectorStyles>
  )
}

const CustomSelectorStyles = styled.div`
  position: relative;
  width: fit-content;

  .categories-wrapper {
    .category {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 1rem 0.6rem 1.5rem;
      cursor: pointer;

      &:hover {
        background-color: var(--white-hover);
      }
    }
  }

  .custom-input {
    background-color: #f6f6f6;
    display: flex;
    align-items: center;
    padding: 0rem 0.5rem;
    border-radius: 4px;

    .search-input {
      font-size: 1rem;
      font-family: var(--font-default);
      outline: none;
      border: none;
      background-color: transparent;
      padding: 1rem 0.5rem;
    }
  }

  .clear-btn {
    padding: 0.5rem 1rem;
    background-color: transparent;
    border-radius: 1em;
    border: none;
    font-size: 1rem;
    border: 1px solid var(--stroke);
    width: fit-content;
    font-family: var(--font-default);
    transition: background var(--transition);
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;

      &:hover {
        background-color: inherit;
      }
    }

    &:hover {
      background-color: var(--white-hover);
    }
  }

  .select-line {
    height: 1px;
    background-color: var(--grey-10);
    border: none;
  }

  .submit-btn {
    width: 100%;
    border: none;
    outline: none;
    font-family: var(--font-default);
    font-size: 1rem;
    font-weight: 500;
    padding-top: 1rem;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    background-color: var(--dark);
    color: var(--white);
    transition: background var(--transition);
    cursor: pointer;

    &:disabled {
      background-color: var(--dark-hover);
      cursor: not-allowed;
    }

    &:hover {
      background-color: var(--dark-hover);
    }
  }

  .select-container {
    padding: 1rem;
    padding-bottom: 0;
  }

  .select {
    width: fit-content;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 6px;
    background-color: var(--white);
    position: absolute;
    min-width: 250px;
    top: 3rem;
    left: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--transition);
    z-index: 5;
    padding-bottom: 1rem;

    .select-inner {
      margin-top: 0.5rem;
      display: flex;
      flex-direction: column;

      overflow-y: auto;

      .gender {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem 1rem;
        cursor: pointer;

        &:hover {
          background-color: var(--white-hover);
        }
      }

      .checkbox {
        appearance: none;
        background-color: #fff;
        margin: 0;
        font: inherit;
        color: currentColor;
        width: 1em;
        height: 1em;
        border: 1px solid var(--dark);
        border-radius: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        &::before {
          display: block;
          content: '';
          width: 0.5em;
          height: 0.5em;
          transform: scale(0);
          box-shadow: inset 1em 1em var(--dark);
        }

        &:checked::before {
          transform: scale(1);
        }
      }

      .option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        padding: 0.5rem 0;
        margin-left: 1.5rem;
      }
    }
  }

  .label-btn {
    background-color: transparent;
    border: none;
    font-size: 1rem;
    border-radius: 2em;
    border: 1px solid var(--stroke);
    padding: 0.5em 1em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    &:hover {
      border-color: var(--dark);
    }
  }
`
