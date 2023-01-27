import Modal from 'react-modal'
import { modalStyles } from '@utils/customModal.styles'
import { Dispatch, SetStateAction } from 'react'

Modal.setAppElement('#__next')

interface CustomModalProps {
  isOpen: boolean
  onSubmit?: () => void
  setIsOpen: Dispatch<SetStateAction<boolean>>
  title: string
  subtitle: string
  actionName?: string
}

function CustomModal({
  isOpen,
  onSubmit,
  setIsOpen,
  subtitle,
  title,
  actionName
}: CustomModalProps) {
  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={modalStyles}
      contentLabel="Example Modal"
    >
      <div className="modal-inner">
        <h2 className="modal-inner__title">{title}</h2>
        <p className="modal-inner__text">{subtitle}</p>
        {actionName && (
          <div className="modal-buttons">
            <button className="button cancel--button" onClick={closeModal}>
              Cancel
            </button>
            <button className="button" onClick={onSubmit}>
              {actionName}
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}
export default CustomModal
