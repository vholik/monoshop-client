import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import styled from "styled-components";
import Select, {
  components,
  GroupBase,
  MultiValue,
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
} from "@utils/react-select-utils";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { getItems, setFavorite } from "@store/reducers/item/GetItemsSlice";
import Image from "next/image";
import { getTrackBackground, Range } from "react-range";
import { ReactNode, useEffect, useRef, useState } from "react";
import { getBrands } from "@store/reducers/brand/GetBrandsSlice";
import { getStyles } from "@store/reducers/item/GetStylesSlice";
import { getColours } from "@store/reducers/item/GetColoursSlice";
import { ItemEntity, ItemEntityWithId } from "@store/types/item-entity";
import { getCategories } from "@store/reducers/item/GetCategoriesSlice";
import { Gender } from "@store/types/gender.enum";
import { IFilter } from "@store/types/filter";
import { SortBy } from "@store/types/filter-by.enum";
import Link from "next/link";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import {
  changePage,
  setBrand,
  setCategory,
  setColour,
  setCondition,
  setGender,
  setPrice,
  setSize,
  setSortBy,
  setStyle,
  setSubcategory,
} from "@store/reducers/filter/FilterSlice";
import UnfilledWhiteHeart from "@public/images/unfilled-white-heart.svg";
import FilledHeart from "@public/images/filled-heart.svg";
import { getSubcategories } from "@store/reducers/item/GetSubcategoriesSlice";
import SortingIcon from "@public/images/filter.svg";
import { toggleFavorite } from "@store/reducers/favorite/ToggleFavoriteSlice";
import { FlexPage } from "@utils/FlexStyle";
import Footer from "@components/Footer/Footer";

const STEP = 1;
const MIN = 0;
const MAX = 10000;

