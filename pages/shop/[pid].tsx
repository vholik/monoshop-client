import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import { getItemById } from "@store/reducers/item/GetItemByIdSlice";
import { wrapper } from "@store/reducers/store";
import { Item } from "@store/types/item";
import styled from "styled-components";
import Image from "next/image";
import unfilledHeart from "@public/images/unfilled-heart.svg";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef } from "react";
import Footer from "@components/Footer/Footer";
import Link from "next/link";
gsap.registerPlugin(ScrollTrigger);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const pid = query.pid as string;
      const item = await (await store.dispatch(getItemById(pid))).payload;

      if (!item) {
        return {
          props: {
            item: {},
          },
        };
      }

      return {
        props: {
          item,
        },
      };
    }
);

interface IShopItem {
  item: Item;
}

const ShopItem = ({ item }: IShopItem) => {
  const {
    images,
    user,
    brand,
    gender,
    size,
    style,
    condition,
    colour,
    category,
    price,
    description,
    hashtags,
    name,
  } = item;

  const heroRef = useRef(null);
  const photosRef = useRef(null);

  // useLayoutEffect(() => {
  //   let ctx = gsap.context(() => {
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: ".item-hero",
  //         start: "+=200px",
  //         end: "bottom",
  //         pin: heroRef.current,
  //         pinSpacing: false,
  //         toggleActions: "play none none reverse",
  //         markers: false,
  //       },
  //     });

  //     return () => ctx.revert();
  //   }, photosRef);
  // }, []);

  return (
    <ShopItemStyles>
      <Header />
      <Categories />
      <div className="container">
        <div className="wrapper">
          <div className="left" ref={photosRef}>
            {images?.map((url, key) => (
              <div className="photo" key={key}>
                <Image
                  src={url}
                  fill
                  alt="Product photo"
                  style={{ position: "absolute", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
          <div className="right">
            <div className="user">
              <Link href={`/user/${user.id}`}>
                <Image
                  src={user.image}
                  alt="User photo"
                  className="user-photo"
                  width={50}
                  height={50}
                />
              </Link>
              <Link href={`/user/${user.id}`}>
                <div className="user-info">
                  <h3 className="user-name">{user.fullName}</h3>
                  <p className="user-mail">{user.email}</p>
                </div>
              </Link>
            </div>
            <div className="hero-wrapper" ref={heroRef}>
              <div className="item-hero">
                <h2 className="item-name">{name}</h2>
                <Image src={unfilledHeart} alt="Add to favorite" />
              </div>
              <h2 className="item-price">{price} PLN</h2>
              <button className="button item--button">Message</button>
            </div>
            {item.description && (
              <div className="item-description">
                <p
                  className="item-description__text"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                ></p>
              </div>
            )}
            {hashtags.length !== 0 && (
              <div className="hashtags-wrapper">
                {hashtags.map((hashtag, key) => (
                  <div className="hashtag" key={key}>
                    #{hashtag}
                  </div>
                ))}
              </div>
            )}
            <div className="item-info">
              <div className="item-info__item">
                <h2 className="item-info__tag">Category</h2>
                <h2 className="item-info__value gender--value">
                  {category.value}
                </h2>
              </div>
              <div className="item-info__item">
                <h2 className="item-info__tag">Gender</h2>
                <h2 className="item-info__value gender--value">{gender}</h2>
              </div>
              <div className="item-info__item">
                <h2 className="item-info__tag">Brand</h2>
                <h2 className="item-info__value">{brand.value}</h2>
              </div>
              <div className="item-info__item">
                <h2 className="item-info__tag">Size</h2>
                <h2 className="item-info__value">{size}</h2>
              </div>
              <div className="item-info__item">
                <h2 className="item-info__tag">Style</h2>
                <h2 className="item-info__value">{style.value}</h2>
              </div>
              <div className="item-info__item">
                <h2 className="item-info__tag">Condition</h2>
                <h2 className="item-info__value">{condition}/10</h2>
              </div>
              <div className="item-info__item">
                <h2 className="item-info__tag">Colour</h2>
                <h2 className="item-info__value colour--value">
                  <div
                    className="colour-circle"
                    style={{ backgroundColor: `#${colour.hexCode}` }}
                  ></div>
                  {colour.value}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </ShopItemStyles>
  );
};

const ShopItemStyles = styled.div`
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 4rem;
    padding-top: 2rem;

    .hashtags-wrapper {
      display: flex;
      gap: 1rem;
      font-weight: 600;
      font-size: 1.1rem;
      margin-top: 1rem;
    }

    .item-description {
      font-size: 1rem;
      margin-top: 2rem;

      &__text {
        margin-top: 0.5rem;
      }
    }

    .item-info {
      margin-top: 2rem;
      border-bottom: 1px solid var(--grey-10);

      &__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid var(--grey-10);
        padding: 0.5rem 0;
      }

      &__tag {
        font-size: 1rem;
      }

      .gender--value {
        text-transform: lowercase;
        text-align: end;
        &::first-letter {
          text-transform: capitalize;
        }
      }

      .colour--value {
        display: flex;

        align-items: center;
        gap: 0.5rem;
      }

      .colour-circle {
        height: 25px;
        width: 25px;
        border-radius: 50%;
      }

      &__value {
        font-size: 1rem;
      }
    }

    .hero-wrapper {
      background-color: var(--bg-grey);
    }

    .item-hero {
      margin-top: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .item-name {
        font-size: var(--font-xxl);
      }
    }

    .item--button {
      margin-top: 1rem;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .item-price {
      margin-top: 1.5rem;
      font-size: 1.2rem;
    }

    .user {
      .user-photo {
        border-radius: 50%;
      }

      .user-mail {
        color: var(--grey-60);
        font-size: 0.9rem;
      }

      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .photo {
      margin-bottom: 2rem;
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1.2;
    }
  }
`;

export default ShopItem;
