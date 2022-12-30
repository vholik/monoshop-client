import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import { useEffect } from "react";
import styled from "styled-components";
import ProfileSettings from "@components/ProfileSettings";
import { getProfile } from "@store/reducers/user/ProfileSlice";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import Loading from "@components/Loading/Loading";
import Link from "next/link";

const MyProfile = () => {
  const dispatch = useAppDispatch();

  const { error, isLoading, user } = useAppSelector(
    (state) => state.profileReducer
  );

  useEffect(() => {
    dispatch(getProfile())
      .unwrap()
      .catch((error) => {
        console.error("rejected", error);
      });
  }, []);

  return (
    <MyProfileStyles>
      <Header />
      <Categories />
      <div className="container">
        <h2 className="profile-title">My profile</h2>
        <div className="settings-list">
          <Link href={"/settings"}>
            <p className="settings-list__item  active">Profile settings</p>
          </Link>
          <Link href={"/my-items"}>
            <p className="settings-list__item">My items</p>
          </Link>
          <Link href={"/favorites"}>
            <p className="settings-list__item">My favorites</p>
          </Link>
        </div>
      </div>
      <div className="wrapper">
        <div className="container">
          {isLoading ? <Loading /> : <ProfileSettings user={user} />}
        </div>
      </div>
    </MyProfileStyles>
  );
};

const MyProfileStyles = styled.div`
  .wrapper {
    background-color: white;
    width: 100%;
    margin-top: 2rem;
    height: 100%;
  }

  .profile-title {
    margin-top: 2rem;
    font-size: 3rem;
    font-weight: 600;
  }

  .settings-list {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    font-size: 1.2rem;

    &__item {
      cursor: pointer;
    }

    .active {
      font-weight: 600;
      text-decoration: underline;
    }
  }
`;

export default MyProfile;
