import CustomModal from '@components/CustomModal/CustomModal'
import { OrderStatuses } from '@components/OrderedItems/order-status'
import { IOrder, OrderStatus } from '@store/types/order'
import { useState } from 'react'
import { OrderStyles } from './Order.styles'
import SettingsDots from '@public/images/settings-dots.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useAppDispatch } from '@store/hooks/redux'
import { setDeliveredOrder } from '@store/reducers/order/SetDeliveredOrderSlice'
import { getOrders } from '../../store/reducers/order/GetOrdersSlice'
import { changeOrderStatus } from '@store/reducers/order/ChangeOrderStatusSlice'
import { dropdownOrderOptions } from './dropdown-order-options.data'
import { getSelled } from '@store/reducers/order/GetSelledSlice'
import { isRouteSold } from '@components/OrderList/route.helper'
import { ReviewModal } from '@components/ReviewModal/ReviewModal'

interface OrderProps {
  order: IOrder
}

const orderInfo = (
  order: Omit<IOrder, 'id' | 'itemId' | 'date' | 'sellerId' | 'status'>
) => {
  return `City: ${order.city}, Country: ${order.country}, Fullname:  ${order.fullName}, Adress 1: ${order.line1}, Adress 2: ${order.line2}, Phone: ${order.phone}, Postal Code: ${order.postalCode}, State: ${order.state}`
}

// Current dropdown status
const nextStatus = (currentStatus: OrderStatus) => {
  const find = dropdownOrderOptions.find(
    (option) => option.status === currentStatus
  )

  if (find) {
    return find.label
  }
}

const getCurrentStatus = (status: OrderStatus) => {
  let currentStatus: {
    status: OrderStatus
    label: string
    color: string
  } = OrderStatuses[0]

  OrderStatuses.map((s) => {
    if (s.status === status) {
      currentStatus = s
    }
  })

  return currentStatus
}

const Order = ({ order }: OrderProps) => {
  const dispatch = useAppDispatch()

  const [statusModalIsOpen, setStatusModalIsOpen] = useState(false)
  const [receivedModalIsOpen, setReceivedModalIsOpen] = useState(false)
  const [destinationModalIsOpen, setDestinationModalIsOpen] = useState(false)
  const [reviewModalIsOpen, setReviewModalIsOpen] = useState(false)

  const setAsReceived = () => {
    setReceivedModalIsOpen(false)

    dispatch(setDeliveredOrder({ orderId: order.id }))
      .unwrap()
      .then(() => {
        // Refetch orders
        dispatch(getOrders())
          .unwrap()
          .catch((err) => console.log(err))
      })
      .catch((e) => console.log(e))
  }

  // On sold page
  const changeStatus = () => {
    setStatusModalIsOpen(false)

    dispatch(changeOrderStatus({ orderId: order.id }))
      .unwrap()
      .then(() => {
        // Refetch orders
        dispatch(getSelled())
          .unwrap()
          .catch((err) => console.log(err))
      })
      .catch((e) => console.log(e))
  }

  const openStatusModal = () => {
    setStatusModalIsOpen(true)
  }

  const openReceivedModal = () => {
    setReceivedModalIsOpen(true)
  }

  const openDestinationInfo = () => {
    setDestinationModalIsOpen(true)
  }

  const openReviewModal = () => {
    setReviewModalIsOpen(true)
  }

  const { id, itemId, date, sellerId, status, ...orderWithoutId } = order

  const destination = orderInfo(orderWithoutId)

  const isShowSettings = () => {
    if (order.status === OrderStatus.DELIVERED) {
      return false
    }
    // /sold
    if (isRouteSold() && order.status === OrderStatus.PICKUP_WAIT) {
      return false
    }

    console.log(isRouteSold(), order.status)

    return true
  }

  return (
    <>
      <ReviewModal
        id={order.id}
        setIsOpen={setReviewModalIsOpen}
        isOpen={reviewModalIsOpen}
      />
      <OrderStyles>
        <CustomModal
          actionName="Submit"
          subtitle="You can not change it after"
          isOpen={receivedModalIsOpen}
          onSubmit={setAsReceived}
          setIsOpen={setReceivedModalIsOpen}
          title="Set as received?"
        />
        <CustomModal
          actionName="Submit"
          subtitle="You can not go back to that status"
          isOpen={statusModalIsOpen}
          onSubmit={changeStatus}
          setIsOpen={setStatusModalIsOpen}
          title={nextStatus(order.status) || 'Change status'}
        />
        <CustomModal
          subtitle={destination}
          isOpen={destinationModalIsOpen}
          setIsOpen={setDestinationModalIsOpen}
          title="Destination info"
        />
        <p className="order-info">{order.id.slice(0, 10)}...</p>
        <p className="order-info">
          {new Date(order.date).toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
          })}
        </p>
        <Link
          href={
            isRouteSold() ? `/user/${order.userId}` : `/user/${order.sellerId}`
          }
        >
          <p className="order-info link">See profile</p>
        </Link>
        <Link href={`/shop/${order.itemId}`}>
          <p className="order-info link">See item</p>
        </Link>
        <p className="order-info link" onClick={openDestinationInfo}>
          See info
        </p>
        <div className="order-info">
          <div className="status">
            <div
              className="status-bg"
              style={{
                backgroundColor: getCurrentStatus(order.status).color
              }}
            ></div>
            <div
              className="status-inner"
              style={{
                color: getCurrentStatus(order.status).color
              }}
            >
              {getCurrentStatus(order.status).label}
            </div>
          </div>
          {/* Display only when item is not delivered */}
          {isShowSettings() && (
            <div className="dropdown-settings">
              <Image src={SettingsDots} alt="Settings" draggable={false} />
              <div className="dropdown-tab">
                {isRouteSold() ? (
                  <div className="dropdown-tab__item" onClick={openStatusModal}>
                    {nextStatus(order.status)}
                  </div>
                ) : (
                  <div
                    className="dropdown-tab__item"
                    onClick={openReceivedModal}
                  >
                    Set as received
                  </div>
                )}
              </div>
            </div>
          )}
          {!isRouteSold() &&
            order.status === OrderStatus.DELIVERED &&
            !order.review && (
              <button
                className="button review-button"
                onClick={openReviewModal}
              >
                Post a review
              </button>
            )}
        </div>
      </OrderStyles>
    </>
  )
}

export default Order
