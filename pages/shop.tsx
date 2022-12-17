import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import styled from "styled-components";
import Select, { MultiValue } from "react-select";
import {
  conditions,
  filterColourStyles,
  sizes,
} from "@utils/react-select-utils";
import { useAppDispatch } from "@store/hooks/redux";
import { getItems } from "@store/reducers/item/GetItemsSlice";
import { GetServerSideProps } from "next";
import { wrapper } from "@store/reducers/store";
import { Item } from "@store/types/item";
import Image from "next/image";
import { getTrackBackground, Range } from "react-range";
import { useState } from "react";
import { getBrands } from "@store/reducers/item/GetBrandsSlice";
import { getStyles } from "@store/reducers/item/GetStylesSlice";
import { getColours } from "@store/reducers/item/GetColoursSlice";
import { ItemEntity } from "@store/types/item-entity";

interface IShopProps {
  items: Item[];
  brands: ItemEntity[];
  colours: ItemEntity[];
  styles: ItemEntity[];
}

const STEP = 0.1;
const MIN = 0;
const MAX = 10000;

function Shop({ items, brands, colours, styles }: IShopProps) {
  const filterHandler = (e: MultiValue<{ label: string; value: string }>) => {
    console.log(e);
  };

  const [values, setValues] = useState([0, 10000]);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  return (
    <ShopStyling onClick={() => setIsPriceOpen(false)}>
      <Header />
      <Categories />
      <div className="container">
        <div className="wrapper">
          <div className="filter">
            <div className="filter-inner">
              <div className="price">
                <p
                  className="price-tag"
                  onClick={(e) => {
                    e.stopPropagation(), setIsPriceOpen(!isPriceOpen);
                  }}
                >
                  Price
                </p>
                <div className="price-arrow">
                  <svg
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                  </svg>
                </div>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="price-handler"
                  style={isPriceOpen ? undefined : { display: "none" }}
                >
                  <Range
                    values={values}
                    step={STEP}
                    min={MIN}
                    max={MAX}
                    onChange={(values) => setValues(values)}
                    renderTrack={({ props, children }) => (
                      <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                          ...props.style,
                          height: "36px",
                          display: "flex",
                          width: "100%",
                        }}
                      >
                        <div
                          ref={props.ref}
                          style={{
                            height: "5px",
                            width: "100%",
                            borderRadius: "4px",
                            background: getTrackBackground({
                              values,
                              colors: [
                                "var(--grey-30)",
                                "var(--dark)",
                                "var(--grey-30)",
                              ],
                              min: MIN,
                              max: MAX,
                            }),
                            alignSelf: "center",
                          }}
                        >
                          {children}
                        </div>
                      </div>
                    )}
                    renderThumb={({ index, props, isDragged }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: "25px",
                          width: "25px",
                          borderRadius: "4px",
                          backgroundColor: "#FFF",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border: "1px solid var(--grey-30)",
                          outline: "none",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "-28px",
                            color: "#fff",
                            fontWeight: "400",
                            fontSize: "14px",
                            fontFamily: "var(--font-default)",
                            padding: "4px",
                            borderRadius: "4px",
                            backgroundColor: "var(--dark)",
                          }}
                        >
                          {values[index].toFixed(1)}
                        </div>
                        <div
                          style={{
                            height: "16px",
                            width: "5px",
                            backgroundColor: isDragged
                              ? "var(--grey-30)"
                              : "var(--grey-30)",
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
              <Select
                placeholder={"Size"}
                styles={filterColourStyles}
                onChange={filterHandler}
                options={sizes}
                isMulti
                className="select"
                required={true}
                isDisabled={false}
                isLoading={false}
                isSearchable={true}
                name={"size"}
                instanceId="size-select"
                isClearable={true}
              />
              <Select
                placeholder={"Condition"}
                styles={filterColourStyles}
                isMulti
                options={conditions}
                className="select"
                required={true}
                isDisabled={false}
                isLoading={false}
                isSearchable={true}
                name={"condition"}
                isClearable={true}
                instanceId="condition-select"
              />
              <Select
                placeholder={"Brand"}
                styles={filterColourStyles}
                isMulti
                options={brands}
                className="select"
                required={true}
                isDisabled={false}
                isLoading={false}
                isSearchable={true}
                name={"brand"}
                isClearable={true}
                instanceId="brand-select"
              />
              <Select
                placeholder={"Style"}
                styles={filterColourStyles}
                isMulti
                options={styles}
                className="select"
                required={true}
                isDisabled={false}
                isLoading={false}
                isSearchable={true}
                name={"style"}
                isClearable={true}
                instanceId="style-select"
              />
              <Select
                placeholder={"Colour"}
                styles={filterColourStyles}
                isMulti
                options={colours}
                className="select"
                required={true}
                isDisabled={false}
                isLoading={false}
                isSearchable={true}
                name={"colour"}
                isClearable={true}
                instanceId="colour-select"
                formatOptionLabel={(option) => (
                  <div>
                    {option.hexCode ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            minHeight: "30px",
                            minWidth: "30px",
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
            </div>
            <Select
              placeholder={"Sort by"}
              styles={filterColourStyles}
              options={[
                { name: "popular", label: "Popular" },
                { name: "price-low", label: "Price (Low first)" },
                { name: "price-high", label: "Price (Hight first)" },
              ]}
              className="select"
              required={true}
              isDisabled={false}
              isLoading={false}
              isSearchable={true}
              name={"sort"}
              instanceId="style-select"
            />
          </div>
          <div className="items-wrapper">
            {items.map((item) => (
              <div className="item" key={item.id}>
                <div className="item-image">
                  <Image
                    src={item.images[0]}
                    alt="Image"
                    style={{ objectFit: "cover" }}
                    fill
                  />
                </div>
                <p className="item-price">{item.price} PLN</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShopStyling>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const items = await store.dispatch(getItems());
    const brands = await store.dispatch(getBrands());
    const styles = await store.dispatch(getStyles());
    const colours = await store.dispatch(getColours());

    const props = {
      items: await items.payload,
      brands: await brands.payload,
      styles: await styles.payload,
      colours: await colours.payload,
    };

    if (!props.items || !props.brands || !props.colours || !props.styles) {
      return {
        props: {
          items: [],
          brands: [],
          styles: [],
          colours: [],
        },
      };
    }

    return {
      props,
    };
  }
);

export default Shop;

const ShopStyling = styled.div`
  .wrapper {
    border-top: 1px solid var(--grey-10);
  }

  .filter {
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .filter-inner {
    width: max-content;
    display: flex;

    gap: 1rem;
    max-height: 500px;
  }

  .price {
    position: relative;
    display: flex;
    align-items: center;

    .price-tag {
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .price-arrow {
      display: flex;
      align-items: center;
      padding: 8px;

      svg {
        fill: var(--grey-30);
      }
    }

    .price-handler {
      top: 270px;
      z-index: 5;
      position: fixed;
      background-color: white;
      padding: 0.5rem 1.5rem;
      width: 14rem;
      border: 1px solid var(--grey-10);
    }
  }

  .items-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 2rem;
    margin-top: 1rem;

    .item {
      .item-image {
        aspect-ratio: 1 / 1.2;
        position: relative;
      }

      .item-price {
        margin-top: 0.5rem;
      }
    }
  }
`;
