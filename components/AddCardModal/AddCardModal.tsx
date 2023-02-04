import Modal from 'react-modal'
import { modalStyles } from '@utils/customModal.styles'
import { CardForm } from './CardForm.interface'
import { SubmitHandler, useForm } from 'react-hook-form'
import { cardValidationRegex } from './cardRegex.helper'
import { Dispatch, SetStateAction } from 'react'

Modal.setAppElement('#__next')

interface AddCardModalProps {
  isOpen: boolean
  addCard: (data: CardForm) => void
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const AddCardModal = ({ addCard, isOpen, setIsOpen }: AddCardModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    resetField,
    formState: { errors: formErrors }
  } = useForm<CardForm>({
    mode: 'onBlur'
  })

  const onSubmit: SubmitHandler<CardForm> = (data) => {
    console.log(data)
    addCard(data)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      style={modalStyles}
      contentLabel="Add card"
    >
      <form className="modal-inner" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="card-title">Add card</h1>
        <label htmlFor="" className="label">
          Card number
          <input
            className="input"
            type="text"
            placeholder="xxxx xxxx xxxx xxxx"
            {...register('value', {
              required: 'Please enter card',
              pattern: {
                message: 'Please enter valid card number',
                value: cardValidationRegex
              },
              maxLength: {
                value: 19,
                message: 'Invalid card number length'
              }
            })}
          />
          {formErrors.value && (
            <p className="error">{formErrors.value?.message}</p>
          )}
        </label>
        <label htmlFor="" className="label">
          Card holdername
          <input
            type="text"
            className="input"
            placeholder="Joe Doe"
            {...register('holder', {
              required: 'Please enter your full name',
              maxLength: {
                value: 50,
                message: 'There is too many symbols'
              }
            })}
          />
          {formErrors.holder && (
            <p className="error">{formErrors.holder?.message}</p>
          )}
        </label>
        <button className="button card-button">Save</button>
      </form>
    </Modal>
  )
}
export default AddCardModal
