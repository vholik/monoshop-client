import styled from 'styled-components'
import HeroBg from '@public/images/hero-bg.jpg'
import Link from 'next/link'
import { wrapper } from '@store/reducers/store'
import { getPopularBrands } from '@store/reducers/brand/GetPopularBrandsSlice'
import { ItemEntityWithImage } from '@store/types/item-entity'
import { getPopularStyles } from '@store/reducers/style/GetPopularStylesSlice'
import { getPopularItems } from '@store/reducers/item/GetPopularItemsSlice'
import { Item } from '@store/types/item'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import Router from 'next/router'
import { filterActions } from '@store/reducers/filter/FilterSlice'
import { useEffect } from 'react'
import { checkIsAuth } from '@store/reducers/auth/AuthSlice'
import { CustomHead } from '@utils/CustomHead'
import { IOption } from '@utils/CustomSelector.type'

export const getServerSideProps = wrapper.getStaticProps(
  (store) =>
    async ({}) => {
      const brands = (await store.dispatch(getPopularBrands())).payload
      const styles = (await store.dispatch(getPopularStyles())).payload
      const items = (await store.dispatch(getPopularItems())).payload

      if (!brands || !styles || !items) {
        return {
          props: {
            items: [],
            styles: [],
            brands: []
          }
        }
      }

      return {
        props: {
          brands,
          styles,
          items
        }
      }
    }
)

interface HomeProps {
  brands: ItemEntityWithImage[]
  styles: ItemEntityWithImage[]
  items: Item[]
}

