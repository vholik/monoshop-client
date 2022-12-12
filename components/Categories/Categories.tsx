import React, { FC } from "react";
import { CategoriesStyles } from "./Categories.styles";

interface CategoriesProps {}

const Categories: FC<CategoriesProps> = () => (
  <div className="container">
    <CategoriesStyles>
      <div className="category">
        <h2 className="category-name">Men</h2>
        {/* Dropdown items */}
        <div className="category-dropdown">
          <div className="category-dropdown__subcategory">Tops</div>
          <div className="category-dropdown__subcategory">Bottoms</div>
          <div className="category-dropdown__subcategory">Shoes</div>
          <div className="category-dropdown__subcategory">Jewellery</div>
        </div>
      </div>
      <div className="category">
        <h2 className="category-name">Women</h2>
      </div>
      <div className="category">
        <h2 className="category-name">Brands</h2>
      </div>
      <div className="category">
        <h2 className="category-name">Jewellery</h2>
      </div>
    </CategoriesStyles>
  </div>
);

export default Categories;
