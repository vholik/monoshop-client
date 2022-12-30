import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import styled from "styled-components";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { SingleValue } from "react-select";
import Footer from "@components/Footer/Footer";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { setError, uploadImage } from "@store/reducers/item/UploadImageSlice";
import Image from "next/image";
import CustomSelect from "@components/CustomSelect/CustomSelect";
import { getCategories } from "@store/reducers/item/GetCategoriesSlice";
import { ItemEntity } from "@store/types/item-entity";
import { getBrands } from "@store/reducers/item/GetBrandsSlice";
import { getStyles } from "@store/reducers/item/GetStylesSlice";
import { getColours } from "@store/reducers/item/GetColoursSlice";
import { Gender } from "@store/types/gender.enum";
import { addItem } from "@store/reducers/item/AddItemSlice";
import Loading from "@components/Loading/Loading";
import {
  colourStyles,
  conditions,
  genders,
  sizes,
} from "@utils/react-select-utils";
import Select from "react-select";
import { getSubcategories } from "@store/reducers/item/GetSubcategoriesSlice";
import { Reorder } from "framer-motion";
import Trash from "@public/images/trash.svg";
import Upload from "@public/images/upload.svg";
import Drag from "@public/images/drag.svg";
import Router from "next/router";

export default function AddItem() {
  const dispatch = useAppDispatch();

  const subcategoryRef = useRef<any>();

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
  const { addItemError, addItemLoading, item } = useAppSelector(
    (state) => state.addItemReducer
  );

  const [formImages, setFormImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    categoryId: number;
    condition: number;
    style: string;
    brand: string;
    colour: string;
    size: string;
    price: number;
    gender: string;
    description: string;
    hashtags: string[];
    name: string;
    subcategoryId: number;
  }>({
    categoryId: 0,
    condition: 0,
    style: "",
    brand: "",
    colour: "",
    size: "",
    price: 0,
    gender: "",
    description: "",
    hashtags: [],
    name: "",
    subcategoryId: 0,
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
          console.error("rejected", error);
        });
    }
  };

  const deleteImage = (key: number) => {
    setFormImages(formImages.filter((_, index) => key !== index));
  };

  useEffect(() => {
    //Brands
    dispatch(getBrands())
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
  }, []);

  useEffect(() => {
    if (!formData.gender) {
      return;
    }

    setFormData({ ...formData, categoryId: 0, subcategoryId: 0 });

    // Categories
    dispatch(getCategories(formData.gender as Gender))
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
  }, [formData.gender]);

  useEffect(() => {
    if (!formData.categoryId) {
      return;
    }

    // Categories
    dispatch(getSubcategories(formData.categoryId))
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
  }, [formData.categoryId]);

  const handleSelectChange = (e: SingleValue<ItemEntity>, name: string) => {
    const value = e?.value;

    // Get the category id only
    if (name === "category") {
      if (e?.id) {
        setFormData({
          ...formData,
          categoryId: e?.id,
        });
      }

      if (subcategoryRef.current) {
        subcategoryRef.current.clearValue();
      }

      setErrors({ ...errors, category: "" });
      return;
    }

    if (name === "subcategory") {
      if (e?.id) {
        setFormData({
          ...formData,
          subcategoryId: e?.id,
        });
      }
      setErrors({ ...errors, subcategory: "" });
      return;
    }

    if (value) {
      setFormData({
        ...formData,
        [name]: value,
      });

      setErrors({ ...errors, [name]: "" });
    }
  };

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

    // Don't envoke function
    if (addItemLoading) {
      return;
    }

    // Validations
    if (formData.name.length > 50) {
      setErrors({
        ...errors,
        description: "Max length of name is 50",
      });
      return;
    }

    if (!formData.gender) {
      setErrors({ ...errors, gender: "Gender input is required" });
      return;
    }

    if (!formData.categoryId) {
      setErrors({ ...errors, category: "Select a category" });
      return;
    }
    if (!formData.subcategoryId) {
      setErrors({ ...errors, category: "Select a subcategory" });
      return;
    }
    if (!formData.style) {
      setErrors({ ...errors, style: "Select a style" });
      return;
    }
    if (!formData.condition) {
      setErrors({ ...errors, condition: "Choose a condition" });
      return;
    }
    if (!formData.colour) {
      setErrors({ ...errors, colour: "Choose a colour" });
      return;
    }
    if (!formData.brand) {
      setErrors({ ...errors, brand: "Choose a brand" });
      return;
    }
    if (!formData.price) {
      setErrors({ ...errors, price: "Type a price" });
      return;
    }
    if (formData.price < 0 || formData.price > 100000) {
      setErrors({ ...errors, price: "Min value is 0, max 100000" });
      return;
    }
    if (!formData.size) {
      setErrors({ ...errors, size: "Choose a size" });
      return;
    }

    if (formImages.length === 0) {
      setErrors({ ...errors, images: "Please upload photo" });
      return;
    }
    if (formImages.length < 1 || formImages.length > 5) {
      setErrors({ ...errors, images: "Min one picture and maximum is 5" });
      return;
    }
    if (
      formData.description &&
      (formData.description.length < 10 || formData.description.length > 200)
    ) {
      setErrors({
        ...errors,
        description: "Description min 10 symbols max 200",
      });
      return;
    }

    if (formData.name.length < 5) {
      setErrors({
        ...errors,
        name: "Min length of name is 5",
      });
      return;
    }
    if (formData.name.length > 50) {
      setErrors({
        ...errors,
        name: "Max length of name is 50",
      });
      return;
    }

    if (errors.hashtags) {
      return;
    }

    if (!formData.hashtags.length && formData.hashtags.length >= 10) {
      setErrors({
        ...errors,
        hashtags: "Max 10 hashtags",
      });
      return;
    }

    const patchedData = {
      ...formData,
      images: formImages,
      condition: Number(formData.condition),
      categoryId: formData.categoryId,
    };

    dispatch(addItem(patchedData))
      .unwrap()
      .then(() => Router.push("/success"))
      .catch((err) => {
        console.log("rejected", err), Router.push("/404");
      });
  };

  return (
    <AddItemStyles>
      <Header />
      <Categories />

      <div className="container">
        <div className="wrapper">
          <h1 className="title-md">Add new item</h1>
          {addItemLoading ? (
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
                      min={5}
                      max={50}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                  </label>
                  <label className="label">
                    Category
                    <CustomSelect
                      name="category"
                      placeholder="Select a category"
                      options={categories}
                      isLoading={isCategoriesLoading}
                      disabled={!formData.gender}
                      error={categoriesError || errors.category}
                      handleSelectChange={handleSelectChange}
                    />
                    {errors.category && (
                      <p className="error">{errors.category}</p>
                    )}
                  </label>

                  <label className="label">
                    Style
                    <CustomSelect
                      name="style"
                      placeholder="Select a style"
                      options={styles}
                      isLoading={isStylesLoading}
                      error={stylesError || errors.style}
                      handleSelectChange={handleSelectChange}
                    />
                    {errors.style && <p className="error">{errors.style}</p>}
                  </label>
                  <label className="label">
                    Colour
                    <CustomSelect
                      name="colour"
                      placeholder="Select a colour"
                      options={colours}
                      isLoading={isColoursLoading}
                      error={coloursError || errors.colour}
                      handleSelectChange={handleSelectChange}
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
                    <CustomSelect
                      name="gender"
                      placeholder="Select a sex"
                      options={genders}
                      isLoading={false}
                      error={errors.gender}
                      handleSelectChange={handleSelectChange}
                    />
                    {errors.gender && <p className="error">{errors.gender}</p>}
                  </label>
                  <label className="label">
                    Subcategory
                    <Select
                      ref={subcategoryRef}
                      required={true}
                      className="select"
                      name="subcategory"
                      isLoading={isSubcategoriesLoading}
                      isDisabled={!formData.categoryId}
                      placeholder="Select a subcategory"
                      options={subcategories}
                      isClearable={true}
                      isSearchable={true}
                      styles={colourStyles}
                      onChange={(e) => handleSelectChange(e, "subcategory")}
                    />
                    {errors.subcategory && (
                      <p className="error">{errors.subcategory}</p>
                    )}
                  </label>
                  <label className="label">
                    Condition
                    <CustomSelect
                      name="condition"
                      placeholder="Select a condition"
                      options={conditions}
                      isLoading={false}
                      error={errors.condition}
                      handleSelectChange={handleSelectChange}
                    />
                    {errors.condition && (
                      <p className="error">{errors.condition}</p>
                    )}
                  </label>
                  <label className="label">
                    Brand
                    <CustomSelect
                      name="brand"
                      placeholder="Select a brand"
                      options={brands}
                      isLoading={isBrandsLoading}
                      error={brandsError || errors.brand}
                      handleSelectChange={handleSelectChange}
                    />
                    {errors.brand && <p className="error">{errors.brand}</p>}
                  </label>
                  <label className="label">
                    Size
                    <CustomSelect
                      name="size"
                      placeholder="Select a size"
                      options={sizes}
                      isLoading={false}
                      error={errors.size}
                      handleSelectChange={handleSelectChange}
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
                  ></textarea>
                  {errors.description && (
                    <p className="error">{errors.description}</p>
                  )}
                </label>
                <button
                  className="button submit--buton"
                  disabled={addItemLoading}
                >
                  Save
                </button>
                {addItemError && <p className="error">{addItemError}</p>}
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </AddItemStyles>
  );
}

const AddItemStyles = styled.div`
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
