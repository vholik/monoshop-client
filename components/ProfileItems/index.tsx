import { useAppDispatch } from "@store/hooks/redux";
import { useEffect } from "react";
import { ProfileItemsStyles } from "./ProfileItems.styles";

const ProfileItems = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {}, []);

  return <ProfileItemsStyles>Profile items</ProfileItemsStyles>;
};

export default ProfileItems;
