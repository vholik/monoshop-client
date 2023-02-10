import { ChangeEvent, useEffect, useRef, useState } from 'react'
import ChevronUp from '@public/images/chevron-up.svg'
import ChevronDown from '@public/images/chevron-down.svg'
import SearchIcon from '@public/images/search.svg'
import Image from 'next/image'
import styled from 'styled-components'
import { IOption } from '@utils/CustomSelector.type'
import { useAppDispatch } from '@store/hooks/redux'
import { filterActions } from '@store/reducers/filter/FilterSlice'

interface CustomSelectorProps<T extends IOption> {
  onChange: (value: T[]) => any
  value?: T[]
  options: T[]
  label: string
}

export const CustomSelector = <T extends IOption>({
  onChange,
  value,
  options,
  label
}: CustomSelectorProps<T>) => {
  const dispatch = useAppDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [chosen, setChosen] = useState<T[]>([])

  const [submitedOptionsLength, setSubmitedOptionsLength] = useState(0)

  const selectRef = useRef<HTMLDivElement>(null)

  const submitHandler = () => {
    onChange(chosen)
    dispatch(filterActions.changePage(1))
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

    if (submitedOptionsLength) {
      onChange([])
      dispatch(filterActions.changePage(1))
    }
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

      setSubmitedOptionsLength(value.length)
    }
  }, [value])

  return (
    <CustomSelectorStyles ref={selectRef}>
      <button
        className="label-btn"
        onClick={switchHandler}
        style={
          submitedOptionsLength
            ? { backgroundColor: 'var(--dark)', color: 'var(--white)' }
            : {}
        }
      >
        {!!submitedOptionsLength && <span>{submitedOptionsLength}</span>}
        {label}
        {isOpen ? (
          <Image
            src={ChevronUp}
            alt="Chevron down"
            width={20}
            height={20}
            color={'#fff'}
            style={
              submitedOptionsLength
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
              submitedOptionsLength
                ? { filter: 'invert(1)' }
                : { filter: 'invert(0)' }
            }
          />
        )}
      </button>
      <div
        className="select"
        style={
          // Old implementation breaks the rules of accesibility
          // isOpen
          //   ? { opacity: 1, pointerEvents: 'all', display: 'block' }
          //   : { opacity: 0, pointerEvents: 'none', display: 'none' }
          isOpen ? { display: 'block' } : { display: 'none' }
        }
      >
        <div className="select-container">
          <button
            className="clear-btn"
            onClick={clearHandler}
            disabled={!chosen.length}
          >
            Clear all
          </button>
        </div>

        <div className="select-inner">
          {options.map((item: T) => (
            <div className="option" key={item.value}>
              <input
                checked={isChecked(item)}
                type="checkbox"
                className="checkbox"
                onChange={(e) => changeHandler(e, item)}
              />
              {item.hexCode && (
                <div
                  className="color-circle"
                  style={{ backgroundColor: `#${item.hexCode}` }}
                ></div>
              )}
              {item.label}
            </div>
          ))}
        </div>
        <hr className="select-line" />
        <div className="select-container">
          <button
            className="submit-btn"
            onClick={submitHandler}
            disabled={!chosen.length}
          >
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
    max-height: 15px;
    max-width: 15px;
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
    min-width: 200px;

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
