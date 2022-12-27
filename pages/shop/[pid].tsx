import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import { getItemById } from "@store/reducers/item/GetItemByIdSlice";

import styled from "styled-components";
import Image from "next/image";
import unfilledHeart from "@public/images/unfilled-heart.svg";
import Footer from "@components/Footer/Footer";
import Link from "next/link";
import ArrowLeft from "@public/images/arrow-left.svg";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { useEffect } from "react";
import Router, { useRouter } from "next/router";

const ShopItem = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { pid } = router.query;

  const { item, isLoading, error } = useAppSelector(
    (state) => state.getItemByIdReducer
  );

  useEffect(() => {
    if (router.isReady) {
      dispatch(getItemById(pid as string))
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
  }, [router.isReady]);

  if (error) {
    Router.push("/404");
  }

  return (
    <ShopItemStyles>
      <Header />
      <Categories />
      <div className="container">
        <Link href="/shop">
          <div className="return">
            <Image src={ArrowLeft} alt="Arrow" />
            Return to previous page
          </div>
        </Link>
        {isLoading ? (
          <LoadingItemStyles>
            <div className="wrapper">
              <div className="left">
                <div className="photo loading-background"></div>
              </div>
              <div className="right">
                {item?.user && (
                  <div className="user">
                    <div className="user-photo"></div>

                    <div className="user-info">
                      <h3 className="user-name"></h3>
                      <p className="user-mail"></p>
                    </div>
                  </div>
                )}

                <div className="hero-wrapper">
                  <div className="item-hero">
                    <h2 className="item-name"></h2>
                  </div>
                  <h2 className="item-price"></h2>
                  <button className="button item--button"></button>
                </div>

                <div className="item-info">
                  <div className="item-info__item">
                    <h2 className="item-info__tag"></h2>
                    <h2 className="item-info__value gender--value"></h2>
                  </div>
                  <div className="item-info__item">
                    <h2 className="item-info__tag"></h2>
                    <h2 className="item-info__value gender--value"></h2>
                  </div>
                  <div className="item-info__item">
                    <h2 className="item-info__tag"></h2>
                    <h2 className="item-info__value"></h2>
                  </div>
                  <div className="item-info__item">
                    <h2 className="item-info__tag"></h2>
                    <h2 className="item-info__value"></h2>
                  </div>
                  <div className="item-info__item">
                    <h2 className="item-info__tag"></h2>
                    <h2 className="item-info__value"></h2>
                  </div>
                  <div className="item-info__item">
                    <h2 className="item-info__tag"></h2>
                    <h2 className="item-info__value"></h2>
                  </div>
                  <div className="item-info__item">
                    <h2 className="item-info__tag"></h2>
                    <h2 className="item-info__value colour--value"></h2>
                  </div>
                </div>
              </div>
            </div>
          </LoadingItemStyles>
        ) : (
          <div className="wrapper">
            <div className="left">
              {item?.images?.map((url, key) => (
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
              {item?.user && (
                <div className="user">
                  <Link href={`/user/${item?.user.id}`}>
                    <Image
                      src={item!.user.image}
                      alt="User photo"
                      className="user-photo"
                      width={50}
                      height={50}
                    />
                  </Link>
                  <Link href={`/user/${item?.user.id}`}>
                    <div className="user-info">
                      <h3 className="user-name">{item?.user.fullName}</h3>
                      <p className="user-mail">{item?.user.email}</p>
                    </div>
                  </Link>
                </div>
              )}

              <div className="hero-wrapper">
                <div className="item-hero">
                  <h2 className="item-name">{item?.name}</h2>
                  <Image src={unfilledHeart} alt="Add to favorite" />
                </div>
                <h2 className="item-price">{item?.price} PLN</h2>
                <button className="button item--button">Message</button>
              </div>
              <div className="item-info">
                <div className="item-info__item">
                  <h2 className="item-info__tag">Category</h2>
                  <h2 className="item-info__value gender--value">
                    {item?.category.value}
                  </h2>
                </div>
                <div className="item-info__item">
                  <h2 className="item-info__tag">Gender</h2>
                  <h2 className="item-info__value gender--value">
                    {item?.gender}
                  </h2>
                </div>
                <div className="item-info__item">
                  <h2 className="item-info__tag">Brand</h2>
                  <h2 className="item-info__value">{item?.brand.value}</h2>
                </div>
                <div className="item-info__item">
                  <h2 className="item-info__tag">Size</h2>
                  <h2 className="item-info__value">{item?.size}</h2>
                </div>
                <div className="item-info__item">
                  <h2 className="item-info__tag">Style</h2>
                  <h2 className="item-info__value">{item?.style?.value}</h2>
                </div>
                <div className="item-info__item">
                  <h2 className="item-info__tag">Condition</h2>
                  <h2 className="item-info__value">{item?.condition}/10</h2>
                </div>
                <div className="item-info__item">
                  <h2 className="item-info__tag">Colour</h2>
                  <h2 className="item-info__value colour--value">
                    <div
                      className="colour-circle"
                      style={{ backgroundColor: `#${item?.colour?.hexCode}` }}
                    ></div>
                    {item?.colour?.value}
                  </h2>
                </div>
              </div>
              {item?.description && (
                <div className="item-description">
                  <p
                    className="item-description__text"
                    dangerouslySetInnerHTML={{ __html: item!.description }}
                  ></p>
                </div>
              )}
              {item?.hashtags.length !== 0 && item?.hashtags && (
                <div className="hashtags-wrapper">
                  {item?.hashtags.map((hashtag, key) => (
                    <div className="hashtag" key={key}>
                      #{hashtag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </ShopItemStyles>
  );
};

const LoadingItemStyles = styled.div`
  .user {
    .user-photo {
      height: 50px;
      width: 50px;
      border-radius: 50%;
      background-color: var(--grey-10);
    }

    .user-name {
      width: 7rem;
      height: 1.3rem;
      background-color: var(--grey-10);
    }

    .user-mail {
      width: 10rem;
      height: 1.2rem;
      margin-top: 0.5rem;
      background-color: var(--grey-10);
    }
  }

  .item-name {
    height: 2.4rem;
    background-color: var(--grey-10);
    width: 20rem;
  }

  .item-price {
    height: 1.4rem;
    width: 8rem;
    background-color: var(--grey-10);
  }

  .item--button {
    background-color: var(--grey-10);
    height: 3.45rem;
  }

  .item-info {
    &__tag {
      height: 1.2rem;
      width: 5rem;
      background-color: var(--grey-10);
    }
    &__value {
      height: 1.2rem;
      width: 5rem;
      background-color: var(--grey-10);
    }
  }
`;

const ShopItemStyles = styled.div`
  .return {
    width: fit-content;
    cursor: pointer;
    margin-top: 2rem;
    display: flex;
    font-size: 1rem;
    font-weight: 600;
    gap: 1rem;
    align-items: center;
  }

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
        margin-top: 0.5rem;
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
