import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import { getItemById } from "@store/reducers/item/GetItemByIdSlice";
import styled from "styled-components";
import Image from "next/image";
import unfilledHeart from "@public/images/unfilled-heart.svg";
import Footer from "@components/Footer/Footer";
import Link from "next/link";
import ArrowLeft from "@public/images/arrow-left.svg";
import ArrowRight from "@public/images/arrow-right.svg";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { CSSProperties, useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const arrowStyles: CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  bottom: "auto",
  padding: "1em",
  zIndex: 2,
  backgroundColor: "rgba(255,255,255,0.3)",
};

const ShopItem = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { pid } = router.query;

  const [images, setImages] = useState<{ image: string }[]>([]);

  const { item, isLoading, error } = useAppSelector(
    (state) => state.getItemByIdReducer
  );

  useEffect(() => {
    if (router.isReady) {
      dispatch(getItemById(pid as string))
        .unwrap()
        .then((res) => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          const mappedImages = res.images.map((image) => {
            return {
              image,
            };
          });
          setImages(mappedImages);
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
        <div className="url">
          <p className="url-item">Main page</p>
          <Image src={ArrowRight} alt="url" width={10} height={10} />
          <p className="url-item">{item?.category.value}</p>
          <Image src={ArrowRight} alt="url" width={10} height={10} />
          <p className="url-item">{item?.subcategory.value}</p>
          <Image src={ArrowRight} alt="url" width={10} height={10} />
          <p className="url-item current-url">{item?.name}</p>
        </div>
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
              <Carousel
                showArrows={true}
                showStatus={false}
                showIndicators={false}
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                  hasPrev && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      title={label}
                      style={{
                        ...arrowStyles,
                        left: "0",
                        border: "none",
                      }}
                    >
                      <Image
                        src={ArrowRight}
                        style={{ transform: "rotate(180deg)" }}
                        alt="url"
                        width={15}
                        height={15}
                      />
                    </button>
                  )
                }
                renderArrowNext={(onClickHandler, hasPrev, label) =>
                  hasPrev && (
                    <button
                      type="button"
                      onClick={onClickHandler}
                      title={label}
                      style={{
                        ...arrowStyles,
                        right: "0",
                        border: "none",
                      }}
                    >
                      <Image
                        src={ArrowRight}
                        alt="url"
                        width={15}
                        height={15}
                      />
                    </button>
                  )
                }
              >
                {images.map((image, key) => (
                  <div className="image-slide" key={key}>
                    <img src={image.image} />
                  </div>
                ))}
              </Carousel>
            </div>
            {/* Right */}
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
    height: 1.8rem;
    background-color: var(--grey-10);
    width: 20rem;
  }

  .item-price {
    height: 1.9rem;
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
  .image-slide {
    height: 100%;
    img {
      height: 100%;
      object-fit: contain;
    }
  }

  .url {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 400;
    font-size: 0.9rem;
    margin-top: 1.5rem;
    cursor: pointer;

    .url-item {
      text-decoration: underline;
    }
  }

  .current-url {
    text-decoration: none !important;
    color: var(--grey-60);
  }

  .wrapper {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    grid-column-gap: 4rem;
    padding-top: 1.5rem;

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
        font-weight: 400;
      }

      &__value {
        font-size: 1rem;
        font-weight: 400;
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
    }

    .item-hero {
      margin-top: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .item-name {
        font-size: 1.5rem;
        /* text-transform: uppercase; */
        font-weight: 00;
      }
    }

    .item--button {
      margin-top: 1rem;
      width: 100%;
      font-family: var(--font-medium);
      font-size: 1.2rem;
      display: flex;
      justify-content: center;
    }

    .item-price {
      font-family: var(--font-medium);
      margin-top: 1rem;
      font-size: 1.4rem;
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
