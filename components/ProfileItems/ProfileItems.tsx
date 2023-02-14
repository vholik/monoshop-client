import { Item } from '@store/types/item'
import { ProfileItemsStyles } from './ProfileItems.styles'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { deleteItemById } from '@store/reducers/item/DeleteItemSlice'
import { getUserItems } from '@store/reducers/item/GetUserItemsSlice'
import { showSuccesToast } from '@utils/ReactTostify/tostifyHandlers'
import ErrorPage from 'pages/404'
import CustomModal from '@components/CustomModal/CustomModal'
import SettingsDots from '@public/images/settings-dots.svg'

interface ProfileItemsProps {
  items: Item[]
}

const ProfileItems = ({ items }: ProfileItemsProps) => {
  const dispatch = useAppDispatch()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<null | number>(null)

  const deleteStatus = useAppSelector((state) => state.deleteItemReducer.status)

  const deleteHandler = () => {
    setModalIsOpen(false)

    if (deleteId) {
      dispatch(deleteItemById(deleteId))
        .unwrap()
        .then(() => {
          showSuccesToast('Succesfully deleted item'),
            // Refetch
            dispatch(getUserItems())
              .unwrap()
              .catch((err) => {
                console.log('rejected', err)
              })
        })
        .catch((err) => {
          console.log('rejected', err)
        })
    }
  }

  function openModal() {
    setModalIsOpen(true)
  }

  if (deleteStatus === 'error') {
    return <ErrorPage />
  }

  console.log(items)

  return (
    <ProfileItemsStyles>
      <CustomModal
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        subtitle="You can not return your deleted item"
        title="Delete this item?"
        actionName="Delete"
        onSubmit={deleteHandler}
      />
      {!items.length && (
        <h2 className="no-items">
          You don't have any items on sell.{' '}
          <Link href="/sell">
            <span className="bold">Sell</span>
          </Link>
        </h2>
      )}

      {items.map((item) => (
        <div className="item" key={item.id}>
          <div className="item-image">
            <Link href={`shop/${item.id}`}>
              <Image src={item.images[0]} alt="Photo" fill objectFit="cover" />
            </Link>
          </div>
          <div className="bar">
            <div className="hero">
              <div className="item-name">{item.name}</div>

              <div className="dropdown-settings">
                <Image src={SettingsDots} alt="Settings" draggable={false} />
                <div className="dropdown-tab">
                  <Link href={`/edit/${item.id}`}>
                    <div className="dropdown-tab__item">Edit</div>
                  </Link>
                  <div
                    className="dropdown-tab__item"
                    onClick={() => {
                      openModal(), setDeleteId(item.id)
                    }}
                  >
                    Delete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </ProfileItemsStyles>
  )
}

export default ProfileItems
