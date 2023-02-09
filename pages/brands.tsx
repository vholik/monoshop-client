import Categories from '@components/Categories/Categories'
import Header from '@components/Header/Header'
import styled from 'styled-components'
import Image from 'next/image'
import SearchIcon from '@public/images/search.svg'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { ChangeEvent, useEffect, useState } from 'react'
import { getBrands } from '@store/reducers/brand/GetBrandsSlice'
import Loading from '@components/Loading/Loading'
import Router from 'next/router'
import Footer from '@components/Footer/Footer'
import { filterActions } from '@store/reducers/filter/FilterSlice'
import Layout from '@components/Layout/Layout'
import { CustomHead } from '@utils/CustomHead'
import useDebounce from '@utils/useDebounce'

const Brands = () => {
  const dispatch = useAppDispatch()

  const [value, setValue] = useState('')

  const debounce = useDebounce<string>(value, 1000)

  const brands = useAppSelector((state) => state.getBrandsReducer.brands)
  const status = useAppSelector((state) => state.getBrandsReducer.status)

  useEffect(() => {
    dispatch(getBrands(value))
      .unwrap()
      .catch((err) => console.log(err))
  }, [debounce])

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const filterBrand = (value: string) => {
    dispatch(filterActions.resetFilter())
    dispatch(filterActions.setBrand([{ value: value, label: value }]))
    Router.push('/shop')
  }

  return (
    <BrandsStyles>
      <CustomHead title="Brands" />
      <div className="container">
        <h1 className="title-md">Search for brands</h1>
        <div className="search-wrapper">
          <Image src={SearchIcon} alt="Search" />
          <input
            type="text"
            className="input"
            placeholder="Search for brands"
            onChange={inputChange}
          />
        </div>
        {status === 'loading' ? (
          <Loading />
        ) : (
          <div className="brands">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="brand"
                onClick={() => filterBrand(brand.value)}
              >
                <Image
                  src={brand.image}
                  className="brand-logo"
                  alt="Brand logo"
                  width={100}
                  height={100}
                />
                {brand.value}
              </div>
            ))}
          </div>
        )}
      </div>
    </BrandsStyles>
  )
}

const BrandsStyles = styled.div`
  margin-top: 2rem;

  .search-wrapper {
    width: fit-content;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    border: none;
    border-bottom: 1px solid var(--grey-10);
    padding: 0 1rem;

    .input {
      border: none;

      margin-left: 0.5rem;
      font-size: 1.1rem;
    }
  }

  .brands {
    margin-top: 2rem;
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    font-size: 1.2rem;
  }

  .brand {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .brand-logo {
      object-fit: contain;
      border-radius: 50%;
    }
  }
`

export default Brands
