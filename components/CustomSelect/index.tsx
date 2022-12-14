import Select from "react-select";

interface SelectProps {
  placeholder: string;
  name: string;
}

const colourStyles = {
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
  }),
};

const CustomSelect = ({ placeholder, name }: SelectProps) => (
  <div>
    <Select
      placeholder="Select a category"
      styles={colourStyles}
      // options={options}
      className="select"
      isDisabled={false}
      isLoading={false}
      isSearchable={true}
      name="category"
    />
  </div>
);

export default CustomSelect;
