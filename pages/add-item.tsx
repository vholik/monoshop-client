import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import styled from "styled-components";
import { ChangeEvent, useState } from "react";
import Select from "react-select";
import Footer from "@components/Footer/Footer";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { setError, uploadImage } from "@store/reducers/item/UploadImageSlice";
import Image from "next/image";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const colourStyles = {
  menuList: (styles: any) => ({
    ...styles,
    background: "transparent",
    borderRadius: 0,
  }),
  option: (styles: any, { isFocused, isSelected }: any) => ({
    ...styles,
    background: isFocused ? "#f6f6f6" : isSelected ? "#f4f4f4" : undefined,
    color: "var(--dark) !important",
    zIndex: 1,
    borderRadius: 0,
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 100,
    borderRadius: 0,
    border: "1px solid var(--grey-10)",
    boxShadow: "none",
  }),
  control: (provided: any, { isFocused, isSelected }: any) => ({
    ...provided,
    boxShadow: "none",
    color: "var(--dark)",
    border: "1px solid var(--grey-10) !important",
    borderRadius: 0,
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: "1.2em 1em",
    fontSize: "1rem",
  }),
};

export default function AddItem() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(
    (state) => state.uploadImageReducer
  );

  const [formImages, setFormImages] = useState<string[]>([]);

  const handleImageSubmit = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files![0];

    if (image) {
      let body = new FormData();
      body.set("key", process.env.NEXT_PUBLIC_IMAGE_API_KEY!);
      body.append("image", image);

      dispatch(uploadImage(body))
        .unwrap()
        .then((result) => {
          if (formImages.length >= 5) {
            dispatch(setError("Max 5 images"));
            throw new Error("Max 5 images");
          }
          // Add image url to the form images state
          const image = result.data.url;
          setFormImages([image, ...formImages]);
        })
        .catch((error) => {
          console.error("rejected", error);
        });
    }
  };

  return (
    <AddItemStyles>
      <Header />
      <Categories />
      <div className="container">
        <div className="wrapper">
          <h1 className="title-md">Add new item</h1>
          <div className="inner">
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
                Upload an image
              </label>
              {error && <p className="error">{error}</p>}
              {isLoading && (
                <div className="item-image loading-background"></div>
              )}
              {formImages.map((image, key) => (
                <div className="item-image" key={key}>
                  <Image
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                    }}
                    alt="Photo"
                    src={image}
                    fill
                  />
                </div>
              ))}
            </div>
            {/* Second row */}
            <div className="row">
              <label className="label">
                Category
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
              <label className="label">
                Style
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
              <label className="label">
                Colour
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
              <label className="label">
                Price
                <input
                  type="number"
                  className="input"
                  placeholder="Select a price"
                />
              </label>
              <button className="button">Save</button>
            </div>
            {/* Third row */}
            <div className="row">
              <label className="label">
                Condition
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
              <label className="label">
                Brand
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
              <label className="label">
                Size
                <Select
                  placeholder="Select a category"
                  styles={colourStyles}
                  options={options}
                  className="select"
                  isDisabled={false}
                  isLoading={false}
                  isSearchable={true}
                  name="category"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </AddItemStyles>
  );
}

const AddItemStyles = styled.div`
  .wrapper {
    border-top: 1px solid var(--grey-10);
  }

  .label {
    margin-bottom: 1rem;
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
    align-items: center;
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
  }

  .inner {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 2rem;

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
