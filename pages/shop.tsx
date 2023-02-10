import styled from 'styled-components'
import Select, {
  components,
  SingleValue,
  ValueContainerProps
} from 'react-select'
import {
  conditions,
  sizes,
  sortingColourStyles,
  sortingValues
} from '@utils/ReactSelect/reactSelectUtils'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { getItems, setFavorite } from '@store/reducers/item/GetItemsSlice'
import Image from 'next/image'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { getBrands } from '@store/reducers/brand/GetBrandsSlice'
import { ItemEntity } from '@store/types/item-entity'
import { IFilter } from '@store/types/filter'
import Link from 'next/link'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import UnfilledWhiteHeart from '@public/images/unfilled-white-heart.svg'
import FilledHeart from '@public/images/filled-heart.svg'
import SortingIcon from '@public/images/sort.svg'
import FilterIcon from '@public/images/filter.svg'
import { toggleFavorite } from '@store/reducers/favorite/ToggleFavoriteSlice'
import useDebounce from '@utils/useDebounce'
import { filterActions } from '@store/reducers/filter/FilterSlice'
import { CustomHead } from '@utils/CustomHead'
import { BrandSelector } from '@utils/BrandSelector/BrandSelector'
import { IOption } from '@utils/CustomSelector.type'
import { CustomSelector } from '@utils/CustomSelector/CustomSelector'
import { CategorySelector } from '@utils/CategorySelector/CategorySelector'
import { PriceSelector } from '@utils/PriceSelector/PriceSelector'
import { getColours } from '@store/reducers/colour/GetColoursSlice'
import { getStyles } from '@store/reducers/style/GetStylesSlice'

