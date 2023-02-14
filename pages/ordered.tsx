import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { useEffect } from 'react'
import { getOrders } from '@store/reducers/order/GetOrdersSlice'
import Profile from '@components/Profile/Profile'
import OrderedItems from '@components/OrderedItems/OrderedItems'
import { CustomHead } from '@utils/CustomHead'

const Ordered = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.getOrdersReducer.status)
  const orders = useAppSelector((state) => state.getOrdersReducer.orders)

  useEffect(() => {
    dispatch(getOrders())
      .unwrap()
      .catch((err) => console.log(err))
  }, [])

  return (
    <Profile
      isLoading={status === 'loading' || status === 'init'}
      isError={false}
    >
      <CustomHead title="Ordered clothes" />
      <OrderedItems orders={orders} />
    </Profile>
  )
}

export default Ordered
