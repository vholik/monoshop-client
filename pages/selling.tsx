import Categories from "@components/Categories/Categories";
import Header from "@components/Header/Header";
import { useEffect } from "react";
import styled from "styled-components";
import ProfileItems from "@components/ProfileItems/ProfileItems";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import Link from "next/link";
import { getUserItems } from "@store/reducers/item/GetUserItemsSlice";
import Loading from "@components/Loading/Loading";
import Footer from "@components/Footer/Footer";
import { showErrorToast } from "@utils/ReactTostify/tostifyHandlers";
import Profile from "@components/Profile/Profile";
import Layout from "@components/Layout/Layout";

const MyProfile = () => {
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.getUserItemsReducer.items);
  const status = useAppSelector((state) => state.getUserItemsReducer.status);

  useEffect(() => {
    dispatch(getUserItems())
      .unwrap()
      .catch((error) => {
        showErrorToast("Error displaying user items");
      });
  }, []);

  return (
    <Profile isLoading={status === "loading"} isError={status === "error"}>
      <ProfileItems items={items} />
    </Profile>
  );
};

export default MyProfile;