const Shop = () => {
  const dispatch = useAppDispatch()

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const filter = useAppSelector((state) => state.filterReducer)

  const items = useAppSelector((state) => state.getItemsReducer.items)
  const itemsStatus = useAppSelector((state) => state.getItemsReducer.status)
  const itemsTotal = useAppSelector((state) => state.getItemsReducer.total)

  const favoriteToggleStatus = useAppSelector(
    (state) => state.toggleFavoriteReducer.status
  )

  const brandStatus = useAppSelector((state) => state.getBrandsReducer.status)
  const brands = useAppSelector((state) => state.getBrandsReducer.brands)

  const colours = useAppSelector((state) => state.getColoursReducer.colours)
  const coloursStatus = useAppSelector(
    (state) => state.getColoursReducer.status
  )

  const stylesStatus = useAppSelector((state) => state.getStylesReducer.status)
  const styles = useAppSelector((state) => state.getStylesReducer.styles)

  const subcategories = useAppSelector(
    (state) => state.getSubcategoriesReducer.subcategories
  )
  const subcategoriesStatus = useAppSelector(
    (state) => state.getSubcategoriesReducer.status
  )

  const debouncedValue = useDebounce<IFilter>(filter, 1000)

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
        gender: filter.gender ? filter.gender : undefined,
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
          : undefined
      }

      return JSON.parse(JSON.stringify(obj))
    },
    [filter]
  )

  const dispatchItems = () => {
    dispatch(getItems(convertFilterToQuery()))
      .unwrap()
      .then(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      })
      .catch((error: Error) => {
        console.error('rejected', error)
      })
  }

  useEffect(() => {
    dispatchItems()
  }, [debouncedValue])

  useEffect(() => {
    dispatch(getBrands(undefined))
      .unwrap()
      .catch((error: Error) => {
        console.error('rejected', error)
      })
    dispatch(getStyles())
      .unwrap()
      .catch((error: Error) => {
        console.error('rejected', error)
      })
    dispatch(getColours())
      .unwrap()
      .catch((error: Error) => {
        console.error('rejected', error)
      })
  }, [])

  const subcategoriesHandler = (e: IOption[]) => {
    dispatch(filterActions.setSubcategory(e))
  }

  const brandHandler = (e: IOption[]) => {
    if (e.length === filter.brand?.length) return

    dispatch(filterActions.setBrand(e))
  }

  const conditionHandler = (e: IOption[]) => {
    dispatch(filterActions.setCondition(e))
  }

  const sizeHandler = (e: IOption[]) => {
    dispatch(filterActions.setSize(e))
  }

  const styleHandler = (e: IOption[]) => {
    dispatch(filterActions.setStyle(e))
  }

  const colorHandler = (e: IOption[]) => {
    dispatch(filterActions.setColour(e))
  }

  const sortingHandler = (e: SingleValue<ItemEntity>) => {
    if (e) {
      dispatch(filterActions.setSortBy(e))
    }
  }

  const nextPage = (page: number) => {
    dispatch(filterActions.changePage(page))
  }

  const favoriteHandler = (id: number) => {
    if (favoriteToggleStatus !== 'loading') {
      dispatch(toggleFavorite(id))
        .unwrap()
        .then((isFavorite) => {
          dispatch(setFavorite({ id, isFavorite }))
        })
        .catch((error: Error) => {
          console.error('rejected', error)
        })
    }
  }

  const onInputBrandChange = (e: string) => {
    dispatch(getBrands(e))
      .unwrap()
      .catch((error: Error) => {
        console.error('rejected', error)
      })
  }

  return (
    <ShopStyling>
      <div
        className="mobile-filter"
        style={isMobileFilterOpen ? { display: 'flex' } : { display: 'none' }}
      >
        <h1 className="title-md">Filter</h1>
        <div className="mobile-filter__inner">
          <CategorySelector />
          {filter.category && (
            <CustomSelector
              onChange={subcategoriesHandler}
              options={subcategories as IOption[]}
              value={filter.subcategory as IOption[]}
              label="Subcategory"
            />
          )}
          <PriceSelector />
          <CustomSelector
            onChange={sizeHandler}
            options={sizes}
            value={filter.size as IOption[]}
            label="Size"
          />
          <CustomSelector
            onChange={conditionHandler}
            options={conditions}
            value={filter.condition as IOption[]}
            label="Condition"
          />
          <BrandSelector
            onChange={brandHandler}
            options={brands as IOption[]}
            inputValue={onInputBrandChange}
            value={filter.brand as IOption[]}
          />
          <CustomSelector
            onChange={styleHandler}
            options={styles as IOption[]}
            value={filter.style as IOption[]}
            label="Style"
          />
          <CustomSelector
            onChange={colorHandler}
            options={colours as IOption[]}
            value={filter.colour as IOption[]}
            label="Color"
          />
        </div>
        <button
          className="close-btn button-xl"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          Close
        </button>
      </div>
      <CustomHead title="Shop page" />
      <div className="wrapper">
        <div className="filter">
          <button
            className="filter-modal-btn"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            Filter <Image src={FilterIcon} alt="Filter" />
          </button>
          <div className="filter-inner">
            <CategorySelector />
            {filter.category && (
              <CustomSelector
                onChange={subcategoriesHandler}
                options={subcategories as IOption[]}
                value={filter.subcategory as IOption[]}
                label="Subcategory"
              />
            )}
            <PriceSelector />
            <CustomSelector
              onChange={sizeHandler}
              options={sizes}
              value={filter.size as IOption[]}
              label="Size"
            />
            <CustomSelector
              onChange={conditionHandler}
              options={conditions}
              value={filter.condition as IOption[]}
              label="Condition"
            />
            <BrandSelector
              onChange={brandHandler}
              options={brands as IOption[]}
              inputValue={onInputBrandChange}
              value={filter.brand as IOption[]}
            />
            <CustomSelector
              onChange={styleHandler}
              options={styles as IOption[]}
              value={filter.style as IOption[]}
              label="Style"
            />
            <CustomSelector
              onChange={colorHandler}
              options={colours as IOption[]}
              value={filter.colour as IOption[]}
              label="Color"
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
        {itemsStatus === 'loading' ? (
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
                      style={{ objectFit: 'cover' }}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
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
          disabled={itemsStatus === 'loading'}
          current={filter.page || 1}
          onChange={(page) => nextPage(page)}
          defaultCurrent={filter.page}
          total={items.length === 0 ? 1 : itemsTotal}
          pageSize={12}
        />
      </div>
    </ShopStyling>
  )
}

const ValueContainer = ({ children, ...props }: ValueContainerProps<any>) => {
  let [values, input] = children as ReactNode[]

  if (Array.isArray(values)) {
    values = `${values.length} selected`
  }

  return (
    <components.ValueContainer {...props}>
      {values}
      {input}
    </components.ValueContainer>
  )
}

export default Shop

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
`

const ShopStyling = styled.div`
  //Pagination styling
  .rc-pagination-next button,
  .rc-pagination-prev button {
    &:hover {
      color: var(--primary) !important;
    }
  }

  .rc-pagination-item {
    &:hover {
      border-color: var(--primary-hover);
      a {
        color: var(--primary-hover);
      }
    }
  }

  .rc-pagination-item-active {
    border-color: var(--primary);
    a {
      color: var(--primary);
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

    .filter-modal-btn {
      border: none;
      outline: none;
      display: flex;
      background-color: transparent;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      display: none;
    }
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
          content: '';
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

  .mobile-filter {
    z-index: 10;
    position: fixed;
    padding: 5%;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    flex-direction: column;
    background-color: var(--white);

    .close-btn {
      margin-top: auto;
    }

    div {
      width: 100% !important;
    }

    .label-btn {
      min-width: 100% !important;
      justify-content: space-between;
    }

    &__inner {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      flex-direction: column;
    }
  }

  @media screen and (max-width: 1200px) {
    .filter {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-top: 1px solid var(--stroke);
      border-bottom: 1px solid var(--stroke);
      margin-top: 0;

      .filter-inner {
        display: none;
      }

      .sorting {
        padding-left: 1rem;
        border-left: 1px solid var(--stroke);
      }

      .filter-modal-btn {
        display: flex;
      }
    }
  }

  @media screen and (max-width: 1024px) {
    .items-wrapper {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media screen and (max-width: 768px) {
    .items-wrapper {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
    }
  }
`
