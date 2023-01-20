import Categories from "@components/Categories/Categories";
import Footer from "@components/Footer/Footer";
import Header from "@components/Header/Header";
import Loading from "@components/Loading/Loading";
import ProfileSidebar from "@components/ProfileSidebar/ProfileSidebar";
import { FlexPage } from "@utils/FlexStyle";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "pages/404";
import React, { ReactNode } from "react";
import { ProfileStyles } from "./Profile.styles";

interface ProfileProps {
  children: ReactNode;
  isLoading: boolean;
  isError: boolean;
}

function Profile({ children, isLoading, isError }: ProfileProps) {
  const { asPath } = useRouter();

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <FlexPage>
      <Header />
      <Categories />
      <ProfileStyles>
        <ProfileSidebar path={asPath} />
        {isLoading ? (
          <div className="loading-wrapper">
            <Loading />
          </div>
        ) : (
          <>{children}</>
        )}
      </ProfileStyles>
      <Footer />
    </FlexPage>
  );
}

export default Profile;
