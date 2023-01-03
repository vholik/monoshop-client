import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import styled from "styled-components";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { MultiValue, SingleValue } from "react-select";
import Footer from "@components/Footer/Footer";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { setError, uploadImage } from "@store/reducers/item/UploadImageSlice";
import Image from "next/image";
import CustomSelect from "@components/CustomSelect/CustomSelect";
import { getCategories } from "@store/reducers/item/GetCategoriesSlice";
import { ItemEntity, ItemEntityWithId } from "@store/types/item-entity";
import { getBrands } from "@store/reducers/item/GetBrandsSlice";
import { getStyles } from "@store/reducers/item/GetStylesSlice";
import { getColours } from "@store/reducers/item/GetColoursSlice";
import { Gender } from "@store/types/gender.enum";
import { addItem } from "@store/reducers/item/AddItemSlice";
import ReactLoading from "react-loading";
import Loading from "@components/Loading/Loading";
import {
  colourStyles,
  conditions,
  genders,
  sizes,
} from "@utils/react-select-utils";
import { getItemById } from "@store/reducers/item/GetItemByIdSlice";
import { wrapper } from "@store/reducers/store";
import { Item } from "@store/types/item";
import Select from "react-select";
import { editItem } from "@store/reducers/item/EditItemSlice";
import { getSubcategories } from "@store/reducers/item/GetSubcategoriesSlice";
import Trash from "@public/images/trash.svg";
import Upload from "@public/images/upload.svg";
import Drag from "@public/images/drag.svg";
import { Reorder } from "framer-motion";
import Router from "next/router";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const pid = query.pid as string;
      const item = await (await store.dispatch(getItemById(pid))).payload;

      if (!item) {
        return {
          props: {
            item: {},
          },
        };
      }

      return {
        props: {
          item,
        },
      };
    }
);

interface EditItemProps {
  item: Item;
}

