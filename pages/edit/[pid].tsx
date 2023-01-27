import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { uploadImage } from '@store/reducers/image/UploadImageSlice'
import Image from 'next/image'
import { getCategories } from '@store/reducers/category/GetCategoriesSlice'
import { getBrands } from '@store/reducers/brand/GetBrandsSlice'
import { getStyles } from '@store/reducers/style/GetStylesSlice'
import { getColours } from '@store/reducers/colour/GetColoursSlice'
import { Gender } from '@store/types/gender.enum'

import {
  colourStyles,
  conditions,
  genders,
  sizes
} from '@utils/ReactSelect/reactSelectUtils'
import Select from 'react-select'
import { getSubcategories } from '@store/reducers/subcategory/GetSubcategoriesSlice'
import { Reorder } from 'framer-motion'
import Trash from '@public/images/trash.svg'
import Upload from '@public/images/upload.svg'
import Drag from '@public/images/drag.svg'
import { showErrorToast } from '@utils/ReactTostify/tostifyHandlers'
import { Controller, Ref, SubmitHandler, useForm } from 'react-hook-form'
import { ISellForm } from '@store/types/form'
import { ItemEntity, ItemEntityWithId } from '@store/types/item-entity'
import { hashtagsRegex } from '@utils/validationRegex'
import {
  convertHashtagsToString,
  convertStringToHashtags
} from '@utils/hashtagsConverter'
import { addItem } from '@store/reducers/item/AddItemSlice'
import Router from 'next/router'
import { SellStyles } from 'styles/shared/SellStyles'
import { wrapper } from '@store/reducers/store'
import { getItemById } from '@store/reducers/item/GetItemByIdSlice'
import { Item } from '@store/types/item'
import { isAxiosError } from 'axios'
import ErrorPage from 'pages/404'
import { editItem } from '@store/reducers/item/EditItemSlice'
import { checkIsAuth } from '@store/reducers/auth/AuthSlice'

export const getServerSideProps = wrapper.getStaticProps(
  (store) =>
    async ({ params }) => {
      const pid = params!.pid!

      const item = (await store.dispatch(getItemById(pid as string))).payload
      const brands = (await store.dispatch(getBrands(''))).payload
      const styles = (await store.dispatch(getStyles())).payload
      const colours = (await store.dispatch(getColours())).payload

      if (item) {
        if ('category' in item) {
          await store.dispatch(getSubcategories(item.category.id))
        }
        if ('subcategory' in item) {
          await store.dispatch(getCategories(item.gender))
        }
      }

      return {
        props: {
          item: item,
          brands: brands,
          styles: styles,
          colours: colours
        }
      }
    }
)

interface EditProps {
  item: Item
  brands: ItemEntityWithId[]
  styles: ItemEntity[]
  colours: ItemEntity[]
}

