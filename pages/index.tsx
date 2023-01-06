import Header from "@components/Header";
import Head from "next/head";
import styled from "styled-components";
import HeroBg from "@public/images/hero-bg.jpg";
import Categories from "@components/Categories/Categories";
import Footer from "@components/Footer/Footer";
import Link from "next/link";
import { wrapper } from "@store/reducers/store";
import { getPopularBrands } from "@store/reducers/brand/GetPopularBrandsSlice";
import { ItemEntityWithImage } from "@store/types/item-entity";
import { getPopularStyles } from "@store/reducers/style/GetPopularStylesSlice";
import { getPopularItems } from "@store/reducers/item/GetPopularItemsSlice";
import { Item } from "@store/types/item";
import { useAppDispatch } from "@store/hooks/redux";
import {
  resetFilter,
  setBrand,
  setSortBy,
  setStyle,
} from "@store/reducers/filter/FilterSlice";
import Router from "next/router";
import { SortBy } from "@store/types/filter-by.enum";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const brands = (await store.dispatch(getPopularBrands())).payload;
    const styles = (await store.dispatch(getPopularStyles())).payload;
    const items = (await store.dispatch(getPopularItems())).payload;

    if (!brands || !styles || !items) {
      return {
        props: {
          items: [],
          styles: [],
          brands: [],
        },
      };
    }

    return {
      props: {
        brands,
        styles,
        items,
      },
    };
  }
);

interface HomeProps {
  brands: ItemEntityWithImage[];
  styles: ItemEntityWithImage[];
  items: Item[];
}

export default function Home({ brands, items, styles }: HomeProps) {
  const dispatch = useAppDispatch();

  const brandRedirect = (brand: ItemEntityWithImage) => {
    dispatch(resetFilter());
    dispatch(setBrand([brand.value]));
    Router.push("/shop");
  };

  const styleRedirect = (style: ItemEntityWithImage) => {
    dispatch(resetFilter());
    dispatch(setStyle([style.value]));
    Router.push("/shop");
  };

  const popularItemsRedirect = () => {
    dispatch(setSortBy(SortBy.Recent));
    Router.push("/shop");
  };

  return (
    <HomeStyles>
      <Head>
        <title>Monoshop - create your style</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <Categories />
      <main className="hero">
        <div className="container">
          <h1 className="hero-title">Create your style with monoshop</h1>
          <Link href="/shop">
            <button className="hero-button button">Shop</button>
          </Link>
        </div>
      </main>
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
              <p className="see-all-button" onClick={popularItemsRedirect}>
                See all
              </p>
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
      <Footer />
    </HomeStyles>
  );
}

const HomeStyles = styled.div`
  .hero {
    padding: 10rem 0;
    font-family: var(--font-default);
    color: white;
    background-image: url(${HeroBg.src});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .hero-title {
    text-transform: uppercase;
    font-size: 2.5rem;
    font-family: var(--font-medium);
  }

  .hero-button {
    background-color: transparent;
    border: 1px solid var(--white);
    margin-top: 2rem;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  /* Popular categories */
  .popular-categories {
    margin-top: var(--component-margin);

    .wrapper {
      display: flex;
      align-items: center;
      gap: var(--gap);
      justify-content: space-between;
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
`;
