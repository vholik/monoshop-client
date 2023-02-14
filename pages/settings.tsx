import { useEffect } from 'react'
import ProfileSettings from '@components/ProfileSettings/ProfileSettings'
import { getProfile } from '@store/reducers/user/ProfileSlice'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import Profile from '@components/Profile/Profile'
import { CustomHead } from '@utils/CustomHead'

const MyProfile = () => {
  const dispatch = useAppDispatch()

  const status = useAppSelector((state) => state.profileReducer.status)
  const user = useAppSelector((state) => state.profileReducer.user)

  useEffect(() => {
    dispatch(getProfile())
      .unwrap()
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <Profile isLoading={status === 'loading'} isError={status === 'error'}>
      <CustomHead title="Account settings" />
      <ProfileSettings user={user} />
    </Profile>
  )
}

export default MyProfile
