import { useEffect } from 'react'
import ProfileItems from '@components/ProfileItems/ProfileItems'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { getUserItems } from '@store/reducers/item/GetUserItemsSlice'
import { showErrorToast } from '@utils/ReactTostify/tostifyHandlers'
import Profile from '@components/Profile/Profile'
import SuccessIcon from '@public/images/okay-green.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { CustomHead } from '@utils/CustomHead'

const MyProfile = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const items = useAppSelector((state) => state.getUserItemsReducer.items)
  const status = useAppSelector((state) => state.getUserItemsReducer.status)

  useEffect(() => {
    dispatch(getUserItems())
      .unwrap()
      .catch((error) => {
        showErrorToast('Error displaying user items')
      })
  }, [])

  return (
    <>
      {router.query.success && (
        <div className="sucess-table">
          <Image src={SuccessIcon} alt="Success Icon" />
          {router.query.success}
        </div>
      )}
      <CustomHead title="Selling clothes" />

      <Profile isLoading={status === 'loading'} isError={status === 'error'}>
        <ProfileItems items={items} />
      </Profile>
    </>
  )
}

export default MyProfile
