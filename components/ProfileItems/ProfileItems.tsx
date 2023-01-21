import { Item } from '@store/types/item'
import { ProfileItemsStyles } from './ProfileItems.styles'
import Image from 'next/image'
import TrashCan from '@public/images/trash.svg'
import Link from 'next/link'
import { useState } from 'react'
import Modal from 'react-modal'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { deleteItemById } from '@store/reducers/item/DeleteItemSlice'
import { getUserItems } from '@store/reducers/item/GetUserItemsSlice'
import Router from 'next/router'
import { modalStyles } from '@components/CustomModal/CustomModal.styles'
import { showSuccesToast } from '@utils/ReactTostify/tostifyHandlers'
import ErrorPage from 'pages/404'

Modal.setAppElement('#__next')

interface ProfileItemsProps {
  items: Item[]
}

const ProfileItems = ({ items }: ProfileItemsProps) => {
  const dispatch = useAppDispatch()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<null | number>(null)

  const deleteStatus = useAppSelector((state) => state.deleteItemReducer.status)

  const deleteHandler = () => {
    setIsOpen(false)

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
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  if (deleteStatus === 'error') {
    return <ErrorPage />
  }

  return (
    <ProfileItemsStyles>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Example Modal"
      >
        <div className="modal-inner">
          <h2 className="modal-inner__title">Delete this item?</h2>
          <p className="modal-inner__text">
            You can not return your deleted item
          </p>
          <div className="modal-buttons">
            <button className="button cancel--button" onClick={closeModal}>
              Cancel
            </button>
            <button className="button" onClick={deleteHandler}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
      {!items.length && (
        <h2 className="no-items">
          You don't have any items on sell.{' '}
          <Link href="/sell">
            <span className="bold">Sell</span>
          </Link>
        </h2>
      )}
      {}
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
              <Image
                src={TrashCan}
                alt="Delete"
                height={20}
                width={20}
                onClick={() => {
                  openModal(), setDeleteId(item.id)
                }}
              />
            </div>

            <Link href={`/edit/${item.id}`}>
              <p className="edit">Edit</p>
            </Link>
          </div>
        </div>
      ))}
    </ProfileItemsStyles>
  )
}

export default ProfileItems
