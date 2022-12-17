import { ItemEntity } from "@store/types/item-entity";
import { colourStyles } from "@utils/react-select-utils";
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
        formatOptionLabel={(option) => (
          <div>
            {option.hexCode ? (
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <div
                  style={{
                    height: "30px",
                    width: "30px",
                    borderRadius: "50%",
                    backgroundColor: `#${option.hexCode}`,
                  }}
                ></div>
                <span>{option.label}</span>
              </div>
            ) : (
              <span>{option.label}</span>
            )}
          </div>
        )}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CustomSelect;
