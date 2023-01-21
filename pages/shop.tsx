import Categories from "@components/Categories/Categories";
import Header from "@components/Header/Header";
import styled from "styled-components";
import Select, {
  components,
  GroupBase,
  MultiValue,
  SelectInstance,
  SingleValue,
  ValueContainerProps,
} from "react-select";
import {
  conditions,
  filterColourStyles,
  genders,
  multiplefilterColourStyles,
  sizes,
  sortingColourStyles,
  sortingValues,
} from "@utils/react-select/reactSelectUtils";
import {
  useActionCreators,
  useAppDispatch,
  useAppSelector,
} from "@store/hooks/redux";
import { getItems, setFavorite } from "@store/reducers/item/GetItemsSlice";
import Image from "next/image";
import { getTrackBackground, Range } from "react-range";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { getBrands } from "@store/reducers/brand/GetBrandsSlice";
import { getStyles } from "@store/reducers/style/GetStylesSlice";
import { getColours } from "@store/reducers/colour/GetColoursSlice";
import { ItemEntity, ItemEntityWithId } from "@store/types/item-entity";
import { getCategories } from "@store/reducers/category/GetCategoriesSlice";
import { Gender } from "@store/types/gender.enum";
import { IFilter } from "@store/types/filter";
import { SortBy } from "@store/types/filter-by.enum";
import Link from "next/link";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import UnfilledWhiteHeart from "@public/images/unfilled-white-heart.svg";
import FilledHeart from "@public/images/filled-heart.svg";
import { getSubcategories } from "@store/reducers/subcategory/GetSubcategoriesSlice";
import SortingIcon from "@public/images/filter.svg";
import { toggleFavorite } from "@store/reducers/favorite/ToggleFavoriteSlice";
import Footer from "@components/Footer/Footer";
import useDebounce from "@utils/useDebounce";
import StateManagedSelect from "react-select";
import ReactSelect from "react-select";
import { filterActions } from "@store/reducers/filter/FilterSlice";
import Layout from "@components/Layout/Layout";

const STEP = 1;
const MIN = 0;
const MAX = 10000;

