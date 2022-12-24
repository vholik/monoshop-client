import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import styled from "styled-components";
import Select, {
  components,
  MultiValue,
  SingleValue,
  ValueContainerProps,
} from "react-select";
import {
  conditions,
  filterColourStyles,
  genders,
  sizes,
} from "@utils/react-select-utils";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { getItems } from "@store/reducers/item/GetItemsSlice";
import { wrapper } from "@store/reducers/store";
import Image from "next/image";
import { getTrackBackground, Range } from "react-range";
import { useEffect, useRef, useState } from "react";
import { getBrands } from "@store/reducers/item/GetBrandsSlice";
import { getStyles } from "@store/reducers/item/GetStylesSlice";
import { getColours } from "@store/reducers/item/GetColoursSlice";
import { ItemEntity } from "@store/types/item-entity";
import { getCategories } from "@store/reducers/item/GetCategoriesSlice";
import { Gender } from "@store/types/gender.enum";
import { IFileringData, IFilter } from "@store/types/filter";
import { FilterBy } from "@store/types/filter-by.enum";
import Link from "next/link";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { Item } from "@store/types/item";

interface IShopProps {
  brands: ItemEntity[];
  colours: ItemEntity[];
  styles: ItemEntity[];
}

const STEP = 1;
const MIN = 0;
const MAX = 10000;

const Shop = ({ brands, colours, styles }: IShopProps) => {
  const dispatch = useAppDispatch();

  const { items, isItemsLoading, itemsError, total } = useAppSelector(
    (state) => state.getItemsReducer
  );

  console.log(items);

  const { categories, categoriesError, isCategoriesLoading } = useAppSelector(
    (state) => state.getCategoriesReducer
  );

  const categorieRef = useRef<any>(null);

  const [values, setValues] = useState([0, 10000]);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [filterData, setFilterData] = useState<IFilter>({
    price: [0, 10000],
    gender: undefined,
    category: [],
    size: [],
    condition: [],
    brand: [],
    style: [],
    colour: [],
    sortBy: FilterBy.Popular,
    page: 1,
  });

  const nextPage = (page: number) => {
    setFilterData({
      ...filterData,
      page: page,
    });
  };

  useEffect(() => {
    if (filterData.gender) {
      dispatch(getCategories(filterData.gender));

      if (categorieRef.current) {
        categorieRef.current.clearValue();
      }
    }
  }, [filterData.gender]);

  useEffect(() => {
    if (itemsError || isItemsLoading) return;

    if (items && filterData)
      dispatch(getItems(filterData))
        .unwrap()
        .then(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        })
        .catch((error) => {
          console.error("rejected", error);
        });
  }, [filterData]);

  const genderHandler = (
    e: SingleValue<{
      value: string;
      label: string;
    }>
  ) => {
    if (e) {
      setFilterData({
        ...filterData,
        gender: e?.value as Gender,
      });
    }
  };

  const priceValuesHandler = (values: number[]) => {
    setValues(values);
  };

  const priceHandler = () => {
    if (isItemsLoading) return;

    const isPreviousPrice =
      Math.round(values[0]) === filterData.price[0] &&
      Math.round(values[1]) === filterData.price[1];

    if (!isPreviousPrice) {
      setFilterData({
        ...filterData,
        price: [Math.round(values[0]), Math.round(values[1])],
      });
    }
  };

  const filterHandler = (
    e: MultiValue<ItemEntity>,
    filterName: keyof IFilter
  ) => {
    if (e) {
      const mapped = e.map((item) => {
        return item.value;
      });

      setFilterData({
        ...filterData,
        [filterName]: mapped,
      });
    }
  };

  return (
    <ShopStyling onClick={() => setIsPriceOpen(false)}>
      <Header />
      <Categories />

      <div className="wrapper">
        <div className="filter">
          <div className="filter-inner">
            <div
              className="price"
              onClick={(e) => {
                e.stopPropagation(), setIsPriceOpen(!isPriceOpen);
              }}
            >
              <p className="price-tag">Price</p>
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
                <div className="price-range">
                  <Range
                    values={values}
                    step={STEP}
                    min={MIN}
                    max={MAX}
                    onChange={(values) => priceValuesHandler(values)}
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
                <button
                  disabled={isItemsLoading}
                  className="button price--buton"
                  onClick={priceHandler}
                >
                  Apply
                </button>
              </div>
            </div>
            <Select
              placeholder={"Gender"}
              styles={filterColourStyles}
              onChange={genderHandler}
              options={genders}
              className="select"
              required={true}
              isDisabled={false}
              isLoading={false}
              isSearchable={true}
              name={"gender"}
              instanceId="gender-select"
            />
            <Select
              ref={categorieRef}
              placeholder={"Categories"}
              styles={filterColourStyles}
              onChange={(e) => filterHandler(e, "category" as keyof IFilter)}
              options={categories}
              isMulti
              className="select"
              required={true}
              isDisabled={!filterData.gender || Boolean(categoriesError)}
              isLoading={isCategoriesLoading}
              isSearchable={true}
              name={"category"}
              instanceId="category-select"
              isClearable={true}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                ValueContainer,
              }}
            />
            <Select
              placeholder={"Size"}
              styles={filterColourStyles}
              onChange={(e) => filterHandler(e, "size" as keyof IFilter)}
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
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                ValueContainer,
              }}
            />
            <Select
              placeholder={"Condition"}
              styles={filterColourStyles}
              isMulti
              options={conditions}
              className="select"
              required={true}
              isDisabled={false}
              onChange={(e) => filterHandler(e, "condition" as keyof IFilter)}
              isLoading={false}
              isSearchable={true}
              name={"condition"}
              isClearable={true}
              instanceId="condition-select"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                ValueContainer,
              }}
            />
            <Select
              placeholder={"Brand"}
              styles={filterColourStyles}
              isMulti
              options={brands}
              className="select"
              onChange={(e) => filterHandler(e, "brand" as keyof IFilter)}
              required={true}
              isDisabled={false}
              isLoading={false}
              isSearchable={true}
              name={"brand"}
              isClearable={true}
              instanceId="brand-select"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                ValueContainer,
              }}
            />
            <Select
              placeholder={"Style"}
              styles={filterColourStyles}
              isMulti
              options={styles}
              className="select"
              onChange={(e) => filterHandler(e, "style" as keyof IFilter)}
              required={true}
              isDisabled={false}
              isLoading={false}
              isSearchable={true}
              name={"style"}
              isClearable={true}
              instanceId="style-select"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                ValueContainer,
              }}
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
              onChange={(e) => filterHandler(e, "colour" as keyof IFilter)}
              isClearable={true}
              instanceId="colour-select"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                ValueContainer,
              }}
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
              isClearable={true}
              instanceId="style-select"
              closeMenuOnSelect={false}
            />
          </div>
        </div>
        <div className="container">
          <div className="items-wrapper">
            {items.map((item) => (
              <div className="item" key={item.id}>
                <Link href={`/shop/${item.id}`}>
                  <div className="item-image">
                    <Image
                      src={item.images[0]}
                      alt="Image"
                      style={{ objectFit: "cover" }}
                      fill
                    />
                  </div>
                </Link>
                <h2 className="item-price">{item.price} PLN</h2>
                <p className="item-size">{item.size}</p>
              </div>
            ))}
          </div>
          <Pagination
            disabled={isItemsLoading}
            simple
            onChange={(page) => nextPage(page)}
            defaultCurrent={1}
            total={items.length === 0 ? 1 : total}
            pageSize={12}
          />
        </div>
      </div>
    </ShopStyling>
  );
};

