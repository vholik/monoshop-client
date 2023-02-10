import { ChangeEvent, useEffect, useRef, useState } from 'react'
import ChevronUp from '@public/images/chevron-up.svg'
import ChevronDown from '@public/images/chevron-down.svg'
import SearchIcon from '@public/images/search.svg'
import Image from 'next/image'
import styled from 'styled-components'
import { IOption } from '@utils/CustomSelector.type'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { filterActions } from '@store/reducers/filter/FilterSlice'

interface CustomSelectorProps<T extends IOption> {
  onChange: (value: T[]) => any
  value?: T[]
  options: T[]
  label: string
}

export const PriceSelector = () => {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)

  const storedPrice = useAppSelector((store) => store.filterReducer.price)

  const isPriceSumbited = !!storedPrice?.[0] || !!storedPrice?.[1]

  const [price, setPrice] = useState<{ [value: string]: number }>({
    min: 0,
    max: 0
  })

  const selectRef = useRef<HTMLDivElement>(null)

  const submitHandler = () => {
    dispatch(filterActions.changePage(1))
    if (!price.min && !price.max) {
      dispatch(filterActions.setPrice([]))
    } else {
      dispatch(filterActions.setPrice([price.min || 0, price.max || 10000]))
    }
  }

  const switchHandler = () => {
    setIsOpen((prev) => !prev)
  }

  const clearHandler = () => {
    setPrice({ min: 0, max: 0 })
    if (isPriceSumbited) {
      dispatch(filterActions.changePage(1))
      dispatch(filterActions.setPrice([]))
    }
  }

  const closeSelectByWindow = (e: MouseEvent) => {
    if (!selectRef.current?.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    // Set store values when mounts
    if (storedPrice?.length) {
      setPrice({
        min: storedPrice[0],
        max: storedPrice[1]
      })
    }

    window.addEventListener('click', closeSelectByWindow, { capture: true })

    return () => {
      window.removeEventListener('click', closeSelectByWindow, {
        capture: true
      })
    }
  }, [])

  return (
    <CustomSelectorStyles ref={selectRef}>
      <button
        className="label-btn"
        onClick={switchHandler}
        style={
          isPriceSumbited
            ? { backgroundColor: 'var(--dark)', color: 'var(--white)' }
            : {}
        }
      >
        Price
        {isOpen ? (
          <Image
            src={ChevronUp}
            alt="Chevron down"
            width={20}
            height={20}
            color={'#fff'}
            style={
              isPriceSumbited
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
              isPriceSumbited
                ? { filter: 'invert(1)' }
                : { filter: 'invert(0)' }
            }
          />
        )}
      </button>
      <div
        className="select"
        style={isOpen ? { display: 'block' } : { display: 'none' }}
      >
        <div className="select-container">
          <button
            className="clear-btn"
            onClick={clearHandler}
            disabled={!storedPrice?.length}
          >
            Reset
          </button>
        </div>
        <div className="select-inner">
          <div className="left">
            <label className="label">
              Min
              <input
                value={price.min || ''}
                type="num"
                placeholder="Min"
                className="input"
                min={0}
                max={10000}
                onChange={(e) => {
                  if (
                    Number(e.target.value) <= 10000 &&
                    Number(e.target.value) >= 0
                  ) {
                    setPrice({ ...price, min: Number(e.target.value) })
                  }
                }}
              />
            </label>
          </div>
          <div className="price-line"></div>
          <div className="right">
            <label className="label">
              Max
              <input
                onChange={(e) => {
                  if (
                    Number(e.target.value) <= 10000 &&
                    Number(e.target.value) >= 0
                  ) {
                    setPrice({ ...price, max: Number(e.target.value) })
                  }
                }}
                type="num"
                value={price.max || ''}
                placeholder="Max"
                className="input"
                max={100000}
              />
            </label>
          </div>
        </div>
        <hr className="select-line" />
        <div className="select-container">
          <button className="submit-btn" onClick={submitHandler}>
            Submit
          </button>
        </div>
      </div>
    </CustomSelectorStyles>
  )
}

const CustomSelectorStyles = styled.div`
  position: relative;
  width: fit-content;

  .color-circle {
    border-radius: 50%;
    min-height: 15px;
    min-width: 15px;
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
    margin-top: 1rem;
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
  }

  .select {
    width: fit-content;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 6px;
    background-color: var(--white);
    position: absolute;
    top: 3rem;
    left: 0;
    transition: opacity var(--transition);
    z-index: 5;
    width: max-content;

    .select-inner {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 0 1rem;

      .label {
        max-width: 60px;
      }

      .price-line {
        height: 1px;
        min-width: 1rem;
        background-color: var(--grey-30);
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