export default function AddItem({ item }: EditItemProps) {
  const { editItemError, editItemLoading } = useAppSelector(
    (state) => state.editItemReducer
  );
  const dispatch = useAppDispatch();

  const { isLoading, error } = useAppSelector(
    (state) => state.uploadImageReducer
  );
  const { categories, categoriesError, isCategoriesLoading } = useAppSelector(
    (state) => state.getCategoriesReducer
  );
  const { subcategories, isSubcategoriesLoading, subcategoriesError } =
    useAppSelector((state) => state.getSubcategoriesReducer);
  const { brands, brandsError, isBrandsLoading } = useAppSelector(
    (state) => state.getBrandsReducer
  );
  const { isStylesLoading, styles, stylesError } = useAppSelector(
    (state) => state.getStylesReducer
  );
  const { colours, coloursError, isColoursLoading } = useAppSelector(
    (state) => state.getColoursReducer
  );

  const [formImages, setFormImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    category: ItemEntityWithId | null;
    condition: ItemEntity | null;
    style: ItemEntity | null;
    brand: MultiValue<ItemEntityWithId> | null;
    colour: ItemEntity | null;
    size: ItemEntity | null;
    price: number;
    gender: ItemEntity | null;
    description: string;
    hashtags: string[];
    name: string;
    subcategory: ItemEntityWithId | null;
  }>({
    category: null,
    condition: null,
    style: null,
    brand: null,
    colour: null,
    size: null,
    price: 0,
    gender: null,
    description: "",
    hashtags: [],
    name: "",
    subcategory: null,
  });

  const [errors, setErrors] = useState({
    category: "",
    subcategory: "",
    condition: "",
    style: "",
    brand: "",
    colour: "",
    size: "",
    price: "",
    gender: "",
    images: "",
    description: "",
    hashtags: "",
    name: "",
  });

  const handleImageSubmit = (e: ChangeEvent<HTMLInputElement>) => {
    if (formImages.length >= 5) {
      dispatch(setError("Max 5 images"));

      setTimeout(() => {
        dispatch(setError(""));
      }, 5000);

      return;
    }

    setErrors({ ...errors, images: "" });

    const image = e.target.files![0];

    if (image) {
      let body = new FormData();
      body.set("key", process.env.NEXT_PUBLIC_IMAGE_API_KEY!);
      body.append("image", image);

      dispatch(uploadImage(body))
        .unwrap()
        .then((result) => {
          // Add image url to the form images state
          const image = result.data.url;
          const find = formImages.find((url) => url === image);

          if (find) {
            setErrors({ ...errors, images: "Images can't be the same" });
          } else {
            setFormImages([image, ...formImages]);
          }
        })
        .catch((error) => {
          setErrors({ ...errors, images: error.message });
          console.error("rejected", error);
        });
    }
  };

  const deleteImage = (key: number) => {
    setFormImages(formImages.filter((_, index) => key !== index));
  };

  useEffect(() => {
    //Brands
    dispatch(getBrands(""))
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
    //Styles
    dispatch(getStyles())
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
    //Colours
    dispatch(getColours())
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });

    // Set default form data
    setFormImages(item.images);
    setFormData({
      brand: item.brand.map((brand) => ({ ...brand, label: brand.value })),
      category: { ...item.category, label: item.category.value },
      colour: { ...item.colour, label: item.colour.value },
      condition: {
        label: String(item.condition),
        value: String(item.condition),
      },
      description: item.description,
      gender: {
        value: item.gender,
        label: item.gender === Gender.MEN ? "Menswear" : "Womenswear",
      },
      hashtags: item.hashtags,
      name: item.name,
      price: item.price,
      size: { value: item.size, label: item.size },
      style: { ...item.style, label: item.style.value },
      subcategory: { ...item.subcategory, label: item.subcategory.value },
    });
  }, []);

  useEffect(() => {
    if (!formData.gender) {
      return;
    }

    // Categories
    dispatch(getCategories(formData.gender.value as Gender))
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
  }, [formData.gender]);

  useEffect(() => {
    if (!formData.category) {
      return;
    }

    // Categories
    dispatch(getSubcategories(formData.category?.id))
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
  }, [formData.category]);

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setErrors({ ...errors, price: "" });

    if (value) {
      setFormData({
        ...formData,
        price: Number(value),
      });
    }
  };

  const handleHashtagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    const hashtags = text
      .split(",")
      .map((hashtag) => hashtag.replace("#", "").trim())
      .filter((hashtag) => hashtag !== "");

    hashtags.map((hashtag) => {
      if (!/^[a-zA-Z]+$/.test(hashtag)) {
        setErrors({
          ...errors,
          hashtags: "Hashtag can have only letters",
        });
        return;
      }

      if (hashtag.split(" ").length !== 1) {
        setErrors({
          ...errors,
          hashtags: "Hashtag can have empty space",
        });

        return;
      }

      setErrors({
        ...errors,
        hashtags: "",
      });
    });

    setFormData({
      ...formData,
      hashtags,
    });
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setErrors({ ...errors, name: "" });

    if (value) {
      setFormData({
        ...formData,
        name: value,
      });
    }
  };

  const textareaHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      description: e.target.value.replace(/\r\n|\r|\n/g, "<br />"),
    });
    setErrors({ ...errors, description: "" });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errors.hashtags) {
      setErrors({
        ...errors,
        hashtags: "Please fix hashtags",
      });
      return;
    }

    // Reset errors
    setErrors({
      category: "",
      subcategory: "",
      condition: "",
      style: "",
      brand: "",
      colour: "",
      size: "",
      price: "",
      gender: "",
      images: "",
      description: "",
      hashtags: "",
      name: "",
    });

    if (formData.name.length > 50) {
      setErrors({
        ...errors,
        name: "Name is too big",
      });
      return;
    }
    if (formData.name.length < 5) {
      setErrors({
        ...errors,
        name: "Name is too small",
      });
      return;
    }

    if (!formData.gender) {
      setErrors({
        ...errors,
        gender: "Choose a gender",
      });
      return;
    }

    if (!formData.category) {
      setErrors({
        ...errors,
        category: "Choose a category",
      });
      return;
    }

    if (!formData.subcategory) {
      setErrors({
        ...errors,
        subcategory: "Choose a subcategory",
      });
      return;
    }

    if (!formData.style) {
      setErrors({
        ...errors,
        style: "Choose a style",
      });
      return;
    }

    if (!formData.condition) {
      setErrors({
        ...errors,
        condition: "Choose a condition",
      });
      return;
    }

    if (!formData.colour) {
      setErrors({
        ...errors,
        colour: "Choose a colour",
      });
      return;
    }

    if (!formData.brand) {
      setErrors({
        ...errors,
        brand: "Choose a brand",
      });
      return;
    }

    if (!formData.price) {
      setErrors({
        ...errors,
        price: "Choose a price",
      });
      return;
    }

    if (!formData.size) {
      setErrors({
        ...errors,
        size: "Choose a size",
      });
      return;
    }

    if (formData.hashtags.length > 5) {
      setErrors({
        ...errors,
        hashtags: "Too many hashtags",
      });
      return;
    }
    if (formData.hashtags.length > 200) {
      setErrors({
        ...errors,
        description: "Description is to big",
      });
      return;
    }

    if (!formImages.length) {
      setErrors({
        ...errors,
        images: "Please upload photos",
      });
      return;
    }
    if (formImages.length > 5) {
      setErrors({
        ...errors,
        images: "There is too many images",
      });
      return;
    }

    const patchedData = {
      categoryId: formData.category.id,
      subcategoryId: formData.subcategory.id,
      condition: Number(formData.condition.value),
      style: formData.style.value,
      brand: formData.brand.map((brand) => brand.id),
      images: formImages,
      colour: formData.colour.value,
      size: formData.size.value,
      price: formData.price,
      gender: formData.gender.value,
      name: formData.name,
      id: item.id,
      hashtags: formData.hashtags,
      description: formData.description,
    };

    dispatch(editItem(patchedData))
      .unwrap()
      .then(() => Router.push("/success"))
      .catch((err) => {
        console.log("rejected", err), Router.push("/404");
      });
  };

  const handleBrandChange = (e: MultiValue<ItemEntityWithId>) => {
    setFormData({
      ...formData,
      brand: e,
    });
  };

  const onInputBrandChange = (e: string) => {
    dispatch(getBrands(e))
      .unwrap()
      .catch((error: Error) => {
        console.error("rejected", error);
      });
  };

  const categoryChange = (e: SingleValue<ItemEntityWithId>) => {
    setFormData({
      ...formData,
      category: e,
      subcategory: null,
    });
  };

  const genderChange = (e: SingleValue<ItemEntity>) => {
    setFormData({
      ...formData,
      gender: e,
      category: null,
      subcategory: null,
    });
  };

  const subcategoryChange = (e: SingleValue<ItemEntityWithId>) => {
    setFormData({
      ...formData,
      subcategory: e,
    });
  };

  const colourChange = (e: SingleValue<ItemEntity>) => {
    setFormData({
      ...formData,
      colour: e,
    });
  };
  const styleChange = (e: SingleValue<ItemEntity>) => {
    setFormData({
      ...formData,
      style: e,
    });
  };
  const conditionChange = (e: SingleValue<ItemEntity>) => {
    setFormData({
      ...formData,
      condition: e,
    });
  };
  const sizeChange = (e: SingleValue<ItemEntity>) => {
    setFormData({
      ...formData,
      size: e,
    });
  };

  console.log(item);

  return (
    <EditItemStyles>
      <Header />
      <Categories />
      <div className="container">
        <div className="wrapper">
          <h1 className="title-md">Sell new item</h1>
          {editItemLoading ? (
            <Loading />
          ) : (
            <form className="inner" onSubmit={onSubmit}>
              {/* First row */}
              <div className="row">
                <label className="image-upload">
                  <input
                    type="file"
                    className="image-upload-input"
                    accept="image/*"
                    onChange={handleImageSubmit}
                    disabled={isLoading}
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
                {errors.images && <p className="error">{errors.images}</p>}
                {error && <p className="error">{error}</p>}
                {isLoading && (
                  <div className="item-image loading-background"></div>
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
                          backgroundImage: `url('${url}')`,
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
                    Item name
                    <input
                      onChange={handleNameChange}
                      type="text"
                      className="input"
                      placeholder="Item name"
                      required
                      minLength={5}
                      maxLength={50}
                      defaultValue={formData.name}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                  </label>
                  <label className="label">
                    Category
                    <Select
                      instanceId="select"
                      required={true}
                      className="select"
                      name="subcategory"
                      isLoading={isCategoriesLoading}
                      isDisabled={!formData.gender}
                      placeholder="Select a scategory"
                      options={categories}
                      isClearable={true}
                      isSearchable={true}
                      styles={colourStyles}
                      onChange={categoryChange}
                      value={formData.category}
                    />
                    {errors.category && (
                      <p className="error">{errors.category}</p>
                    )}
                  </label>

                  <label className="label">
                    Style
                    <Select
                      instanceId="select"
                      required={true}
                      className="select"
                      name="style"
                      isLoading={isStylesLoading}
                      placeholder="Select a style"
                      options={styles}
                      isClearable={true}
                      isSearchable={true}
                      styles={colourStyles}
                      onChange={styleChange}
                      value={formData.style}
                    />
                    {errors.style && <p className="error">{errors.style}</p>}
                  </label>
                  <label className="label">
                    Colour
                    <Select
                      instanceId="select"
                      required={true}
                      className="select"
                      name="colour"
                      isLoading={isColoursLoading}
                      placeholder="Select a colour"
                      options={colours}
                      isClearable={true}
                      styles={colourStyles}
                      onChange={colourChange}
                      value={formData.colour}
                      formatOptionLabel={(option) => (
                        <div>
                          {option.hexCode ? (
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: `#${option.hexCode}`,
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
                    {errors.price && <p className="error">{errors.colour}</p>}
                  </label>
                  <label className="label">
                    Price
                    <input
                      type="number"
                      className="input"
                      placeholder="Select a price"
                      onChange={handlePriceChange}
                      min={0}
                      max={100000}
                      defaultValue={item.price}
                    />
                    {errors.price && <p className="error">{errors.price}</p>}
                  </label>
                  <label className="label">
                    Hashtags
                    <input
                      type="text"
                      className="input"
                      placeholder="Hashtags"
                      onChange={handleHashtagsChange}
                      defaultValue={item.hashtags.join(",")}
                    />
                    {errors.hashtags && (
                      <p className="error">{errors.hashtags}</p>
                    )}
                  </label>
                </div>
                {/* Third row */}
                <div className="row">
                  <label className="label">
                    Sex
                    <Select
                      instanceId="select"
                      required={true}
                      className="select"
                      name="gender"
                      placeholder="Select a gender"
                      options={genders}
                      styles={colourStyles}
                      onChange={genderChange}
                      value={formData.gender}
                    />
                    {errors.gender && <p className="error">{errors.gender}</p>}
                  </label>
                  <label className="label">
                    Subcategory
                    <Select
                      instanceId="select"
                      required={true}
                      className="select"
                      name="subcategory"
                      isLoading={isSubcategoriesLoading}
                      isDisabled={!formData.category}
                      placeholder="Select a subcategory"
                      options={subcategories}
                      isClearable={true}
                      isSearchable={true}
                      styles={colourStyles}
                      onChange={subcategoryChange}
                      value={formData.subcategory}
                    />
                    {errors.subcategory && (
                      <p className="error">{errors.subcategory}</p>
                    )}
                  </label>
                  <label className="label">
                    Condition
                    <Select
                      instanceId="select"
                      required={true}
                      className="select"
                      name="condition"
                      placeholder="Select a condition"
                      options={conditions}
                      isClearable={true}
                      isSearchable={true}
                      styles={colourStyles}
                      onChange={conditionChange}
                      defaultValue={{
                        label: String(item.condition),
                        value: String(item.condition),
                      }}
                    />
                    {errors.condition && (
                      <p className="error">{errors.condition}</p>
                    )}
                  </label>
                  <label className="label">
                    Brand
                    <Select
                      instanceId="select"
                      required={true}
                      className="select"
                      name="brand"
                      isLoading={isBrandsLoading}
                      placeholder="Select a brand"
                      options={brands}
                      isMulti
                      isClearable={true}
                      isSearchable={true}
                      styles={colourStyles}
                      onChange={handleBrandChange}
                      onInputChange={onInputBrandChange}
                      value={formData.brand}
                      isOptionDisabled={() => {
                        if (formData.brand) return formData.brand.length >= 5;

                        return false;
                      }}
                    />
                    {errors.brand && <p className="error">{errors.brand}</p>}
                  </label>
                  <label className="label">
                    Size
                    <Select
                      instanceId="select"
                      required={true}
                      className="select"
                      name="size"
                      placeholder="Select a size"
                      options={sizes}
                      value={formData.size}
                      isClearable={true}
                      isSearchable={true}
                      styles={colourStyles}
                      onChange={sizeChange}
                    />
                    {errors.size && <p className="error">{errors.size}</p>}
                  </label>
                </div>
                <label className="label description--label">
                  Description
                  <textarea
                    id="description"
                    placeholder="Describe your item..."
                    minLength={10}
                    maxLength={200}
                    onChange={textareaHandler}
                    defaultValue={
                      item.description
                        ? item.description.replaceAll("<br />", "\n")
                        : ""
                    }
                  ></textarea>
                  {errors.description && (
                    <p className="error">{errors.description}</p>
                  )}
                </label>
                <button
                  className="button submit--buton"
                  disabled={editItemLoading}
                >
                  Save
                </button>
                {editItemError && <p className="error">{editItemError}</p>}
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </EditItemStyles>
  );
}

const EditItemStyles = styled.div`
  .inner-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 2rem;
  }

  .description--label {
    grid-column: 1/4;
  }

  .submit--buton {
    margin-top: 1rem;
    grid-column: 1;
  }

  #description {
    margin-top: 0.5rem;
    grid-column: 2/4;
    resize: none;
    outline: none;
    border-radius: 0;
    border: none;
    border: 1px solid var(--grey-10);
    font-family: var(--font-default);
    font-size: 1rem;
    padding: 1.2em 1em;
    height: 10em;
  }

  .title-md {
    margin-top: 2rem;
  }

  .image-upload {
    border: 2px dotted var(--grey-30);
    width: 100%;
    display: flex;
    padding: 6px 12px;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    aspect-ratio: 1 / 1;
    cursor: pointer;

    input {
      display: none;
    }
  }

  .item-image {
    width: 100%;
    aspect-ratio: 1 / 1;
    position: relative;
    margin-top: 2rem;
    background-repeat: no-repeat;
    background-size: cover;
    &:hover .item-image__inner {
      opacity: 1;
    }

    &__inner {
      opacity: 0;
      position: absolute;
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background-color: var(--grey-30);

      .delete--icon {
        cursor: pointer;
      }

      .drag--icon {
        cursor: grab;
      }

      .image-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4rem;
        width: 4rem;
        border-radius: 50%;
        background-color: white;

        img {
          pointer-events: none;
        }
      }
    }
  }

  .inner {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-column-gap: 2rem;
    align-items: flex-start;

    .select,
    .input {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }

  .error {
    font-size: 1rem;
    color: red;
    margin-top: 0.5rem;
  }

  .button {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
  }
`;
