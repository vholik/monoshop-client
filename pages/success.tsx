import styled from 'styled-components'
import SuccessIllustration from '@public/images/success.png'
import ArrowLeft from '@public/images/arrow-left.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CustomHead } from '@utils/CustomHead'

export default function Success() {
  const router = useRouter()
  const { pid } = router.query

  return (
    <SuccessStyling>
      <CustomHead title="Success" />
      <div className="image">
        <Image
          src={SuccessIllustration}
          alt="Success"
          style={{ position: 'absolute', objectFit: 'contain' }}
          fill
        />
      </div>
      {router.query.message && <h1 className="text">{router.query.message}</h1>}

      <Link href={'/'}>
        <div className="return">
          <Image src={ArrowLeft} alt="Arrow" />
          Return to home page
        </div>
      </Link>
    </SuccessStyling>
  )
}

export const SuccessStyling = styled.div`
  width: 100%;
  display: flex;
  margin-top: 4rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .image {
    width: 350px;
    height: 350px;
    position: relative;
  }

  .text {
    width: 50%;
    text-align: center;
    margin-top: 1rem;
    font-size: 2rem;
  }

  .return {
    margin-top: 2rem;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
  }
`
