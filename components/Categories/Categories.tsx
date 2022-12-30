import { useAppDispatch } from "@store/hooks/redux";
import { getCategories } from "@store/reducers/item/GetCategoriesSlice";
import { wrapper } from "@store/reducers/store";
import { Gender } from "@store/types/gender.enum";
import { ItemEntityWithId } from "@store/types/item-entity";
import React, { FC, useEffect, useState } from "react";
import { CategoriesStyles } from "./Categories.styles";
import Router from "next/router";
import {
  changePage,
  resetFilter,
  setBrand,
  setCategory,
  setGender,
  setPrice,
  setSize,
  setSubcategory,
} from "@store/reducers/filter/FilterSlice";
import instance from "@utils/axios";
import { ReduxError } from "@store/types/error";
import { getSubcategories } from "@store/reducers/item/GetSubcategoriesSlice";

const Categories: FC = () => {
  const dispatch = useAppDispatch();
  const [menCategories, setMenCategories] = useState<ItemEntityWithId[]>([]);
  const [womenCategories, setWomenCategories] = useState<ItemEntityWithId[]>(
    []
  );

  const fetchCategories = async (
    gender: Gender
  ): Promise<ItemEntityWithId[]> => {
    try {
      const res = await instance.get<ItemEntityWithId[]>("category", {
        params: {
          gender: gender,
        },
      });

      return res.data;
    } catch (error: any) {
      return error;
    }
  };

  useEffect(() => {
    fetchCategories(Gender.MEN)
      .then((res) => setMenCategories(res))
      .catch((err) => console.log(err));

    fetchCategories(Gender.WOMEN)
      .then((res) => setWomenCategories(res))
      .catch((err) => console.log(err));
  }, []);

  const categoryHandler = (id: number, gender: Gender) => {
    dispatch(resetFilter());
    dispatch(setGender(gender));
    dispatch(setCategory(id));

    dispatch(getCategories(gender)).catch((err) => console.log(err));
    dispatch(getSubcategories(id)).catch((err) => console.log(err));

    Router.push("/shop");
  };

  return (
    <CategoriesStyles>
      <div className="category">
        <h2 className="category-name">Men</h2>
        <div className="category-dropdown">
          {menCategories.map((category) => (
            <div
              className="category-dropdown__subcategory"
              key={category.id}
              onClick={() => categoryHandler(category.id, Gender.MEN)}
            >
              {category.value}
            </div>
          ))}
        </div>
      </div>
      <div className="category">
        <h2 className="category-name">Women</h2>
        <div className="category-dropdown">
          {womenCategories.map((category) => (
            <div
              className="category-dropdown__subcategory"
              key={category.id}
              onClick={() => categoryHandler(category.id, Gender.WOMEN)}
            >
              {category.value}
            </div>
          ))}
        </div>
      </div>
      <div className="category">
        <h2 className="category-name">Brands</h2>
      </div>
      <div className="category">
        <h2 className="category-name">Jewellery</h2>
      </div>
    </CategoriesStyles>
  );
};

export default Categories;
