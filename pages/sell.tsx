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
import { ItemEntityWithId } from '@store/types/item-entity'
import { hashtagsRegex } from '@utils/validationRegex'
import { convertStringToHashtags } from '@utils/hashtagsConverter'
import { addItem } from '@store/reducers/item/AddItemSlice'
import Router from 'next/router'
import { SellStyles } from 'styles/shared/SellStyles'

export default function Sell() {
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
  const categories = useAppSelector(
    (state) => state.getCategoriesReducer.categories
  )
  const categoriesStatus = useAppSelector(
    (state) => state.getCategoriesReducer.status
  )

  const subcategories = useAppSelector(
    (state) => state.getSubcategoriesReducer.subcategories
  )
  const subcategoriesStatus = useAppSelector(
    (state) => state.getSubcategoriesReducer.status
  )

  const brandsStatus = useAppSelector((state) => state.getBrandsReducer.status)
  const brands = useAppSelector((state) => state.getBrandsReducer.brands)

  const styles = useAppSelector((state) => state.getStylesReducer.styles)
  const stylesStatus = useAppSelector((state) => state.getStylesReducer.status)

  const colours = useAppSelector((state) => state.getColoursReducer.colours)
  const coloursStatus = useAppSelector(
    (state) => state.getColoursReducer.status
  )

  const itemStatus = useAppSelector((state) => state.addItemReducer.status)

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
    //Brands
    dispatch(getBrands(''))
      .unwrap()
      .catch((error) => {
        console.error('rejected', error)
      })
    //Styles
    dispatch(getStyles())
      .unwrap()
      .catch((error) => {
        console.error('rejected', error)
      })
    //Colours
    dispatch(getColours())
      .unwrap()
      .catch((error) => {
        console.error('rejected', error)
      })
  }, [])

  useEffect(() => {
    // Clear values of forward inputs
    resetField('categoryId')
    categoryRef.current.clearValue()
    resetField('subcategoryId')
    subcategoryRef.current.clearValue()

    // Categories
    dispatch(getCategories(gender as Gender))
      .unwrap()
      .catch((error) => {
        console.error('rejected', error)
      })
  }, [gender])

  useEffect(() => {
    resetField('subcategoryId')
    subcategoryRef.current.clearValue()

    if (categoryId) {
      // Categories
      dispatch(getSubcategories(categoryId))
        .unwrap()
        .catch((error) => {})
    }
  }, [categoryId])

  const onSubmit: SubmitHandler<ISellForm> = (data) => {
    if (!formImages.length) {
      showErrorToast('Please upload at least 1 image')
      return
    }

    const patchedData = {
      ...data,
      images: formImages,
      hashtags: convertStringToHashtags(data.hashtags)
    }

    dispatch(addItem(patchedData))
      .unwrap()
      .then(() => {
        Router.push({
          pathname: '/success',
          query: {
            message: 'Successfully added your item to selling'
          }
        })
      })
      .catch((err) => {
        showErrorToast('Error')
      })
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
                        isLoading={categoriesStatus === 'loading'}
                        options={categories}
                        isClearable={true}
                        isSearchable={true}
                        isDisabled={!gender}
                        styles={colourStyles}
                        placeholder=""
                        onChange={(val) => {
                          onChange(val?.id), setCategoryId(val ? val.id : val)
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
                        isLoading={stylesStatus === 'loading'}
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
                    render={({ field: { value, name, onChange, onBlur } }) => (
                      <Select
                        instanceId="select"
                        className="select"
                        name={name}
                        isLoading={coloursStatus === 'loading'}
                        options={colours}
                        isClearable={true}
                        isSearchable={true}
                        styles={colourStyles}
                        placeholder=""
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
                      onChange: (e: ChangeEvent<HTMLInputElement>) => {
                        console.log(e.target.value)
                      },
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
                        isClearable={true}
                        isSearchable={true}
                        styles={colourStyles}
                        placeholder=""
                        onChange={(val) => {
                          onChange(val?.value)
                          setGender(val ? val.value : null)
                          setCategoryId(null)
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
                        isLoading={subcategoriesStatus === 'loading'}
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
                        isLoading={brandsStatus === 'loading'}
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
