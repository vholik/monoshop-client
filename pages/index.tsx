import Header from "@components/Header";
import Head from "next/head";
import styled from "styled-components";
import HeroBg from "@public/images/hero-bg.png";
import Categories from "@components/Categories/Categories";
import Footer from "@components/Footer/Footer";
import Link from "next/link";

export default function Home() {
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
      <div className="container">
        <div className="popular-categories">
          <h1 className="title-sm">Popular categories</h1>
          <div className="wrapper">
            <div className="popular-categories__item">
              <div className="popular-categories__image"></div>
              <h2 className="popular-categories__name-tag">Name tag</h2>
            </div>
            <div className="popular-categories__item">
              <div className="popular-categories__image"></div>
              <h2 className="popular-categories__name-tag">Name tag</h2>
            </div>
            <div className="popular-categories__item">
              <div className="popular-categories__image"></div>
              <h2 className="popular-categories__name-tag">Name tag</h2>
            </div>
            <div className="popular-categories__item">
              <div className="popular-categories__image"></div>
              <h2 className="popular-categories__name-tag">Name tag</h2>
            </div>
            <div className="popular-categories__item">
              <div className="popular-categories__image"></div>
              <h2 className="popular-categories__name-tag">Name tag</h2>
            </div>
          </div>
        </div>
      </div>
      {/* Popular brands */}
      <div className="container">
        <section className="popular-brands">
          <div className="top">
            <h2 className="title-sm">Popular brands</h2>
            <p className="see-all-button">See all</p>
          </div>
          <div className="wrapper">
            <div className="brand"></div>
            <div className="brand"></div>
            <div className="brand"></div>
            <div className="brand"></div>
            <div className="brand"></div>
          </div>
        </section>
      </div>
      {/* Hot on monoshop */}
      <div className="container">
        <section className="hot">
          <div className="top">
            <h2 className="title-sm">Hot on Monoshop</h2>
            <p className="see-all-button">See all</p>
          </div>
          <div className="wrapper">
            <div className="hot-item">
              <div className="hot-item__image"></div>
              <p className="hot-item__price">99 PLN</p>
            </div>
            <div className="hot-item">
              <div className="hot-item__image"></div>
              <p className="hot-item__price">99 PLN</p>
            </div>
            <div className="hot-item">
              <div className="hot-item__image"></div>
              <p className="hot-item__price">99 PLN</p>
            </div>
            <div className="hot-item">
              <div className="hot-item__image"></div>
              <p className="hot-item__price">99 PLN</p>
            </div>
            <div className="hot-item">
              <div className="hot-item__image"></div>
              <p className="hot-item__price">99 PLN</p>
            </div>
            <div className="hot-item">
              <div className="hot-item__image"></div>
              <p className="hot-item__price">99 PLN</p>
            </div>
            <div className="hot-item">
              <div className="hot-item__image"></div>
              <p className="hot-item__price">99 PLN</p>
            </div>
            <div className="hot-item">
              <div className="hot-item__image"></div>
              <p className="hot-item__price">99 PLN</p>
            </div>
            <div className="hot-item">
              <div className="hot-item__image"></div>
              <p className="hot-item__price">99 PLN</p>
            </div>
            <div className="hot-item">
              <div className="hot-item__image"></div>
              <p className="hot-item__price">99 PLN</p>
            </div>
          </div>
        </section>
      </div>
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
    padding: 7rem 0;
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
    font-weight: 500;
    font-family: "GT America";
    font-style: italic;
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
    }

    &__image {
      height: 100%;
      border-radius: 50%;
      background-color: var(--grey-30);
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
      border-radius: 50%;
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
        width: 100%;
        aspect-ratio: 1 / 1;
        background-color: var(--white);
      }

      &__price {
        font-family: var(--font-default);
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
