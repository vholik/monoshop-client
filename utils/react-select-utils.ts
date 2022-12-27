import { Gender } from "@store/types/gender.enum";

export const filterColourStyles = {
  menuList: (styles: any) => ({
    ...styles,
    background: "var(--white)",
    borderRadius: 0,
    position: "fixed",
    width: "9rem",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "var(--grey-30)",
  }),
  option: (styles: any, { isFocused, isSelected }: any) => ({
    ...styles,
    background: isFocused ? "#f6f6f6" : isSelected ? "#f6f6f6" : undefined,
    color: isSelected ? "var(--grey-60)" : "var(--dark) !important",
    zIndex: 1,
    borderRadius: 0,
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 100,
    borderRadius: 0,
    border: "1px solid var(--grey-10)",
    boxShadow: "none",
  }),
  control: (provided: any, { isDisabled }: any) => ({
    ...provided,
    boxShadow: "none",
    color: "var(--dark)",
    background: "transparent",
    border: "0",
    borderRadius: 0,
    cursor: isDisabled ? "not-allowed !important" : "default",
  }),

  valueContainer: (provided: any) => ({
    ...provided,
    padding: "0",
    fontSize: "1rem",
    margin: "0",
    background: "transparent",
  }),
  indicatorSeparator: () => ({}),
  input: (provided: any) => ({
    ...provided,
    margin: "0",
    padding: "0",
  }),
  placeholder: (styles: any, { isDisabled }: any) => ({
    ...styles,
    color: isDisabled ? "#aaa !important" : "var(--dark)",
  }),
};

export const colourStyles = {
  menuList: (styles: any) => ({
    ...styles,
    background: "transparent",
    borderRadius: 0,
  }),

  option: (styles: any, { isFocused, isSelected }: any) => ({
    ...styles,
    background: isFocused ? "#f6f6f6" : isSelected ? "#f4f4f4" : undefined,
    color: "var(--dark) !important",
    zIndex: 1,
    borderRadius: 0,
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 100,
    borderRadius: 0,
    border: "1px solid var(--grey-10)",
    boxShadow: "none",
  }),
  control: (provided: any, { isFocused, isSelected }: any) => ({
    ...provided,
    boxShadow: "none",
    color: "var(--dark)",
    border: "1px solid var(--grey-10) !important",
    borderRadius: 0,
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: "1.2em 1em",
    fontSize: "1rem",
    margin: "0",
  }),
  input: (provided: any) => ({
    ...provided,
    margin: "0",
    padding: "0",
  }),
};

export const sizes = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

export const conditions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
];

export const genders: {
  value: Gender;
  label: string;
}[] = [
  { value: Gender.MEN, label: "Menswear" },
  { value: Gender.WOMEN, label: "Womenswear" },
];
