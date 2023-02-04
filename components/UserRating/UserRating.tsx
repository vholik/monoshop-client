import { UserRatingStyles } from './UserRating.styles'
import Image from 'next/image'
import Star from '@public/images/star-filled.svg'
import StarGrey from '@public/images/star-filled-grey.svg'

interface UserRatingProps {
  rating: number
  count?: number
}

export const UserRating = ({ rating, count }: UserRatingProps) => {
  return (
    <UserRatingStyles>
      <div className="stars">
        {new Array(rating).fill('rating').map((i, key) => (
          <div className="rating-star" key={key}>
            <Image src={Star} alt="Star" draggable="false" />
          </div>
        ))}
        {new Array(5 - rating).fill('rating').map((i, key) => (
          <div className="rating-star" key={key}>
            <Image src={StarGrey} alt="Star" draggable="false" />
          </div>
        ))}
      </div>
      {rating && <p className="count">{count}</p>}
    </UserRatingStyles>
  )
}
