import { ItemEntity } from "@store/types/item-entity";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import Select, { GroupBase, Props, SingleValue } from "react-select";

interface SelectProps {
  placeholder: string;
  name: string;
  options: ItemEntity[];
  isLoading: boolean;
  error: string;
  disabled?: boolean;
  handleSelectChange: (e: SingleValue<ItemEntity>, name: string) => void;
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
    margin: "0",
  }),
  input: (provided: any) => ({
    ...provided,
    margin: "0",
  }),
};

interface ISelect {
  clearValue: () => void;
}

const CustomSelect = ({
  placeholder,
  name,
  options,
  isLoading,
  error,
  handleSelectChange,
  disabled,
}: SelectProps) => {
  const isCategory = name === "category";

  const selectRef = useRef<any>();

  // Clear value when gender changes
  useEffect(() => {
    if (isCategory && selectRef.current) {
      selectRef.current.clearValue();
    }
  }, [isLoading]);

  return (
    <div>
      <Select
        onChange={(e) => handleSelectChange(e, name)}
        placeholder={placeholder}
        styles={colourStyles}
        options={options}
        className="select"
        required={true}
        isDisabled={isLoading || Boolean(error) || disabled}
        isLoading={isLoading}
        isSearchable={true}
        name={name}
        isClearable={true}
        ref={selectRef}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CustomSelect;
