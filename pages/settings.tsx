import Categories from "@components/Categories/Categories";
import Header from "@components/Header/Header";
import { useEffect } from "react";
import styled from "styled-components";
import ProfileSettings from "@components/ProfileSettings/ProfileSettings";
import { getProfile } from "@store/reducers/user/ProfileSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import Loading from "@components/Loading/Loading";
import Link from "next/link";
import Footer from "@components/Footer/Footer";
import Profile from "@components/Profile/Profile";
import ProfileItems from "@components/ProfileItems/ProfileItems";
import { showErrorToast } from "@utils/ReactTostify/tostifyHandlers";
import Layout from "@components/Layout/Layout";

const MyProfile = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector((state) => state.profileReducer.status);
  const user = useAppSelector((state) => state.profileReducer.user);

  useEffect(() => {
    dispatch(getProfile())
      .unwrap()
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Profile isLoading={status === "loading"} isError={status === "error"}>
      <ProfileSettings user={user} />
    </Profile>
  );
};

export default MyProfile;