const Shop = () => {
  const dispatch = useAppDispatch();

  const filter = useAppSelector((state) => state.filterReducer);

  const { items, isItemsLoading, itemsError, total } = useAppSelector(
    (state) => state.getItemsReducer
  );
  const { isFavoriteToggleLoading } = useAppSelector(
    (state) => state.toggleFavoriteReducer
  );
  const { brands, isBrandsLoading } = useAppSelector(
    (state) => state.getBrandsReducer
  );
  const { colours, isColoursLoading } = useAppSelector(
    (state) => state.getColoursReducer
  );
  const { styles, isStylesLoading } = useAppSelector(
    (state) => state.getStylesReducer
  );
  const { isSubcategoriesLoading, subcategories, subcategoriesError } =
    useAppSelector((state) => state.getSubcategoriesReducer);
  const { categories, categoriesError, isCategoriesLoading } = useAppSelector(
    (state) => state.getCategoriesReducer
  );

  const categorieRef = useRef<any>(null);
  const subcategorieRef = useRef<any>(null);

  const [values, setValues] = useState([0, 10000]);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  useEffect(() => {
    if (filter && items && !isItemsLoading) {
      dispatch(getItems(filter))
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
    }
  }, [filter]);

  useEffect(() => {
    dispatch(getBrands(""))
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

    setValues(filter.price);
  }, []);

  const genderHandler = (
    e: SingleValue<{
      value: string;
      label: string;
    }>
  ) => {
    dispatch(changePage(1));

    if (e && e.value !== filter.gender) {
      dispatch(setGender(e?.value as Gender));
      dispatch(setCategory(0));
      dispatch(setSubcategory([]));
    }

    if (e?.value && e.value !== filter.gender) {
      dispatch(getCategories(e.value as Gender))
        .unwrap()
        .catch((err) => console.log("rejected", err));

      if (categorieRef.current) {
        categorieRef.current.clearValue();
      }
      if (subcategorieRef.current) {
        subcategorieRef.current.clearValue();
      }
    }
  };

  const priceValuesHandler = (values: number[]) => {
    setValues(values);
  };

  const priceHandler = () => {
    if (isItemsLoading) return;

    dispatch(changePage(1));

    const isPreviousPrice =
      Math.round(values[0]) === filter.price[0] &&
      Math.round(values[1]) === filter.price[1];

    if (!isPreviousPrice) {
      dispatch(setPrice([Math.round(values[0]), Math.round(values[1])]));
    }
  };

  const categoryHandler = (e: SingleValue<ItemEntity>) => {
    if (e?.id === filter.category) return;

    if (!e) {
      dispatch(setCategory(0));
    }

    if (e?.id) {
      dispatch(setCategory(e.id));

      dispatch(getSubcategories(e?.id))
        .unwrap()
        .catch((err) => console.log("rejected", err));
    }

    if (subcategorieRef.current) {
      subcategorieRef.current.clearValue();
    }

    dispatch(changePage(1));
  };

  const subcategoriesHandler = (e: MultiValue<ItemEntityWithId>) => {
    const mapped = e.map((subcategory) => {
      return subcategory.id;
    });

    if (mapped === filter.subcategory) return; // Dont re-render

    dispatch(setSubcategory(mapped));

    dispatch(changePage(1));
  };

  const brandHandler = (e: MultiValue<ItemEntity>) => {
    if (e) {
      const mapped = e.map((item) => {
        return item.value;
      });

      dispatch(setBrand(mapped));
    }
  };

  const filterHandler = (
    e: MultiValue<ItemEntity>,
    filterName: keyof IFilter
  ) => {
    if (e) {
      console.log(e);

      const mapped = e.map((item) => {
        return item.value;
      });

      if (filterName === "condition") {
        dispatch(setCondition(mapped.map((it) => Number(it))));
        return;
      }

      if (filterName === "style") {
        dispatch(setStyle(mapped));
        return;
      }

      if (filterName === "colour") {
        dispatch(setColour(mapped));
        return;
      }

      if (filterName === "size") {
        dispatch(setSize(mapped));
        return;
      }

      dispatch(changePage(1));
    }
  };

  const sortingHandler = (
    e: SingleValue<{
      value: SortBy;
      label: string;
    }>
  ) => {
    if (e?.value) {
      dispatch(setSortBy(e.value));
    }
  };

  const nextPage = (page: number) => {
    dispatch(changePage(page));
  };

  const setDefaultSizeValue = (): ItemEntity[] => {
    return filter.size.map((size) => {
      return {
        value: size,
        label: size,
      };
    });
  };
  const setDefaultBrandValue = (): ItemEntity[] => {
    return filter.brand.map((brand) => {
      return {
        value: brand,
        label: brand,
      };
    });
  };
  const setDefaultColourValue = (): ItemEntity[] => {
    return filter.colour.map((colour) => {
      return {
        value: colour,
        label: colour,
      };
    });
  };
  const setDefaultStyleValue = (): ItemEntity[] => {
    return filter.style.map((style) => {
      return {
        value: style,
        label: style,
      };
    });
  };
  const setDefaultConditionValue = (): ItemEntity[] => {
    return filter.condition.map((condition) => {
      return {
        value: String(condition),
        label: String(condition),
      };
    });
  };
  const setDefaultCategoryValue = (): ItemEntityWithId | undefined => {
    const find = categories.find((category) => category.id === filter.category);

    if (find) {
      return find;
    }
  };
  const setDefaultSubcategoryValue = (): ItemEntityWithId[] => {
    const mapped = subcategories.filter((subcategory) => {
      if (subcategory.id) {
        return filter.subcategory.indexOf(subcategory.id) > -1;
      }
    });

    if (mapped.length) {
      return mapped;
    }

    return [];
  };
  const setDefaultGenderValue = ():
    | SingleValue<{
        value: string;
        label: string;
      }>
    | undefined => {
    if (filter.gender) {
      return {
        value: filter.gender,
        label: filter.gender === Gender.MEN ? "Menswear" : "Womenswear",
      };
    }
  };
  const setDefaultSortingValue = () => {
    const find = sortingValues.find((obj) => obj.value === filter.sortBy);
    if (find) {
      return find;
    }

    return sortingValues[3];
  };
  const favoriteHandler = (id: number) => {
    if (!isFavoriteToggleLoading) {
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

  return (
    <FlexPage>
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
                value={setDefaultGenderValue()}
              />
              <Select
                ref={categorieRef}
                placeholder={"Categories"}
                styles={multiplefilterColourStyles}
                onChange={categoryHandler}
                options={categories}
                className="select"
                required={true}
                isDisabled={!filter.gender || Boolean(categoriesError)}
                isLoading={isCategoriesLoading}
                isSearchable={true}
                name={"category"}
                instanceId="category-select"
                isClearable={true}
                value={setDefaultCategoryValue()}
              />
              <Select
                ref={subcategorieRef}
                placeholder={"Subcategories"}
                styles={multiplefilterColourStyles}
                onChange={subcategoriesHandler}
                options={subcategories}
                isMulti
                className="select"
                required={true}
                isDisabled={!filter.category || Boolean(subcategoriesError)}
                isLoading={isSubcategoriesLoading}
                isSearchable={true}
                name={"subcategory"}
                instanceId="category-select"
                isClearable={true}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                value={setDefaultSubcategoryValue()}
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
                value={setDefaultSizeValue()}
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
                value={setDefaultConditionValue()}
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
                isLoading={isBrandsLoading}
                isSearchable={true}
                name={"brand"}
                isClearable={true}
                instanceId="brand-select"
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                value={setDefaultBrandValue()}
                onInputChange={onInputBrandChange}
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
                isLoading={isStylesLoading}
                isSearchable={true}
                name={"style"}
                isClearable={true}
                instanceId="style-select"
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                value={setDefaultStyleValue()}
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
                isLoading={isColoursLoading}
                isSearchable={true}
                name={"colour"}
                onChange={(e) => filterHandler(e, "colour" as keyof IFilter)}
                isClearable={true}
                instanceId="colour-select"
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                value={setDefaultColourValue()}
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
                value={setDefaultSortingValue()}
                instanceId="select"
              />
              <Image src={SortingIcon} alt="Sort by" />
            </div>
          </div>
          <div className="item-container">
            {isItemsLoading ? (
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
              disabled={isItemsLoading}
              simple
              current={filter.page}
              onChange={(page) => nextPage(page)}
              defaultCurrent={filter.page}
              total={items.length === 0 ? 1 : total}
              pageSize={12}
            />
          </div>
        </div>
      </ShopStyling>
      <Footer />
    </FlexPage>
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
    margin-left: 50px;
    margin-right: 50px;
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

  .item-container {
    margin: 0 50px;
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
