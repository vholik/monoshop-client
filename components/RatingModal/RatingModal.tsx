import Modal from 'react-modal'
import { modalStyles } from '@utils/customModal.styles'
import {
  Dispatch,
  SetStateAction,
  UIEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { getReviews } from '@store/reducers/review/GetReviewsSlice'
import Image from 'next/image'
import { UserRating } from '@components/UserRating/UserRating'
import Loading from '@components/Loading/Loading'

Modal.setAppElement('#__next')

interface RatingModalProps {
  isOpen: boolean
  userId: number
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const RatingModal = ({
  isOpen,
  setIsOpen,
  userId
}: RatingModalProps) => {
  const dispatch = useAppDispatch()
  const listInnerRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(1)

  const reviews = useAppSelector((state) => state.getReviewsReducer.reviews)
  const reviewsStatus = useAppSelector(
    (state) => state.getReviewsReducer.status
  )

  useEffect(() => {
    dispatch(getReviews({ userId, page, take: 2 }))
      .unwrap()
      .catch((e) => console.log(e))
  }, [page])

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current
      if (scrollTop + clientHeight === scrollHeight) {
        if (reviewsStatus !== 'end') {
          setPage((prev) => prev + 1)
        }
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={modalStyles}
      contentLabel="Example Modal"
    >
      <div className="modal-inner">
        <h2 className="reviews-title">Reviews</h2>
        <div
          className="reviews-inner"
          onScroll={() => handleScroll()}
          ref={listInnerRef}
        >
          {!!reviews.length ? (
            reviews.map((review) => (
              <div className="review" key={review.id}>
                <Image
                  src={review.order.item.images[0]}
                  alt="Item photo"
                  width={200}
                  height={200}
                />
                <div className="review-info">
                  <h2 className="review-user">{review.user.fullName}</h2>
                  <UserRating rating={3} />
                  <p className="review-text">Good item recommend</p>
                  <p className="review-date">
                    {new Date(review.date).toLocaleString('en-US', {
                      day: '2-digit',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-items">There is no reviews</p>
          )}
          {reviewsStatus === 'loading' ||
            (reviewsStatus === 'init' && <Loading />)}
        </div>
      </div>
    </Modal>
  )
}
