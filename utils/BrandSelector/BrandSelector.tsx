import { ChangeEvent, useEffect, useRef, useState } from 'react'
import ChevronUp from '@public/images/chevron-up.svg'
import ChevronDown from '@public/images/chevron-down.svg'
import SearchIcon from '@public/images/search.svg'
import Image from 'next/image'
import styled from 'styled-components'
import { IOption } from '../CustomSelector.type'
import { useAppSelector } from '@store/hooks/redux'

interface CustomSelectorProps<T extends IOption> {
  onChange: (value: T[]) => any
  value?: T[]
  inputValue?: (value: string) => any
  options: T[]
}

export const BrandSelector = <T extends IOption>({
  onChange,
  value,
  inputValue,
  options
}: CustomSelectorProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [chosen, setChosen] = useState<T[]>([])

  const selectRef = useRef<HTMLDivElement>(null)

  const storedBrands = useAppSelector((store) => store.filterReducer.brand)

  const storedBrandsNumber = storedBrands && storedBrands.length

  const submitHandler = () => {
    onChange(chosen)
  }

  const switchHandler = () => {
    setIsOpen((prev) => !prev)
  }

  const changeHandler = (e: ChangeEvent<HTMLInputElement>, option: T) => {
    const isChecked = e.target.checked
    if (isChecked) {
      setChosen((prev) => [...prev, option])
    } else {
      setChosen(chosen.filter((it) => it.value !== option.value))
    }
  }

  const clearHandler = () => {
    setChosen([])
    onChange([])
  }

  const isChecked = (option: T) => {
    const find = chosen.find((it) => it.value === option.value)

    if (find) {
      return true
    }

    return false
  }

  const closeSelectByWindow = (e: MouseEvent) => {
    if (!selectRef.current?.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('click', closeSelectByWindow, { capture: true })

    return () => {
      window.removeEventListener('click', closeSelectByWindow, {
        capture: true
      })
    }
  }, [])

  useEffect(() => {
    if (value) {
      setChosen(value)
    }
  }, [value])

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (inputValue) {
      inputValue(value)
    }
  }

  return (
    <CustomSelectorStyles ref={selectRef}>
      <button
        className="label-btn"
        onClick={switchHandler}
        style={
          storedBrandsNumber
            ? { backgroundColor: 'var(--dark)', color: 'var(--white)' }
            : {}
        }
      >
        {!!storedBrandsNumber && <span>{storedBrandsNumber}</span>}
        Brands
        {isOpen ? (
          <Image
            src={ChevronUp}
            alt="Chevron down"
            width={20}
            height={20}
            color={'#fff'}
            style={
              storedBrandsNumber
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
              storedBrandsNumber
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
          <div className="custom-input">
            <Image src={SearchIcon} alt="Search" />
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              maxLength={50}
              onChange={inputHandler}
            />
          </div>
          <button
            className="clear-btn"
            onClick={clearHandler}
            disabled={!chosen.length}
          >
            Clear all
          </button>
        </div>

        <div className="select-inner">
          {chosen
            .concat(
              options.filter(
                (it) => !chosen.find((it2) => it.value === it2.value)
              )
            )
            .map((item: T) => (
              <div className="option" key={item.value}>
                <input
                  checked={isChecked(item)}
                  type="checkbox"
                  className="checkbox"
                  onChange={(e) => changeHandler(e, item)}
                />
                {item.label}
              </div>
            ))}
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
    margin-top: 1rem;

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
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--transition);
    z-index: 5;

    .select-inner {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-height: 200px;
      max-height: 200px;
      overflow-y: auto;
      padding: 0rem 1rem 0.5rem 1rem;

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
        font-size: 1.1rem;
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