export default function Home({ brands, items, styles }: HomeProps) {
  const dispatch = useAppDispatch()

  const brandRedirect = (brand: ItemEntityWithImage) => {
    dispatch(filterActions.resetFilter())
    dispatch(filterActions.setBrand([brand as IOption]))
    Router.push('/shop')
  }

  const styleRedirect = (style: ItemEntityWithImage) => {
    dispatch(filterActions.resetFilter())
    dispatch(filterActions.setStyle([style as IOption]))
    Router.push('/shop')
  }

  useEffect(() => {
    dispatch(checkIsAuth())
      .unwrap()
      .catch((err) => console.log(err))
  }, [])

  return (
    <HomeStyles>
      <CustomHead title="Home page" />
      <div className="container">
        <main className="hero">
          <h1 className="hero-title">Monoshop marketplace</h1>
          <Link href="/shop">
            <button className="hero-button button">Shop</button>
          </Link>
        </main>
      </div>
      {/* Popular categories */}
      {Array.isArray(styles) && (
        <div className="container">
          <div className="popular-categories">
            <h1 className="title-sm">Popular styles</h1>
            <div className="wrapper">
              {styles.map((style) => (
                <div className="popular-categories__item" key={style.value}>
                  <div
                    className="popular-categories__image"
                    style={{ backgroundImage: `url(${style.image})` }}
                    onClick={() => styleRedirect(style)}
                  ></div>
                  <h2
                    className="popular-categories__name-tag"
                    onClick={() => styleRedirect(style)}
                  >
                    {style.value}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Popular brands */}
      {Array.isArray(brands) && (
        <div className="container">
          <section className="popular-brands">
            <div className="top">
              <h2 className="title-sm">Popular brands</h2>
              <Link href="/brands">
                <p className="see-all-button">See all</p>
              </Link>
            </div>
            <div className="wrapper">
              {brands.map((brand) => (
                <div className="popular-categories__item" key={brand.value}>
                  <div
                    className="brand"
                    style={{ backgroundImage: `url(${brand.image})` }}
                    onClick={() => brandRedirect(brand)}
                  ></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
      {/* Hot on monoshop */}
      {Array.isArray(items) && (
        <div className="container">
          <section className="hot">
            <div className="top">
              <h2 className="title-sm">Hot on Monoshop</h2>
            </div>
            <div className="wrapper">
              {items.map((item) => (
                <div className="hot-item" key={item.id}>
                  <Link href={`/shop/${item.id}`}>
                    <div
                      className="hot-item__image"
                      style={{ backgroundImage: `url(${item.images[0]})` }}
                    ></div>
                  </Link>
                  <p className="hot-item__price">{item.price} PLN</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Ad section */}
      <div className="container">
        <div className="advertisement-section">
          <div className="side">
            <h2 className="title-sm">
              Have some clothing to sell? Post them to monoshop
            </h2>
            <button className="button">Start selling</button>
          </div>
          <div className="bg"></div>
        </div>
      </div>
      {/* Ad section */}
      <div className="container">
        <div className="advertisement-section">
          <div className="bg"></div>
          <div className="side">
            <h2 className="title-sm">
              Have some clothing to sell? Post them to monoshop
            </h2>
            <button className="button">Start selling</button>
          </div>
        </div>
      </div>
    </HomeStyles>
  )
}

const HomeStyles = styled.div`
  .hero {
    border-radius: 1.5em;
    margin-top: 1rem;
    padding: 6em 3em;
    font-family: var(--font-default);
    color: white;
    background-image: url(${HeroBg.src});
    right: -100%;
    left: -100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .hero-title {
    font-size: 2.5rem;
    font-weight: 600;
    font-family: var(--font-wide);
  }

  .hero-button {
    margin-top: 1rem;
  }

  /* Popular categories */
  .popular-categories {
    margin-top: var(--component-margin);

    .wrapper {
      display: grid;
      align-items: center;
      grid-template-columns: repeat(5, 1fr);
      grid-column-gap: var(--gap);
      margin-top: 2rem;
    }

    &__item {
      font-family: var(--font-default);
      aspect-ratio: 1 / 1;
      width: 100%;
    }

    &__name-tag {
      margin-top: 1rem;
      font-size: var(--font-md);
      text-align: center;
      cursor: pointer;
    }

    &__image {
      height: 100%;
      border-radius: 50%;
      background-size: cover;
      background-color: var(--loading);
      cursor: pointer;
    }
  }

  /* Popular brands */
  .popular-brands {
    margin-top: var(--component-margin);
    .top {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    .wrapper {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-column-gap: var(--gap);
      margin-top: 2rem;
    }

    .brand {
      background-color: var(--white);
      aspect-ratio: 1 / 1;
      width: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      border-radius: 50%;
      cursor: pointer;
    }
  }

  // Hot items
  .hot {
    margin-top: var(--component-margin);

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .wrapper {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-row-gap: var(--gap);
      grid-column-gap: var(--gap);
      margin-top: 2rem;
    }

    .hot-item {
      &__image {
        background-size: cover;
        width: 100%;
        aspect-ratio: 1 / 1;
        background-color: var(--loading);
      }

      &__price {
        font-family: var(--font-default);
        font-weight: 700;
        margin-top: 1rem;
      }
    }
  }

  .advertisement-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 4rem;
    margin-top: var(--component-margin);
    align-items: center;

    .button {
      margin-top: 2rem;
    }

    .bg {
      background-color: var(--grey-30);
      aspect-ratio: 1 / 1;
    }
  }

  @media screen and (max-width: 768px) {
    .hero {
      padding: 3rem 1.5rem;

      .hero-title {
        font-size: 2rem;
      }
    }

    .advertisement-section {
      row-gap: 4rem;
      grid-template-columns: 1fr;
    }

    .popular-categories .wrapper {
      grid-template-columns: repeat(3, 1fr);
      row-gap: 1rem;
      column-gap: 1rem;
    }

    .popular-brands .wrapper {
      grid-template-columns: repeat(3, 1fr);
      row-gap: 1rem;
      column-gap: 1rem;
    }

    .hot .wrapper {
      grid-template-columns: repeat(2, 1fr);
      row-gap: 1rem;
      column-gap: 1rem;
    }

    .advertisement-section {
      row-gap: 2rem;
      .bg {
        &:nth-child(2) {
          display: none;
        }
      }
    }
  }
`
