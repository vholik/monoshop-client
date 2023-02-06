import { wrapper } from '@store/reducers/store'
import styled from 'styled-components'
import { User } from '@store/types/user'
import { getUserById } from '@store/reducers/user/GetUserById'
import Image from 'next/image'
import Link from 'next/link'
import Phone from '@public/images/phone.svg'
import Location from '@public/images/location.svg'
import Flash from '@public/images/flash.svg'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import ArrowRight from '@public/images/arrow-left.svg'
import ErrorPage from 'pages/404'
import { checkIsAuth } from '@store/reducers/auth/AuthSlice'
import { UserRating } from '@components/UserRating/UserRating'
import { RatingModal } from '@components/RatingModal/RatingModal'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const pid = query.pid as string
      const user = await (await store.dispatch(getUserById(pid))).payload

      return {
        props: {
          user,
          error: null
        }
      }
    }
)

interface UserProfileProps {
  user: User
}

const UserProfile = ({ user }: UserProfileProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const pid = Number(router.query.pid)

  const status = useAppSelector((state) => state.getUserByIdReducer.status)

  const userId = useAppSelector((state) => state.authReducer.userId)

  useEffect(() => {
    dispatch(checkIsAuth())
      .unwrap()
      .catch((err) => console.log(err))
  }, [])

  if (status === 'error') {
    return <ErrorPage />
  }

  const messageUser = () => {
    if (user) {
      Router.push({
        pathname: '/chat',
        query: {
          send: router.query.pid
        }
      })
    }
  }

  const openModal = () => {
    setIsReviewModalOpen(true)
  }

  return (
    <UserProfileStyles>
      {user && (
        <RatingModal
          isOpen={isReviewModalOpen}
          setIsOpen={setIsReviewModalOpen}
          userId={user.id}
        />
      )}
      <div className="container">
        <div className="back" onClick={() => router.back()}>
          <Image src={ArrowRight} alt="url" width={10} height={10} />
          Back to the previous page
        </div>
        <div className="wrapper">
          <div className="user">
            <Image
              src={user.image}
              alt="User photo"
              width={100}
              height={100}
              style={{ objectFit: 'cover' }}
              className="user-photo"
            />
            <div className="right">
              <h2 className="user-name">{user.fullName}</h2>
              <span onClick={openModal}>
                <UserRating
                  count={Number(user.reviewCount!.toFixed())}
                  rating={user.reviewRating! || 0}
                />
              </span>
              <div className="bottom">
                <p className="user-activity">
                  <Image src={Flash} alt="Flash" height={20} width={20} /> Last
                  active today
                </p>
                {user.phone && (
                  <p className="user-phone">
                    <Image src={Phone} alt="Phone" height={20} width={20} />{' '}
                    {user.phone}
                  </p>
                )}
                {user.location && (
                  <p className="user-location">
                    <Image
                      src={Location}
                      alt="Location"
                      height={20}
                      width={20}
                    />{' '}
                    {user.location}
                  </p>
                )}
              </div>

              {userId !== pid && (
                <button className="button" onClick={messageUser}>
                  Message
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="items-wrapper">
        <div className="container">
          <div className="items-wrapper__inner">
            {user.items?.map((item) => (
              <div className="item" key={item.id}>
                <Link href={`/shop/${item.id}`}>
                  <div
                    className={
                      item.selled ? 'item-image sold--item' : 'item-image'
                    }
                  >
                    <Image
                      src={item.images[0]}
                      alt="Image"
                      style={{ objectFit: 'cover' }}
                      fill
                    />
                  </div>
                </Link>
                <h2 className="item-name">{item.name}</h2>
                <p className="item-price">{item.price} PLN</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserProfileStyles>
  )
}

const UserProfileStyles = styled.div`
  .back {
    margin-top: 1.6rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .wrapper {
    margin-top: 1.6rem;
  }

  .items-wrapper {
    margin-top: 2rem;

    &__inner {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-gap: 1rem;
    }
  }

  .item {
    .item-image {
      aspect-ratio: 1 / 1.2;
      position: relative;
    }

    .item-name {
      font-size: 1rem;
      margin-top: 0.5rem;
    }

    .item-size {
      font-size: 1rem;
      margin-top: 0.5rem;
      color: var(--grey-60);
    }

    .item-price {
      margin-top: 0.5rem;
    }
  }

  .sold--item {
    position: relative;
    &::after {
      position: absolute;
      content: 'SOLD';
      background-color: var(--grey-30);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
      font-size: 1rem;
    }
  }

  .user {
    display: flex;
    gap: 1rem;
    .bottom {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
    }

    .user-photo {
      border-radius: 50%;
    }

    .user-name {
      font-family: var(--font-wide);
      font-size: 1.5rem;
    }

    .user-location,
    .user-phone,
    .user-activity {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-activity {
      color: var(--grey);
    }

    .user-detail {
      margin-top: 0.5rem;
      color: var(--grey-60);
    }

    .button {
      margin-top: 1rem;
    }
  }
`

export default UserProfile