const ValueContainer = ({
  children,
  ...props
}: ValueContainerProps<ItemEntity>) => {
  let [values, input] = children as any;

  if (Array.isArray(values)) {
    const plural = values.length === 1 ? "" : "s";
    values = `${values.length} item${plural} selected`;
  }

  return (
    <components.ValueContainer {...props}>
      {values}
      {input}
    </components.ValueContainer>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  const brands = await store.dispatch(getBrands());
  const styles = await store.dispatch(getStyles());
  const colours = await store.dispatch(getColours());
  await store.dispatch(
    getItems({
      price: [0, 10000],
      gender: undefined,
      category: [],
      size: [],
      condition: [],
      brand: [],
      style: [],
      colour: [],
      sortBy: FilterBy.Popular,
      page: 1,
    })
  );

  const props = {
    brands: await brands.payload,
    styles: await styles.payload,
    colours: await colours.payload,
  };

  if (!props.brands || !props.colours || !props.styles) {
    return {
      props: {
        brands: [],
        styles: [],
        colours: [],
      },
    };
  }

  return {
    props,
  };
});

export default Shop;

const ShopStyling = styled.div`
  //Pagination styling
  .rc-pagination-next button,
  .rc-pagination-prev button {
    &:hover {
      color: var(--dark) !important;
    }
  }

  .rc-pagination-simple .rc-pagination-simple-pager input {
    &:hover {
      border: 1px solid #d9d9d9;
    }
  }

  .rc-pagination {
    display: flex;
    margin-top: 5rem;
    justify-content: end;
  }

  // Other
  .filter {
    margin-top: 1rem;
    margin-left: 50px;
    margin-right: 50px;
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
      top: 220px;
      z-index: 5;
      position: fixed;
      background-color: white;
      padding: 1rem 1rem;
      width: 14rem;
      border: 1px solid var(--grey-10);
      align-items: center;
      display: flex;
      flex-direction: column;

      .price-range {
        width: 100%;
        padding: 0 12 px;
      }
    }
  }

  .price--buton {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    justify-content: center;
    display: flex;
    width: 100%;
  }

  .items-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 2rem;
    grid-row-gap: 2rem;
    margin-top: 2rem;

    .item {
      .item-image {
        aspect-ratio: 1 / 1.2;
        position: relative;
      }

      .item-size {
        margin-top: 0.5rem;
        color: var(--grey-60);
      }

      .item-price {
        font-size: 1.1rem;
        margin-top: 1rem;
        font-weight: 600;
      }
    }
  }
`;
