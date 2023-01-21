import Categories from '@components/Categories/Categories'
import Header from '@components/Header/Header'
import { getItemById } from '@store/reducers/item/GetItemByIdSlice'
import styled from 'styled-components'
import Image from 'next/image'
import unfilledHeart from '@public/images/unfilled-heart.svg'
import filledHeart from '@public/images/filled-heart.svg'
import Footer from '@components/Footer/Footer'
import Link from 'next/link'
import ArrowRight from '@public/images/arrow-right.svg'
import {
  useActionCreators,
  useAppDispatch,
  useAppSelector
} from '@store/hooks/redux'
import { CSSProperties, Fragment, useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import {
  checkIsFavorite,
  checkIsFavoriteActions
} from '@store/reducers/favorite/CheckIsFavoriteSlice'
import { toggleFavorite } from '@store/reducers/favorite/ToggleFavoriteSlice'
import { getCategories } from '@store/reducers/category/GetCategoriesSlice'
import { getSubcategories } from '@store/reducers/subcategory/GetSubcategoriesSlice'
import { Gender } from '@store/types/gender.enum'
import { addToCart } from '@store/reducers/cart/CartSlice'
import { showErrorToast } from '@utils/ReactTostify/tostifyHandlers'
import { filterActions } from '@store/reducers/filter/FilterSlice'
import Layout from '@components/Layout/Layout'
import ErrorPage from 'pages/404'

const arrowStyles: CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  bottom: 'auto',
  padding: '1em',
  zIndex: 2,
  backgroundColor: 'rgba(255,255,255,0.3)'
}

