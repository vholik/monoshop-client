import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { getFavorites } from '@store/reducers/favorite/GetFavoriteSlice'
import { useEffect } from 'react'
import { showErrorToast } from '@utils/ReactTostify/tostifyHandlers'
import Profile from '@components/Profile/Profile'
import Favorites from '@components/Favorites/Favorites'
import { CustomHead } from '@utils/CustomHead'

const FavoritesPage = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.getFavoriteReducer.status)
  const items = useAppSelector((state) => state.getFavoriteReducer.items)

  useEffect(() => {
    dispatch(getFavorites())
      .unwrap()
      .then((res) => console.log(res))
      .catch((err) => showErrorToast('Can not load favorites'))
  }, [])

  return (
    <Profile
      isLoading={status === 'loading' || status === 'init'}
      isError={status === 'error'}
    >
      <CustomHead title="Favorites" />
      <Favorites items={items} />
    </Profile>
  )
}

export default FavoritesPage
