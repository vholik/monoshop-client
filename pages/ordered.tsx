import Categories from '@components/Categories/Categories'
import Header from '@components/Header/Header'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { getFavorites } from '@store/reducers/favorite/GetFavoriteSlice'
import Link from 'next/link'
import { useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Loading from '@components/Loading/Loading'
import Footer from '@components/Footer/Footer'
import { getOrders } from '@store/reducers/order/GetOrdersSlice'
import Profile from '@components/Profile/Profile'
import { showErrorToast } from '@utils/ReactTostify/tostifyHandlers'
import OrderedItems from '@components/OrderedItems/OrderedItems'
import Layout from '@components/Layout/Layout'

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
      // isError={status === "error"}
      isError={false}
    >
      <OrderedItems orders={orders} />
    </Profile>
  )
}

export default Ordered