export default function Edit({ item, brands, colours, styles }: EditProps) {
  const dispatch = useAppDispatch()

  const categoryRef = useRef<any>(null)
  const subcategoryRef = useRef<any>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    resetField,
    formState: { errors: formErrors }
  } = useForm<ISellForm>({
    mode: 'onBlur'
  })

  const imageStatus = useAppSelector((state) => state.uploadImageReducer.status)

  const fetchItemStatus = useAppSelector(
    (state) => state.getItemByIdReducer.status
  )

  if (fetchItemStatus === 'error') {
    return <ErrorPage />
  }

  const categories = useAppSelector(
    (state) => state.getCategoriesReducer.categories
  )

  const subcategories = useAppSelector(
    (state) => state.getSubcategoriesReducer.subcategories
  )

  const coloursStatus = useAppSelector(
    (state) => state.getColoursReducer.status
  )

  const itemStatus = useAppSelector((state) => state.editItemReducer.status)

  const [formImages, setFormImages] = useState<string[]>([])

  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [gender, setGender] = useState<Gender | null>(null)

  const handleImageSubmit = (e: ChangeEvent<HTMLInputElement>) => {
    if (formImages.length >= 5) {
      showErrorToast('Max 5 images')

      return
    }

    const image = e.target.files![0]

    if (image) {
      let body = new FormData()
      body.set('key', process.env.NEXT_PUBLIC_IMAGE_API_KEY!)
      body.append('image', image)

      dispatch(uploadImage(body))
        .unwrap()
        .then((result) => {
          // Add image url to the form images state
          const image = result.data.url
          const find = formImages.find((url) => url === image)

          if (find) {
            showErrorToast('Images can not be the same')
          } else {
            setFormImages([image, ...formImages])
          }
        })
        .catch((error) => {
          ;+console.error('rejected', error)
        })
    }
  }

  const deleteImage = (key: number) => {
    setFormImages(formImages.filter((_, index) => key !== index))
  }

  useEffect(() => {
    setFormImages(item.images)
    setGender(item.gender)
    setValue('categoryId', item.category.id)
    setValue(
      'brand',
      item.brand.map((brand) => brand.id)
    )
    setValue('gender', item.gender)
    setValue('colour', item.colour.value)
    setValue('condition', item.condition)
    setValue(
      'description',
      item.description ? item.description.replaceAll('<br />', '\n') : ''
    )
    setValue('hashtags', convertHashtagsToString(item.hashtags))
    setValue('images', item.images)
    setValue('name', item.name)
    setValue('price', item.price)
    setValue('size', item.size)
    setValue('style', item.style.value)
    setValue('subcategoryId', item.subcategory.id)

    dispatch(checkIsAuth())
      .unwrap()
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    setCategoryId(item.category.id)
  }, [item.category.id])

  const genderChange = (gender: Gender | null) => {
    setCategoryId(null)
    setGender(gender)

    // Clear values of forward inputs
    resetField('categoryId')
    categoryRef.current.clearValue()
    resetField('subcategoryId')
    subcategoryRef.current.clearValue()

    if (gender) {
      // Categories
      dispatch(getCategories(gender))
        .unwrap()
        .catch((error) => {
          console.error('rejected', error)
        })
    }
  }

  const categoryChange = (categoryId: number | null) => {
    subcategoryRef.current.clearValue()

    setCategoryId(categoryId)

    if (categoryId) {
      // Categories
      dispatch(getSubcategories(categoryId))
        .unwrap()
        .catch((error) => {})
    }
  }

  const onSubmit: SubmitHandler<ISellForm> = (data) => {
    if (!formImages.length) {
      showErrorToast('Please upload at least 1 image')
      return
    }

    const patchedData = {
      ...data,
      images: formImages,
      hashtags: convertStringToHashtags(data.hashtags),
      id: item.id,
      description: data.description.replace(/\r\n|\r|\n/g, '<br />')
    }

    dispatch(editItem(patchedData))
      .unwrap()
      .then(() => {
        Router.push({
          pathname: '/success',
          query: {
            message: 'Successfully edited your item'
          }
        })
      })
      .catch((err) => {
        showErrorToast('Error editing your item. Please try again later')
      })
  }

  if (itemStatus === 'error') {
    return <ErrorPage />
  }

  return (
    <SellStyles>
      <div className="container">
        <div className="wrapper">
          <h1 className="title-md">Sell new item</h1>

          <form className="inner" onSubmit={handleSubmit(onSubmit)}>
            {/* First row */}
            <div className="row">
              <label className="image-upload">
                <input
                  type="file"
                  className="image-upload-input"
                  accept="image/*"
                  onChange={handleImageSubmit}
                  disabled={imageStatus === 'loading'}
                />
                <Image
                  src={Upload}
                  alt="Upload"
                  className="upload-icon"
                  height={50}
                  width={50}
                />
                Upload an image
              </label>

              {imageStatus === 'loading' && (
                <div className="item-image skeleton-animation"></div>
              )}
              <Reorder.Group
                as="ol"
                axis="y"
                values={formImages}
                onReorder={setFormImages}
              >
                {formImages.map((url, key) => (
                  <Reorder.Item key={url} value={url}>
                    <div
                      className="item-image"
                      style={{
                        backgroundImage: `url('${url}')`
                      }}
                    >
                      <div className="item-image__inner">
                        <div className="image-icon drag--icon">
                          <Image src={Drag} alt="Drag" />
                        </div>
                        <div
                          className="image-icon delete--icon"
                          onClick={() => deleteImage(key)}
                        >
                          <Image src={Trash} alt="Delete" />
                        </div>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
            <div className="inner-row">
              {/* Second row */}
              <div className="row">
                <label className="label">
                  Title
                  <input
                    type="text"
                    className="input"
                    minLength={5}
                    maxLength={50}
                    {...register('name', {
                      required: 'Title is required',
                      minLength: {
                        value: 5,
                        message: 'Name should have at least 5 symbols'
                      },
                      maxLength: {
                        value: 50,
                        message: 'Name can not have more than 50 symbols'
                      }
                    })}
                  />
                  {formErrors.name && (
                    <p className="error">{formErrors.name.message}</p>
                  )}
                </label>
                <label className="label">
                  Category
                  <Controller
                    name="categoryId"
                    control={control}
                    rules={{ required: 'Please select category' }}
                    render={({
                      field: { value, name, onChange, onBlur, ref }
                    }) => (
                      <Select
                        ref={categoryRef}
                        instanceId="select"
                        className="select"
                        name={name}
                        options={categories}
                        isClearable={true}
                        isSearchable={true}
                        isDisabled={!gender}
                        styles={colourStyles}
                        placeholder=""
                        onChange={(val) => {
                          onChange(val?.id), categoryChange(val ? val.id : null)
                        }}
                        value={categories.find((c) => c.id === value)}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {formErrors.categoryId && (
                    <p className="error">{formErrors.categoryId.message}</p>
                  )}
                </label>

                <label className="label">
                  Style
                  <Controller
                    name="style"
                    control={control}
                    rules={{ required: 'Please select style' }}
                    render={({ field: { value, name, onChange, onBlur } }) => (
                      <Select
                        instanceId="select"
                        className="select"
                        name={name}
                        options={styles}
                        isClearable={true}
                        isSearchable={true}
                        styles={colourStyles}
                        placeholder=""
                        onChange={(val) => onChange(val?.value)}
                        value={styles.find((c) => c.value === value)}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {formErrors.style && (
                    <p className="error">{formErrors.style.message}</p>
                  )}
                </label>
                <label className="label">
                  Colour
                  <Controller
                    name="colour"
                    control={control}
                    rules={{ required: 'Please select colour' }}
                    render={({
                      field: { value, name, onChange, onBlur, ref }
                    }) => (
                      <Select
                        ref={ref}
                        instanceId="select"
                        className="select"
                        name={name}
                        isLoading={coloursStatus === 'loading'}
                        options={colours}
                        isClearable={true}
                        isSearchable={true}
                        styles={colourStyles}
                        placeholder=""
                        defaultValue={{
                          value: item.colour.value,
                          label: item.colour.value,
                          hexCode: item.colour.hexCode
                        }}
                        onChange={(val) => onChange(val?.value)}
                        value={styles.find((c) => c.value === value)}
                        onBlur={onBlur}
                        formatOptionLabel={(option) => (
                          <div>
                            {option.hexCode ? (
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  alignItems: 'center'
                                }}
                              >
                                <div
                                  style={{
                                    height: '20px',
                                    width: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: `#${option.hexCode}`
                                  }}
                                ></div>
                                <span>{option.label}</span>
                              </div>
                            ) : (
                              <span>{option.label}</span>
                            )}
                          </div>
                        )}
                      />
                    )}
                  />
                  {formErrors.colour && (
                    <p className="error">{formErrors.colour.message}</p>
                  )}
                </label>
                <label className="label">
                  Price
                  <input
                    type="number"
                    className="input"
                    step="0.01"
                    min={0}
                    max={100000}
                    {...register('price', {
                      required: 'Price is required',
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: 'Please pick a price'
                      },
                      max: {
                        value: 10000,
                        message: 'Price can not be greater than 10 000'
                      }
                    })}
                  />
                  {formErrors.price && (
                    <p className="error">{formErrors.price.message}</p>
                  )}
                </label>
                <label className="label">
                  Hashtags
                  <input
                    type="text"
                    className="input"
                    {...register('hashtags', {
                      pattern: {
                        value: hashtagsRegex,
                        message: 'Incorrect hashtags (5 hashtags max)'
                      }
                    })}
                  />
                  {formErrors.hashtags && (
                    <p className="error">{formErrors.hashtags.message}</p>
                  )}
                </label>
              </div>
              {/* Third row */}
              <div className="row">
                <label className="label">
                  Gender
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: 'Please select gender' }}
                    render={({ field: { value, name, onChange, onBlur } }) => (
                      <Select
                        instanceId="select"
                        className="select"
                        name={name}
                        options={genders}
                        styles={colourStyles}
                        placeholder=""
                        onChange={(val) => {
                          onChange(val?.value)
                          genderChange(val ? val.value : null)
                        }}
                        value={genders.find((c) => c.value === value)}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {formErrors.gender && (
                    <p className="error">{formErrors.gender.message}</p>
                  )}
                </label>
                <label className="label">
                  Subcategory
                  <Controller
                    name="subcategoryId"
                    control={control}
                    rules={{ required: 'Please select subcategory' }}
                    render={({
                      field: { value, name, onChange, onBlur, ref }
                    }) => (
                      <Select
                        ref={subcategoryRef}
                        instanceId="select"
                        className="select"
                        name={name}
                        options={subcategories}
                        isClearable={true}
                        isSearchable={true}
                        styles={colourStyles}
                        placeholder=""
                        isDisabled={!categoryId}
                        onChange={(val) => {
                          onChange(val ? val.id : val)
                        }}
                        value={subcategories.find((c) => c.id === value)}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {formErrors.subcategoryId && (
                    <p className="error">{formErrors.subcategoryId.message}</p>
                  )}
                </label>
                <label className="label">
                  Condition
                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: 'Please select condition' }}
                    render={({ field: { value, name, onChange, onBlur } }) => (
                      <Select
                        instanceId="select"
                        className="select"
                        name={name}
                        options={conditions}
                        isClearable={true}
                        isSearchable={true}
                        styles={colourStyles}
                        placeholder=""
                        onChange={(val) => onChange(val?.value)}
                        value={conditions.find((c) => c.value === value)}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {formErrors.condition && (
                    <p className="error">{formErrors.condition.message}</p>
                  )}
                </label>
                <label className="label">
                  Brands
                  <Controller
                    name="brand"
                    control={control}
                    rules={{
                      required: 'Please select brands',
                      maxLength: {
                        value: 5,
                        message: 'Max 5 brands'
                      }
                    }}
                    render={({ field: { value, name, onChange, onBlur } }) => (
                      <Select
                        instanceId="select"
                        className="select"
                        name={name}
                        isMulti
                        options={brands}
                        isClearable={true}
                        isSearchable={true}
                        styles={colourStyles}
                        placeholder=""
                        value={brands.filter(
                          (brand) => value && value.includes(brand.id)
                        )}
                        onChange={(val) => onChange(val.map((c) => c.id))}
                      />
                    )}
                  />
                  {formErrors.brand && (
                    <p className="error">{formErrors.brand.message}</p>
                  )}
                </label>
                <label className="label">
                  Size
                  <Controller
                    name="size"
                    control={control}
                    rules={{ required: 'Please select size' }}
                    render={({ field: { value, name, onChange, onBlur } }) => (
                      <Select
                        instanceId="select"
                        className="select"
                        name={name}
                        options={sizes}
                        isClearable={true}
                        isSearchable={true}
                        styles={colourStyles}
                        placeholder=""
                        onChange={(val) => onChange(val?.value)}
                        value={sizes.find((c) => c.value === value)}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {formErrors.size && (
                    <p className="error">{formErrors.size.message}</p>
                  )}
                </label>
              </div>
              <label className="label description--label">
                Description
                <textarea
                  id="description"
                  maxLength={200}
                  {...register('description', {
                    maxLength: 200
                  })}
                ></textarea>
                {formErrors.description && (
                  <p className="error">{formErrors.description.message}</p>
                )}
              </label>
              <button
                className="button submit--buton"
                disabled={itemStatus === 'loading' || itemStatus === 'success'}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </SellStyles>
  )
}
