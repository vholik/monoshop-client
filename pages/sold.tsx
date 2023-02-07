import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { useEffect } from 'react'
import Profile from '@components/Profile/Profile'
import SoldList from '@components/SoldItems/SoldItems'
import { getSelled } from '@store/reducers/order/GetSelledSlice'
import { CustomHead } from '@utils/CustomHead'

const Sold = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.getSelledReducer.status)
  const orders = useAppSelector((state) => state.getSelledReducer.orders)

  useEffect(() => {
    dispatch(getSelled())
      .unwrap()
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }, [])

  console.log(orders)

  return (
    <Profile
      isLoading={status === 'loading' || status === 'init'}
      isError={status === 'error'}
    >
      <CustomHead title="Sold clothes" />
      <SoldList orders={orders} />
    </Profile>
  )
}

export default Sold