const ShopItem = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { pid } = router.query

  const authStatus = useAppSelector((state) => state.authReducer.status)
  const userId = useAppSelector((state) => state.authReducer.userId)
  const isFavoriteStasus = useAppSelector(
    (state) => state.checkIsFavoriteReducer.status
  )
  const isFavorite = useAppSelector(
    (state) => state.checkIsFavoriteReducer.isFavorite
  )
  const favoriteTogglerStatus = useAppSelector(
    (state) => state.toggleFavoriteReducer.status
  )

  const item = useAppSelector((state) => state.getItemByIdReducer.item)
  const itemStatus = useAppSelector((state) => state.getItemByIdReducer.status)

  const [images, setImages] = useState<{ image: string }[]>([])

  useEffect(() => {
    if (router.isReady) {
      dispatch(getItemById(pid as string))
        .unwrap()
        .then((res) => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          })
          const mappedImages = res.images.map((image) => {
            return {
              image
            }
          })
          setImages(mappedImages)
          // Check favorite
          if (authStatus === 'authenticated') {
            dispatch(checkIsFavorite(pid as string))
              .unwrap()
              .catch((error: Error) => {
                console.error('rejected', error)
              })
          }
        })
        .catch((error: Error) => {
          console.error('rejected', error)
        })
    }
  }, [router.query.pid])

  const favoriteHandler = () => {
    if (authStatus !== 'authenticated') {
      return Router.push('/login')
    }

    if (
      typeof pid === 'string' &&
      favoriteTogglerStatus !== 'loading' &&
      isFavoriteStasus !== 'loading'
    ) {
      dispatch(toggleFavorite(Number(pid)))
        .unwrap()
        .then((isFavorite) => {
          dispatch(checkIsFavoriteActions.setIsFavorite({ isFavorite }))
        })
        .catch((error: Error) => {
          console.error('rejected', error)
        })
    }
  }
  const genderRedirect = () => {
    if (item?.gender) {
      dispatch(filterActions.resetFilter())
      dispatch(
        filterActions.setGender({ value: item.gender, label: item.gender })
      )
      dispatch(getCategories(item?.gender)).catch((err) => console.log(err))
    }

    Router.push('/shop')
  }

  const categoryRedirect = () => {
    if (item?.gender && item.id) {
      dispatch(filterActions.resetFilter())
      dispatch(
        filterActions.setGender({ value: item.gender, label: item.gender })
      )
      dispatch(
        filterActions.setCategory({
          label: item.category.value,
          value: item.category.value,
          id: item.category.id
        })
      )

      dispatch(getCategories(item?.gender)).catch((err) => console.log(err))
      dispatch(getSubcategories(item.category.id)).catch((err) =>
        console.log(err)
      )
    }

    Router.push('/shop')
  }

  const subcategoryRedirect = () => {
    if (item?.gender && item.id) {
      dispatch(filterActions.resetFilter())
      dispatch(
        filterActions.setGender({ value: item.gender, label: item.gender })
      )
      dispatch(
        filterActions.setCategory({
          label: item.category.value,
          value: item.category.value,
          id: item.category.id
        })
      )
      dispatch(
        filterActions.setCategory({
          label: item.subcategory.value,
          value: item.subcategory.value,
          id: item.subcategory.id
        })
      )

      dispatch(getCategories(item?.gender)).catch((err) => console.log(err))
      dispatch(getSubcategories(item.category.id)).catch((err) =>
        console.log(err)
      )
    }

    Router.push('/shop')
  }

  const buyHandler = () => {
    if (authStatus !== 'authenticated') {
      Router.push({
        pathname: '/login',
        query: {
          redirect: `/shop/${item?.id}`
        }
      })
    } else {
      if (item) {
        dispatch(addToCart(item))
        Router.push('/pay')
      }
    }
  }

  const sendMessage = () => {
    if (authStatus !== 'authenticated') {
      Router.push({
        pathname: '/login',
        query: {
          redirect: `/shop/${item?.id}`
        }
      })
    } else {
      Router.push({
        pathname: '/chat',
        query: {
          send: item?.user.id,
          item: item?.id
        }
      })
    }
  }

  const handleLinkClink = (pid: number) => {
    Router.push(`/shop/${pid}`, `/shop/${pid}`)
  }

  if (itemStatus === 'error') {
    return <ErrorPage />
  }

  console.log(item?.description)

  return (
    <ShopItemStyles>
      <div className="container">
        {itemStatus === 'success' && (
          <div className="url">
            <Link href={'/'}>
              <p className="url-item">Main page</p>
            </Link>
            <Image src={ArrowRight} alt="url" width={10} height={10} />
            {item?.gender && (
              <div>
                <p className="url-item" onClick={genderRedirect}>
                  {item?.gender === Gender.MEN ? 'Menswear' : 'Womenswear'}
                </p>
              </div>
            )}
            <Image src={ArrowRight} alt="url" width={10} height={10} />
            {item?.category && (
              <p className="url-item" onClick={categoryRedirect}>
                {item?.category.value}
              </p>
            )}
            <Image src={ArrowRight} alt="url" width={10} height={10} />
            {item?.subcategory && (
              <p className="url-item" onClick={subcategoryRedirect}>
                {item?.subcategory.value}
              </p>
            )}

            <Image src={ArrowRight} alt="url" width={10} height={10} />
            {item?.name && <p className="url-item current-url">{item?.name}</p>}
          </div>
        )}

        {itemStatus === 'loading' || itemStatus === 'init' ? (
          <LoadingItemStyles>
            <div className="wrapper">
              <div className="left">
                <div className="photo skeleton-animation"></div>
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
                        left: '0',
                        border: 'none'
                      }}
                    >
                      <Image
                        src={ArrowRight}
                        style={{ transform: 'rotate(180deg)' }}
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
                        right: '0',
                        border: 'none'
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
                      style={{ objectFit: 'cover' }}
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
                  {isFavorite ? (
                    <Image
                      src={filledHeart}
                      alt="Add to favorites"
                      onClick={favoriteHandler}
                    />
                  ) : (
                    <Image
                      src={unfilledHeart}
                      alt="Remove from favorites"
                      onClick={favoriteHandler}
                    />
                  )}
                </div>
                <h2 className="item-price">{item?.price} PLN</h2>
                {userId === item?.user?.id ? (
                  <Link href={`/edit/${item.id}`}>
                    <button className="button item--button">Edit</button>
                  </Link>
                ) : (
                  <Fragment>
                    <button
                      className="button item--button"
                      onClick={buyHandler}
                    >
                      Buy now
                    </button>

                    <button
                      className="button item--button message--button"
                      onClick={sendMessage}
                    >
                      Message
                    </button>
                  </Fragment>
                )}
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
                  <h2 className="item-info__value">
                    {item?.brand.map((brand, key) => {
                      if (key === item.brand.length - 1)
                        return <Fragment key={key}>{brand.value}</Fragment>

                      return <Fragment key={key}>{`${brand.value}, `}</Fragment>
                    })}
                  </h2>
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
        {item?.userItems.length && (
          <Fragment>
            <div className="user-items-head">
              <h2 className="title-sm">Also from this user</h2>
              <Link href={`/user/${item.user.id}`}>
                <p className="see-all-button">See all items</p>
              </Link>
            </div>
            <div className="user-items-wrapper">
              {item?.userItems.map((wear) => (
                <div className="user-item" key={wear.id}>
                  <div
                    onClick={() => handleLinkClink(wear.id)}
                    className="user-item__photo"
                    style={{ backgroundImage: `url(${wear.images[0]})` }}
                  ></div>
                  <div className="user-item__price">{wear.price} PLN</div>
                </div>
              ))}
            </div>
          </Fragment>
        )}
      </div>
    </ShopItemStyles>
  )
}

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
`

const ShopItemStyles = styled.div`
  .user-items-head {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    font-size: 1rem;
    justify-content: space-between;

    .user-items-link {
    }
  }

  .user-items-wrapper {
    grid-column: 1 / 4;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-column-gap: 1vw;
    margin-top: 1rem;

    .title {
      font-size: 1.3rem;
      grid-column: 1/6;
      font-family: var(--font-default);
    }

    .user-item {
      &__photo {
        background-position: center;
        background-size: cover;
        aspect-ratio: 1 / 1.1;
        cursor: pointer;
      }
      &__price {
        font-weight: 700;
        margin-top: 0.5rem;
        font-family: var(--font-medium);
      }
    }
  }

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
      gap: 0.5rem;
      font-weight: 600;
      font-size: 1;
      margin-top: 1rem;
      flex-wrap: wrap;

      .hashtag {
        padding: 0.5em 1em;
        border: 1px solid var(--grey-30);
      }
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
        font-family: var(--font-wide);
        font-weight: 00;
      }
    }

    .item--button {
      margin-top: 1rem;
      width: 100%;
      font-family: var(--font-wide);
      font-size: 1.1rem;
      display: flex;
      justify-content: center;
    }

    .message--button {
      color: var(--grey);
      background: transparent;
      border: 1px solid var(--stroke);

      &:hover {
        background-color: var(--grey-5);
      }
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
`

export default ShopItem
