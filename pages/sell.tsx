import Categories from "@components/Categories/Categories";
import Header from "@components/Header/Header";
import styled from "styled-components";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import StateManagedSelect, { MultiValue, SingleValue } from "react-select";
import Footer from "@components/Footer/Footer";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { uploadImage } from "@store/reducers/image/UploadImageSlice";
import Image from "next/image";
import { getCategories } from "@store/reducers/category/GetCategoriesSlice";
import { ItemEntity, ItemEntityWithId } from "@store/types/item-entity";
import { getBrands } from "@store/reducers/brand/GetBrandsSlice";
import { getStyles } from "@store/reducers/style/GetStylesSlice";
import { getColours } from "@store/reducers/colour/GetColoursSlice";
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
import { getSubcategories } from "@store/reducers/subcategory/GetSubcategoriesSlice";
import { Reorder } from "framer-motion";
import Trash from "@public/images/trash.svg";
import Upload from "@public/images/upload.svg";
import Drag from "@public/images/drag.svg";
import Router from "next/router";
import { showErrorToast } from "@utils/ReactTostify/tostifyHandlers";

export default function AddItem() {
  const dispatch = useAppDispatch();

  const imageStatus = useAppSelector(
    (state) => state.uploadImageReducer.status
  );
  const categories = useAppSelector(
    (state) => state.getCategoriesReducer.categories
  );
  const categoriesStatus = useAppSelector(
    (state) => state.getCategoriesReducer.status
  );

  const subcategories = useAppSelector(
    (state) => state.getSubcategoriesReducer.subcategories
  );
  const subcategoriesStatus = useAppSelector(
    (state) => state.getSubcategoriesReducer.status
  );

  const brandsStatus = useAppSelector((state) => state.getBrandsReducer);
  const brands = useAppSelector((state) => state.getBrandsReducer.brands);

  const styles = useAppSelector((state) => state.getStylesReducer.styles);
  const stylesStatus = useAppSelector((state) => state.getStylesReducer.status);

  const colours = useAppSelector((state) => state.getColoursReducer.colours);
  const coloursStatus = useAppSelector(
    (state) => state.getColoursReducer.status
  );

  const itemStatus = useAppSelector((state) => state.addItemReducer.status);

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
      showErrorToast("Max 5 images");

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
        showErrorToast("Error getting a subcategories");
      });
  }, [formData.category]);

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

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
      if (hashtag.split(" ").length !== 1) {
        showErrorToast("Hashtags can not have white space");
        return;
      }
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
      showErrorToast("Please fix hashtags");
      return;
    }

    if (formData.name.length > 50) {
      showErrorToast("Item header are too big");
      return;
    }

    if (formData.name.length < 5) {
      showErrorToast("Item header are too small");
      return;
    }

    if (!formData.gender) {
      showErrorToast("Choose a gender");
      return;
    }

    if (!formData.category) {
      showErrorToast("Please choose category");
      return;
    }

    if (!formData.subcategory) {
      showErrorToast("Please choose subcategory");
      return;
    }

    if (!formData.style) {
      showErrorToast("Please choose style");
      return;
    }

    if (!formData.condition) {
      showErrorToast("Pick condition of your item");
      return;
    }

    if (!formData.colour) {
      showErrorToast("Choose a colour");
      return;
    }

    if (!formData.brand) {
      showErrorToast("Choose a brand");
      return;
    }

    if (!formData.price) {
      showErrorToast("Enter the price");
      return;
    }

    if (!formData.size) {
      showErrorToast("Please choose size");
      return;
    }

    if (formData.hashtags.length > 5) {
      showErrorToast("Can not be more than 5 hashtags");
      return;
    }
    if (formData.hashtags.length > 200) {
      showErrorToast("Description are too big");
      return;
    }

    if (!formImages.length) {
      showErrorToast("Please upload at least 1 photo");
      return;
    }
    if (formImages.length > 5) {
      showErrorToast("Too much images");
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
      hashtags: formData.hashtags,
      description: formData.description,
    };

    dispatch(addItem(patchedData))
      .unwrap()
      .then(() => {
        Router.push({
          pathname: "/success",
          query: {
            message: "Successfully added your item to selling",
          },
        });
      })
      .catch((err) => {
        showErrorToast("Error");
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
        showErrorToast("Error loading brands");
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

  return (
    <AddItemStyles>
      <Header />
      <Categories />

      <div className="container">
        <div className="wrapper">
          <h1 className="title-md">Sell new item</h1>

          <form className="inner" onSubmit={onSubmit}>
            {/* First row */}
            <div className="row">
              <label className="image-upload">
                <input
                  type="file"
                  className="image-upload-input"
                  accept="image/*"
                  onChange={handleImageSubmit}
                  disabled={imageStatus === "loading"}
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

              {imageStatus === "loading" && (
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
                  <input
                    onChange={handleNameChange}
                    type="text"
                    className="input"
                    placeholder="Header name"
                    required
                    minLength={5}
                    maxLength={50}
                  />
                </label>
                <label className="label">
                  <Select
                    instanceId="select"
                    required={true}
                    className="select"
                    name="subcategory"
                    isLoading={categoriesStatus === "loading"}
                    isDisabled={!formData.gender}
                    placeholder="Select a scategory"
                    options={categories}
                    isClearable={true}
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={categoryChange}
                    value={formData.category}
                  />
                </label>

                <label className="label">
                  <Select
                    instanceId="select"
                    required={true}
                    className="select"
                    name="style"
                    isLoading={stylesStatus === "loading"}
                    placeholder="Select a style"
                    options={styles}
                    isClearable={true}
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={styleChange}
                  />
                </label>
                <label className="label">
                  <Select
                    instanceId="select"
                    required={true}
                    className="select"
                    name="colour"
                    isLoading={coloursStatus === "loading"}
                    placeholder="Select a colour"
                    options={colours}
                    isClearable={true}
                    styles={colourStyles}
                    onChange={colourChange}
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
                </label>
                <label className="label">
                  <input
                    type="number"
                    className="input"
                    placeholder="Select a price"
                    onChange={handlePriceChange}
                    step="0.01"
                    min={0}
                    max={100000}
                  />
                </label>
                <label className="label">
                  <input
                    type="text"
                    className="input"
                    placeholder="Hashtags"
                    onChange={handleHashtagsChange}
                  />
                </label>
              </div>
              {/* Third row */}
              <div className="row">
                <label className="label">
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
                </label>
                <label className="label">
                  <Select
                    instanceId="select"
                    required={true}
                    className="select"
                    name="subcategory"
                    isLoading={subcategoriesStatus === "loading"}
                    isDisabled={!formData.category}
                    placeholder="Select a subcategory"
                    options={subcategories}
                    isClearable={true}
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={subcategoryChange}
                    value={formData.subcategory}
                  />
                </label>
                <label className="label">
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
                  />
                </label>
                <label className="label">
                  <Select
                    instanceId="select"
                    required={true}
                    className="select"
                    name="brand"
                    placeholder="Select a brand"
                    options={brands}
                    isMulti
                    isClearable={true}
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={handleBrandChange}
                    onInputChange={onInputBrandChange}
                    isOptionDisabled={() => {
                      if (formData.brand) return formData.brand.length >= 5;

                      return false;
                    }}
                  />
                </label>
                <label className="label">
                  <Select
                    instanceId="select"
                    required={true}
                    className="select"
                    name="size"
                    placeholder="Select a size"
                    options={sizes}
                    isClearable={true}
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={sizeChange}
                  />
                </label>
              </div>
              <label className="label description--label">
                <textarea
                  id="description"
                  placeholder="Describe your item..."
                  minLength={10}
                  maxLength={200}
                  onChange={textareaHandler}
                ></textarea>
              </label>
              <button
                className="button submit--buton"
                disabled={itemStatus === "loading"}
              >
                Save
              </button>
            </div>
          </form>
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
