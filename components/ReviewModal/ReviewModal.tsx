import { ReviewModalStyles } from './ReviewModal.styles'
import Modal from 'react-modal'
import { modalStyles } from '@utils/customModal.styles'
import { Rating } from 'react-simple-star-rating'
import { Dispatch, SetStateAction, useState } from 'react'
import {  SubmitHandler, useForm } from 'react-hook-form'
import { IReviewForm } from '@store/types/review'
import {
  showErrorToast,
  showSuccesToast
} from '@utils/ReactTostify/tostifyHandlers'
import { useAppDispatch } from '@store/hooks/redux'
import { getOrders } from '@store/reducers/order/GetOrdersSlice'
import { postReview } from '@store/reducers/review/PostReviewSlice'

Modal.setAppElement('#__next')

interface ReviewModalProps {
  id: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const ReviewModal = ({ id, isOpen, setIsOpen }: ReviewModalProps) => {
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm<IReviewForm>({
    mode: 'onSubmit'
  })

  const [ratingValue, setRatingValue] = useState(0)

  const handleRating = (rate: number) => {
    setValue('rating', rate)
    setRatingValue(rate)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const onSubmit: SubmitHandler<IReviewForm> = (data) => {
    if (!data.rating) {
      return showErrorToast('Please give the rating')
    }

    dispatch(postReview({ ...data, orderId: id }))
      .unwrap()
      .then(() => {
        showSuccesToast('Posted review succesfuly')
        dispatch(getOrders())
          .unwrap()
          .catch((err) => console.log(err))
      })
      .catch((e) => console.log(e))
  }

  return (
    <ReviewModalStyles>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Review Modal"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="rating-title">Review</h2>
          <p className="rating-subtitle">Rate a product:</p>

          <Rating
            onClick={handleRating}
            fillColor="#ff6243"
            className="rating-stars"
          />
          <div className="error-label-wrapper">
            <p className="rating-subtitle">Describe your experience:</p>
            {errors.text && <p className="error">{errors.text.message}</p>}
          </div>
          <textarea
            className="rating-textarea"
            placeholder="Fine cool shirt..."
            {...register('text', {
              required: 'Please describe your purchase',
              maxLength: {
                message: 'Max 200 symbols',
                value: 200
              },
              minLength: {
                message: 'Min 5 symbols',
                value: 5
              }
            })}
          />
          <button className="rating-button button" type="submit">
            Submit
          </button>
        </form>
      </Modal>
    </ReviewModalStyles>
  )
}
