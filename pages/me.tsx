import Categories from "@components/Categories/Categories";
import Header from "@components/Header";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileSettings from "@components/ProfileSettings";
import ProfileItems from "@components/ProfileItems";
import { getProfile } from "@store/reducers/user/ProfileSlice";
import { wrapper } from "@store/reducers/store";
import { IProfileFormData, User } from "@store/types/user";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import Loading from "@components/Loading/Loading";

enum SettingEnum {
  PROFILE = "PROFILE",
  POSTS = "POSTS",
}

const MyProfile = () => {
  const dispatch = useAppDispatch();

  const [currentCard, setCurrentCard] = useState<SettingEnum>(
    SettingEnum.PROFILE
  );

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

  const changeCard = (name: SettingEnum) => {
    setCurrentCard(name);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MyProfileStyles>
      <Header />
      <Categories />
      <div className="container">
        <h2 className="profile-title">My profile</h2>
        <div className="settings-list">
          <p
            className={
              currentCard === SettingEnum.PROFILE
                ? "settings-list__item active"
                : "settings-list__item"
            }
            onClick={() => changeCard(SettingEnum.PROFILE)}
          >
            Profile settings
          </p>
          <p
            className={
              currentCard === SettingEnum.POSTS
                ? "settings-list__item active"
                : "settings-list__item"
            }
            onClick={() => changeCard(SettingEnum.POSTS)}
          >
            My items
          </p>
        </div>
      </div>
      <div className="wrapper">
        <div
          className="container"
          style={
            currentCard === SettingEnum.PROFILE
              ? { display: "block" }
              : { display: "none" }
          }
        >
          <ProfileSettings user={user} />
        </div>

        <div
          className="container"
          style={
            currentCard === SettingEnum.POSTS
              ? { display: "block" }
              : { display: "none" }
          }
        >
          <ProfileItems />
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
