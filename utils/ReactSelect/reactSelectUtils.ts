import { SortBy } from '@store/types/filter-by.enum'
import { Gender } from '@store/types/gender.enum'

export const filterColourStyles = {
  menuList: (styles: any) => ({
    ...styles,
    background: 'var(--white)',
    borderRadius: '4px',
    minWidth: 'fit-content'
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: 'var(--grey-30)'
  }),
  option: (styles: any, { isFocused, isSelected }: any) => ({
    ...styles,
    background: isFocused ? '#f6f6f6' : isSelected ? '#f6f6f6' : undefined,
    color: isSelected ? 'var(--grey-60)' : 'var(--dark) !important',
    zIndex: 1,
    borderRadius: '4px',
    borderBottom: '1px solid black'
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 100,
    borderRadius: '4px',
    border: '1px solid var(--grey-10)',
    boxShadow: 'none'
  }),
  control: (provided: any, { isDisabled, isSelected }: any) => ({
    ...provided,
    boxShadow: 'none',
    color: 'var(--dark)',
    background: 'transparent',
    border: '0',
    borderRadius: '4px',
    cursor: isDisabled ? 'not-allowed !important' : 'default',
    fontWeight: isSelected ? '700' : '400'
  }),
  valueContainer: (provided: any, { isDisabled, isSelected }: any) => ({
    ...provided,
    padding: '0',
    fontSize: '1rem',
    margin: '0',
    background: 'transparent',
    fontWeight: isSelected ? '700' : '400'
  }),
  indicatorSeparator: () => ({}),
  input: (provided: any, { isSelected }: any) => ({
    ...provided,
    margin: '0',
    padding: '0',
    fontWeight: isSelected ? '700' : '400'
  }),
  placeholder: (styles: any, { isDisabled, isSelected }: any) => ({
    ...styles,
    color: isDisabled ? '#aaa !important' : 'var(--dark)',
    fontWeight: isSelected ? '700' : '400'
  })
}

export const multiplefilterColourStyles = {
  menuList: (styles: any) => ({
    ...styles,
    background: 'var(--white)',
    borderRadius: '4px',
    minWidth: 'fit-content'
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: 'var(--grey-30)'
  }),
  option: (styles: any, { isFocused, isSelected }: any) => ({
    ...styles,
    background: isFocused ? '#f6f6f6' : isSelected ? '#f6f6f6' : undefined,
    color: isSelected ? 'var(--grey-60)' : 'var(--dark) !important',
    zIndex: 1,
    borderRadius: '4px'
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 100,
    borderRadius: '4px',
    border: '1px solid var(--grey-10)',
    boxShadow: 'none'
  }),
  control: (provided: any, { isDisabled }: any) => ({
    ...provided,
    boxShadow: 'none',
    color: 'var(--dark)',
    background: 'transparent',
    border: '0',
    borderRadius: '4px',
    cursor: isDisabled ? 'not-allowed !important' : 'default'
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0',
    fontSize: '1rem',
    margin: '0',
    background: 'transparent',
    fontWeight: '700',
    borderRadius: '4px'
  }),
  indicatorSeparator: () => ({}),
  input: (provided: any, { isSelected }: any) => ({
    ...provided,
    margin: '0',
    padding: '0',
    fontWeight: isSelected ? '700' : '400',
    borderRadius: '4px'
  }),
  placeholder: (styles: any, { isDisabled, isSelected }: any) => ({
    ...styles,
    color: isDisabled ? '#aaa !important' : 'var(--dark)',
    fontWeight: isSelected ? '700' : '400'
  })
}

export const sortingColourStyles = {
  menuList: (styles: any) => ({
    ...styles,
    background: 'var(--white)',
    borderRadius: '4px',
    width: '10rem'
  }),
  dropdownIndicator: () => ({
    display: 'none'
  }),
  option: (styles: any, { isFocused, isSelected }: any) => ({
    ...styles,
    background: isFocused ? '#f6f6f6' : isSelected ? '#f6f6f6' : undefined,
    color: isSelected ? 'var(--grey-60)' : 'var(--dark) !important',
    zIndex: 1,
    borderRadius: '4px'
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 100,
    borderRadius: '4px',
    border: '1px solid var(--grey-10)',
    boxShadow: 'none',
    right: '50px'
  }),
  control: (provided: any, { isDisabled }: any) => ({
    ...provided,
    boxShadow: 'none',
    color: 'var(--dark)',
    background: 'transparent',
    border: '0',
    borderRadius: '4px',
    cursor: isDisabled ? 'not-allowed !important' : 'default'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0',
    fontSize: '1rem',
    margin: '0',
    background: 'transparent'
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0',
    padding: '0'
  }),
  placeholder: (styles: any, { isDisabled }: any) => ({
    ...styles,
    color: isDisabled ? '#aaa !important' : 'var(--dark)'
  })
}

export const colourStyles = {
  menuList: (styles: any) => ({
    ...styles,
    background: 'transparent',
    borderRadius: '4px'
  }),
  option: (styles: any, { isFocused, isSelected }: any) => ({
    ...styles,
    background: isFocused ? '#f6f6f6' : isSelected ? '#f4f4f4' : undefined,
    color: 'var(--dark) !important',
    zIndex: 1,
    borderRadius: '4px',
    fontSize: '1rem'
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 100,
    borderRadius: '4px',
    border: '1px solid var(--grey-10)',
    boxShadow: 'none'
  }),
  control: (provided: any, { isFocused, isSelected }: any) => ({
    ...provided,
    boxShadow: 'none',
    color: 'var(--dark)',
    border: 'none',
    borderBottom: '1px solid var(--grey-10) !important',
    borderRadius: '4px'
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0.8rem 0em',
    margin: '0',
    fontSize: '1.2rem'
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0',
    padding: '0'
  }),
  placeholder: (styles: any, { isDisabled }: any) => ({
    ...styles,
    color: 'var(--grey-30)',
    fontWeight: '500'
  })
}

export const sizes = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L ' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' }
]

export const conditions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' }
]

export const genders: {
  value: Gender
  label: string
}[] = [
  { value: Gender.MEN, label: 'Menswear' },
  { value: Gender.WOMEN, label: 'Womenswear' }
]

export const sortingValues = [
  { value: SortBy.PriceLow, label: 'Price (Low first)' },
  { value: SortBy.PriceHigh, label: 'Price (High first)' },
  { value: SortBy.Popular, label: 'Popular' },
  { value: SortBy.Recent, label: 'Recent' }
]
