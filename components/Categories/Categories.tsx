import { useAppDispatch } from "@store/hooks/redux";
import { getCategories } from "@store/reducers/item/GetCategoriesSlice";
import { wrapper } from "@store/reducers/store";
import { Gender } from "@store/types/gender.enum";
import { ItemEntityWithId } from "@store/types/item-entity";
import React, { FC, useEffect, useState } from "react";
import { CategoriesStyles } from "./Categories.styles";
import Router from "next/router";
import {
  resetFilter,
  setCategory,
  setGender,
} from "@store/reducers/filter/FilterSlice";
import instance from "@utils/axios";
import { getSubcategories } from "@store/reducers/item/GetSubcategoriesSlice";
import Link from "next/link";

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

  const genderHandler = (gender: Gender) => {
    dispatch(resetFilter());
    dispatch(setGender(gender));
    dispatch(getCategories(gender)).catch((err) => console.log(err));

    Router.push("/shop");
  };

  return (
    <CategoriesStyles>
      <div className="category">
        <h2 className="category-name" onClick={() => genderHandler(Gender.MEN)}>
          Menswear
        </h2>
        <div className="category-dropdown">
          <div
            className="category-dropdown__subcategory"
            onClick={() => genderHandler(Gender.MEN)}
          >
            See all
          </div>
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
        <h2
          className="category-name"
          onClick={() => genderHandler(Gender.WOMEN)}
        >
          Womenswear
        </h2>
        <div className="category-dropdown">
          <div
            className="category-dropdown__subcategory"
            onClick={() => genderHandler(Gender.WOMEN)}
          >
            See all
          </div>
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
        <Link href={"/brands"}>
          <h2 className="category-name">Brands</h2>
        </Link>
      </div>
      <div className="category">
        <h2 className="category-name">Jewellery</h2>
      </div>
    </CategoriesStyles>
  );
};

export default Categories;