const Shop = () => {
  const dispatch = useAppDispatch();

  const filter = useAppSelector((state) => state.filterReducer);

  const items = useAppSelector((state) => state.getItemsReducer.items);
  const itemsStatus = useAppSelector((state) => state.getItemsReducer.status);
  const itemsTotal = useAppSelector((state) => state.getItemsReducer.total);

  const favoriteToggleStatus = useAppSelector(
    (state) => state.toggleFavoriteReducer.status
  );

  const brandStatus = useAppSelector((state) => state.getBrandsReducer.status);
  const brands = useAppSelector((state) => state.getBrandsReducer.brands);

  const colours = useAppSelector((state) => state.getColoursReducer.colours);
  const coloursStatus = useAppSelector(
    (state) => state.getColoursReducer.status
  );

  const stylesStatus = useAppSelector((state) => state.getStylesReducer.status);
  const styles = useAppSelector((state) => state.getStylesReducer.styles);

  const subcategories = useAppSelector(
    (state) => state.getSubcategoriesReducer.subcategories
  );
  const subcategoriesStatus = useAppSelector(
    (state) => state.getSubcategoriesReducer.status
  );

  const categoriesStatus = useAppSelector(
    (state) => state.getCategoriesReducer.status
  );
  const categories = useAppSelector(
    (state) => state.getCategoriesReducer.categories
  );

  const [values, setValues] = useState([0, 10000]);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const debouncedValue = useDebounce<IFilter>(filter, 1000);

  const convertFilterToQuery = useMemo(
    () => (): IFilter => {
      const obj = {
        brand: filter.brand
          ? filter.brand.map((brand) => brand.value)
          : undefined,
        category: filter.category ? filter.category.id : undefined,
        colour: filter.colour
          ? filter.colour.map((colour) => colour.value)
          : undefined,
        condition: filter.condition
          ? filter.condition.map((condition) => condition.value)
          : undefined,
        gender: filter.gender ? filter.gender.value : undefined,
        page: filter.page ? filter.page : undefined,
        price: filter.price ? filter.price : undefined,
        search: filter.search ? filter.search : undefined,
        size: filter.size ? filter.size.map((size) => size.value) : undefined,
        sortBy: filter.sortBy ? filter.sortBy.value : undefined,
        style: filter.style
          ? filter.style.map((style) => style.value)
          : undefined,
        subcategory: filter.subcategory
          ? filter.subcategory.map((category) => category.id)
          : undefined,
      };

      return JSON.parse(JSON.stringify(obj));
    },
    [filter]
  );

  const dispatchItems = () => {
    dispatch(getItems(convertFilterToQuery()))
      .unwrap()
      .then(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      })
      .catch((error: Error) => {
        console.error("rejected", error);
      });
  };

  useEffect(() => {
    if (items && itemsStatus !== "loading") {
      dispatchItems();
    }
  }, [debouncedValue]);

  useEffect(() => {
    dispatch(getBrands(undefined))
      .unwrap()
      .catch((error: Error) => {
        console.error("rejected", error);
      });
    dispatch(getStyles())
      .unwrap()
      .catch((error: Error) => {
        console.error("rejected", error);
      });
    dispatch(getColours())
      .unwrap()
      .catch((error: Error) => {
        console.error("rejected", error);
      });
  }, []);

  const priceValuesHandler = (values: number[]) => {
    setValues(values);
  };

  const priceHandler = () => {
    if (filter.price) {
      const isPreviousPrice =
        Math.round(values[0]) === filter.price[0] &&
        Math.round(values[1]) === filter.price[1];

      if (!isPreviousPrice) {
        const roundedPrice = [
          Math.round(values[0]),
          Math.round(values[1]),
        ] as const;

        dispatch(filterActions.setPrice([roundedPrice[0], roundedPrice[1]]));

        //Change page to first
        dispatch(filterActions.changePage(1));
      }
    }
  };

  const categoryHandler = (e: SingleValue<ItemEntity>) => {
    if (e) {
      // Fetch subcategories with this id
      if (typeof e.id === "number") {
        dispatch(getSubcategories(e.id))
          .unwrap()
          .catch((err) => console.log("rejected", err));
      }
    }

    dispatch(filterActions.setCategory(e));
    // Clear subcategory value
    dispatch(filterActions.setSubcategory([]));
  };

  const subcategoriesHandler = (e: MultiValue<ItemEntityWithId>) => {
    const mapped = e.map((subcategory) => {
      return subcategory.id;
    });

    dispatch(filterActions.setSubcategory(e));
  };

  const brandHandler = (e: MultiValue<ItemEntity>) => {
    if (e) {
      const mapped = e.map((item) => {
        return item.value;
      });

      dispatch(filterActions.setBrand(e));
    }
  };

  const filterHandler = (
    e: MultiValue<ItemEntity>,
    filterName: keyof IFilter
  ) => {
    if (e) {
      if (filterName === "condition") {
        dispatch(filterActions.setCondition(e));
      } else if (filterName === "style") {
        dispatch(filterActions.setStyle(e));
      } else if (filterName === "colour") {
        dispatch(filterActions.setColour(e));
      } else if (filterName === "size") {
        dispatch(filterActions.setSize(e));
      }
    }
  };

  const sortingHandler = (e: SingleValue<ItemEntity>) => {
    if (e) {
      dispatch(filterActions.setSortBy(e));
    }
  };

  const nextPage = (page: number) => {
    dispatch(filterActions.changePage(page));
  };

  const favoriteHandler = (id: number) => {
    if (favoriteToggleStatus !== "loading") {
      dispatch(toggleFavorite(id))
        .unwrap()
        .then((isFavorite) => {
          dispatch(setFavorite({ id, isFavorite }));
        })
        .catch((error: Error) => {
          console.error("rejected", error);
        });
    }
  };

  const onInputBrandChange = (e: string) => {
    dispatch(getBrands(e))
      .unwrap()
      .catch((error: Error) => {
        console.error("rejected", error);
      });
  };

  const genderHandler = (
    e: SingleValue<{
      value: string;
      label: string;
    }>
  ) => {
    if (e) {
      dispatch(filterActions.setGender(e));
      dispatch(filterActions.setCategory(null));
      dispatch(filterActions.setSubcategory([]));

      dispatch(getCategories(e.value as Gender))
        .unwrap()
        .catch((err) => console.log("rejected", err));
    }
  };

  return (
    <ShopStyling onClick={() => setIsPriceOpen(false)}>
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
                  disabled={itemsStatus === "loading"}
                  className="button price--buton"
                  onClick={priceHandler}
                >
                  Apply
                </button>
              </div>
            </div>
            <Select
              placeholder={"Gender"}
              styles={multiplefilterColourStyles}
              onChange={genderHandler}
              options={genders}
              className="select"
              required={true}
              isDisabled={false}
              isLoading={false}
              isSearchable={true}
              isClearable={false}
              name={"gender"}
              instanceId="gender-select"
              value={filter.gender}
            />
            <Select
              placeholder={"Categories"}
              styles={multiplefilterColourStyles}
              onChange={categoryHandler}
              options={categories}
              className="select"
              required={true}
              isDisabled={!filter.gender}
              isLoading={categoriesStatus === "loading"}
              isSearchable={true}
              name={"category"}
              instanceId="category-select"
              isClearable={true}
              value={filter.category}
            />
            <Select
              placeholder={"Subcategories"}
              styles={multiplefilterColourStyles}
              onChange={subcategoriesHandler}
              options={subcategories}
              isMulti
              className="select"
              required={true}
              isDisabled={!filter.category}
              isLoading={subcategoriesStatus === "loading"}
              isSearchable={true}
              name={"subcategory"}
              instanceId="category-select"
              isClearable={true}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              value={filter.subcategory}
              components={{
                ValueContainer,
              }}
            />
            <Select
              placeholder={"Size"}
              styles={multiplefilterColourStyles}
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
              value={filter.size}
              components={{
                ValueContainer,
              }}
            />
            <Select
              placeholder={"Condition"}
              styles={multiplefilterColourStyles}
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
              value={filter.condition}
              components={{
                ValueContainer,
              }}
            />
            <Select
              placeholder={"Brand"}
              styles={multiplefilterColourStyles}
              isMulti
              options={brands}
              className="select"
              onChange={brandHandler}
              required={true}
              isDisabled={false}
              isLoading={brandStatus === "loading"}
              isSearchable={true}
              name={"brand"}
              isClearable={true}
              instanceId="brand-select"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              onInputChange={onInputBrandChange}
              value={filter.brand}
              components={{
                ValueContainer,
              }}
            />
            <Select
              placeholder={"Style"}
              styles={multiplefilterColourStyles}
              isMulti
              options={styles}
              className="select"
              onChange={(e) => filterHandler(e, "style" as keyof IFilter)}
              required={true}
              isDisabled={false}
              isLoading={stylesStatus === "loading"}
              isSearchable={true}
              name={"style"}
              isClearable={true}
              instanceId="style-select"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              value={filter.style}
              components={{
                ValueContainer,
              }}
            />
            <Select
              placeholder={"Colour"}
              styles={multiplefilterColourStyles}
              isMulti
              options={colours}
              className="select"
              required={true}
              isDisabled={false}
              isLoading={coloursStatus === "loading"}
              isSearchable={true}
              name={"colour"}
              onChange={(e) => filterHandler(e, "colour" as keyof IFilter)}
              isClearable={true}
              instanceId="colour-select"
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              value={filter.colour}
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
          </div>
          <div className="sorting">
            <Select
              placeholder="Sorting"
              onChange={sortingHandler}
              options={sortingValues}
              styles={sortingColourStyles}
              instanceId="select"
              value={filter.sortBy}
            />
            <Image src={SortingIcon} alt="Sort by" />
          </div>
        </div>
        {itemsStatus === "loading" ? (
          <LoadindShopStyling>
            <div className="items-wrapper">
              <div className="item">
                <div className="item-image "></div>
                <h2 className="item-price "></h2>
                <p className="item-size "></p>
              </div>
              <div className="item">
                <div className="item-image "></div>
                <h2 className="item-price "></h2>
                <p className="item-size "></p>
              </div>
              <div className="item">
                <div className="item-image "></div>
                <h2 className="item-price "></h2>
                <p className="item-size "></p>
              </div>
              <div className="item">
                <div className="item-image "></div>
                <h2 className="item-price "></h2>
                <p className="item-size "></p>
              </div>
            </div>
          </LoadindShopStyling>
        ) : (
          <div className="items-wrapper">
            {items.map((item) => (
              <div className="item" key={item.id}>
                {item.isFavorite ? (
                  <Image
                    src={FilledHeart}
                    alt="Remove favorites"
                    className="unfilled-heart"
                    onClick={() => favoriteHandler(item.id)}
                  />
                ) : (
                  <Image
                    src={UnfilledWhiteHeart}
                    alt="Add to favorites"
                    className="unfilled-heart"
                    onClick={() => favoriteHandler(item.id)}
                  />
                )}
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
        )}
        <Pagination
          disabled={itemsStatus === "loading"}
          simple
          current={filter.page || 1}
          onChange={(page) => nextPage(page)}
          defaultCurrent={filter.page}
          total={items.length === 0 ? 1 : itemsTotal}
          pageSize={12}
        />
      </div>
    </ShopStyling>
  );
};

const ValueContainer = ({ children, ...props }: ValueContainerProps<any>) => {
  let [values, input] = children as ReactNode[];

  if (Array.isArray(values)) {
    values = `${values.length} selected`;
  }

  return (
    <components.ValueContainer {...props}>
      {values}
      {input}
    </components.ValueContainer>
  );
};

export default Shop;

const LoadindShopStyling = styled.div`
  .item {
    .item-image {
      background-color: var(--loading);
    }

    .item-price {
      height: 1.3rem;
      width: 8rem;
      background-color: var(--grey-10);
    }

    .item-size {
      height: 1.2rem;
      width: 2rem;
      background-color: var(--grey-10);
    }
  }
`;

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
  .sorting {
    display: flex;
    align-items: center;
  }

  .filter {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
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
      top: 3rem;
      z-index: 5;
      position: absolute;
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
    grid-column-gap: 1vw;
    grid-row-gap: 2vw;
    margin-top: 2rem;

    .item {
      position: relative;

      .unfilled-heart {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 1;
      }

      .item-image {
        aspect-ratio: 1 / 1.2;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            180deg,
            rgba(19, 19, 19, 0.5) 0%,
            rgba(19, 19, 19, 0.12) 18.75%,
            rgba(19, 19, 19, 0) 100%
          );
        }
      }

      .item-size {
        margin-top: 0.5rem;
        color: var(--grey-60);
      }

      .item-price {
        font-family: var(--font-medium);
        font-size: 1.1rem;
        margin-top: 1rem;
        font-weight: 600;
      }
    }
  }
`;
