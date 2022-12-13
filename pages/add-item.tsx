import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import styled from "styled-components";
import { useState } from "react";
import Select from "react-select";
import Footer from "@components/Footer/Footer";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

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

export default function AddItem() {
  return (
    <AddItemStyles>
      <Header />
      <Categories />
      <div className="container">
        <div className="wrapper">
          <h1 className="title-md">Add new item</h1>
          <div className="inner">
            <div className="row"></div>
            <div className="row">
              <label className="label">
                Category
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
              <label className="label">
                Style
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
              <label className="label">
                Colour
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
              <label className="label">
                Price
                <input
                  type="number"
                  className="input"
                  placeholder="Select a price"
                />
              </label>
              <button className="button">Save</button>
            </div>
            {/* Third row */}
            <div className="row">
              <label className="label">
                Condition
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
              <label className="label">
                Brand
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
              <label className="label">
                Size
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </AddItemStyles>
  );
}

const AddItemStyles = styled.div`
  .wrapper {
    border-top: 1px solid var(--grey-10);
  }

  .label {
    margin-bottom: 1rem;
  }

  .title-md {
    margin-top: 2rem;
  }

  .inner {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 2rem;

    .select,
    .input {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }

  .button {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
  }
`;
