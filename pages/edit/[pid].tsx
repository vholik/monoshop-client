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
  const dispatch = useAppDispatch();
  const categoryRef = useRef<any>();
  const subcategoryRef = useRef<any>();

  const { isLoading, error } = useAppSelector(
    (state) => state.uploadImageReducer
  );

  const { categories, categoriesError, isCategoriesLoading } = useAppSelector(
    (state) => state.getCategoriesReducer
  );
  const { brands, brandsError, isBrandsLoading } = useAppSelector(
    (state) => state.getBrandsReducer
  );
  const { isStylesLoading, styles, stylesError } = useAppSelector(
    (state) => state.getStylesReducer
  );
  const { colours, coloursError, isColoursLoading } = useAppSelector(
    (state) => state.getColoursReducer
  );
  const { isSubcategoriesLoading, subcategories, subcategoriesError } =
    useAppSelector((state) => state.getSubcategoriesReducer);
  const { editItemError, editItemLoading } = useAppSelector(
    (state) => state.editItemReducer
  );

  const [formImages, setFormImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    id: number;
    categoryId: number;
    subcategoryId: number;
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
  }>({
    id: 0,
    categoryId: 0,
    subcategoryId: 0,
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
    form: "",
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
    setFormImages(item.images);

    const categoryId = item.category.id;

    if (categoryId) {
      setFormData({
        brand: item.brand.value,
        colour: item.colour.value,
        condition: item.condition,
        description: item.description,
        gender: item.gender,
        hashtags: item.hashtags,
        name: item.name,
        price: item.price,
        size: item.size,
        style: item.style.value,
        categoryId,
        id: item.id,
        subcategoryId: item.subcategory.id,
      });
    }

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
    // Categories
    dispatch(getCategories(item.gender))
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
    dispatch(getSubcategories(item.subcategory.id))
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

    //Clear categories on gender change
    if (name === "gender") {
      if (value) {
        setFormData({
          ...formData,
          gender: value,
        });
      }

      setFormData({ ...formData, categoryId: 0 });

      if (categoryRef.current) {
        categoryRef.current.clearValue();
      }

      setErrors({ ...errors, gender: "" });
      return;
    }

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

  const textAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      description: e.target.value.replaceAll(/\r\n|\r|\n/g, "<br />"),
    });

    setErrors({
      ...errors,
      description: "",
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

  const onSubmit = () => {
    // Don't envoke function
    if (editItemLoading) {
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
        description: "Min length of name is 5",
      });
      return;
    }
    if (formData.name.length > 50) {
      setErrors({
        ...errors,
        description: "Max length of name is 50",
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

    const isEqualResults =
      formData.brand === item.brand.value &&
      formData.categoryId === item.category.id &&
      formData.colour === item.colour.value &&
      formData.condition === item.condition &&
      formData.description === item.description &&
      formData.gender === item.gender &&
      formData.hashtags === item.hashtags &&
      formData.name === item.name &&
      formData.price === item.price &&
      formData.size === item.size &&
      formData.style === item.style.value &&
      formData.subcategoryId === item.subcategory.id &&
      formImages === item.images;

    if (isEqualResults) {
      setErrors({
        ...errors,
        form: "Please make some changes",
      });

      return;
    }

    const patchedData = {
      ...formData,
      images: formImages,
      condition: Number(formData.condition),
    };

    dispatch(editItem(patchedData))
      .unwrap()
      .then((res) => console.log(res))
      .catch((err) => console.log("rejected", err));
  };

  const genderDefaultValue = {
    value: item.gender as string,
    label: item.gender === Gender.MEN ? "Menswear" : "Womenswear",
  };

  const categoryDefaultValue: ItemEntity = {
    value: item.category.value,
    label: item.category.value,
  };
  const conditionDefaultValue: ItemEntity = {
    value: String(item.condition),
    label: String(item.condition),
  };
  const styleDefaultValue: ItemEntity = {
    value: item.style.value,
    label: item.style.value,
  };
  const brandDefaultValue: ItemEntity = {
    value: item.brand.value,
    label: item.brand.value,
  };
  const colourDefaultValue: ItemEntity = {
    value: item.colour.value,
    label: item.colour.value,
    hexCode: item.colour.hexCode,
  };
  const sizeDefaultValue: ItemEntity = {
    value: item.size,
    label: item.size,
  };
  const subcategoryDefaultValue: ItemEntity = {
    value: item.subcategory.value,
    label: item.subcategory.value,
  };

  const hashtags = item.hashtags.join(",").replaceAll("#", ",");

  return (
    <EditItemStyles>
      <Header />
      <Categories />
      {editItemLoading && <Loading />}
      <div className="container">
        <div className="wrapper">
          <h1 className="title-md">Edit item</h1>
          <form className="inner">
            {/* First row */}
            <div className="row">
              <label className="image-upload">
                <input
                  required
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
                    defaultValue={item.name || ""}
                  />
                  {errors.name && <p className="error">{errors.name}</p>}
                </label>

                <label className="label">
                  Category
                  <Select
                    required
                    className="select"
                    name="category"
                    placeholder="Select a category"
                    options={categories}
                    isLoading={isCategoriesLoading}
                    isClearable={true}
                    isSearchable={true}
                    instanceId="select"
                    styles={colourStyles}
                    ref={categoryRef}
                    onChange={(e) => handleSelectChange(e, "category")}
                    defaultValue={categoryDefaultValue || ""}
                  />
                  {errors.category && (
                    <p className="error">{errors.category}</p>
                  )}
                </label>

                <label className="label">
                  Style
                  <Select
                    required={true}
                    className="select"
                    name="style"
                    placeholder="Select a style"
                    options={styles}
                    isLoading={isStylesLoading}
                    isClearable={true}
                    instanceId="select"
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={(e) => handleSelectChange(e, "style")}
                    defaultValue={styleDefaultValue}
                  />
                  {errors.style && <p className="error">{errors.style}</p>}
                </label>

                <label className="label">
                  Colour
                  <Select
                    required={true}
                    className="select"
                    name="colour"
                    placeholder="Select a colour"
                    options={colours}
                    isLoading={isColoursLoading}
                    isClearable={true}
                    instanceId="select"
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={(e) => handleSelectChange(e, "colour")}
                    defaultValue={colourDefaultValue}
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
                  {errors.colour && <p className="error">{errors.colour}</p>}
                </label>

                <label className="label">
                  Price
                  <input
                    required
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
              </div>
              {/* Third row */}
              <div className="row">
                <label className="label">
                  Sex
                  <Select
                    required={true}
                    className="select"
                    name="gender"
                    placeholder="Select a gender"
                    instanceId="select"
                    options={genders}
                    isClearable={true}
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={(e) => handleSelectChange(e, "gender")}
                    defaultValue={genderDefaultValue}
                  />
                  {errors.gender && <p className="error">{errors.gender}</p>}
                </label>
                <label className="label">
                  Subcategory
                  <Select
                    required={true}
                    className="select"
                    name="style"
                    ref={subcategoryRef}
                    placeholder="Select a subcategory"
                    options={subcategories}
                    isLoading={isSubcategoriesLoading}
                    isClearable={true}
                    instanceId="select"
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={(e) => handleSelectChange(e, "subcategory")}
                    defaultValue={subcategoryDefaultValue}
                  />
                  {errors.gender && <p className="error">{errors.gender}</p>}
                </label>

                <label className="label">
                  Condition
                  <Select
                    required={true}
                    className="select"
                    name="condition"
                    placeholder="Select a condition"
                    options={conditions}
                    isClearable={true}
                    instanceId="select"
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={(e) => handleSelectChange(e, "condition")}
                    defaultValue={conditionDefaultValue}
                  />
                  {errors.condition && (
                    <p className="error">{errors.condition}</p>
                  )}
                </label>

                <label className="label">
                  Brand
                  <Select
                    required={true}
                    className="select"
                    name="brand"
                    placeholder="Select a brand"
                    options={brands}
                    isClearable={true}
                    instanceId="select"
                    isLoading={isBrandsLoading}
                    isSearchable={true}
                    styles={colourStyles}
                    onChange={(e) => handleSelectChange(e, "gender")}
                    defaultValue={brandDefaultValue}
                  />
                  {errors.brand && <p className="error">{errors.brand}</p>}
                </label>

                <label className="label">
                  Size
                  <Select
                    required={true}
                    className="select"
                    name="size"
                    placeholder="Select a size"
                    options={sizes}
                    isClearable={true}
                    isSearchable={true}
                    instanceId="select"
                    styles={colourStyles}
                    onChange={(e) => handleSelectChange(e, "size")}
                    defaultValue={sizeDefaultValue}
                  />
                  {errors.size && <p className="error">{errors.size}</p>}
                </label>

                <label className="label">
                  Hashtags
                  <input
                    type="text"
                    className="input"
                    placeholder="Hashtags"
                    onChange={handleHashtagsChange}
                    defaultValue={hashtags}
                  />
                  {errors.hashtags && (
                    <p className="error">{errors.hashtags}</p>
                  )}
                </label>
              </div>
              <label className="label description--label">
                Description
                <textarea
                  id="description"
                  placeholder="Describe your item..."
                  minLength={10}
                  maxLength={200}
                  defaultValue={item.description.replaceAll("<br />", "\n")}
                  onChange={textAreaChange}
                ></textarea>
                {errors.description && (
                  <p className="error">{errors.description}</p>
                )}
                {errors.form && <p className="error">{errors.form}</p>}
              </label>

              <button
                className="button submit--buton"
                disabled={editItemLoading}
                onClick={onSubmit}
              >
                Save
              </button>
            </div>
          </form>
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
