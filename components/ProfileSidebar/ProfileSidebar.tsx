import React from "react";
import { profileRoutes } from "@components/Profile/Profile.data";
import { ProfileSidebarStyles } from "./ProfileSidebar.styles";
import Link from "next/link";

interface ProfileSidebarProps {
  path: string;
}

function ProfileSidebar({ path }: ProfileSidebarProps) {
  return (
    <ProfileSidebarStyles>
      <h1 className="title-sm">Profile</h1>
      {profileRoutes.map((route) => (
        <Link href={route.path}>
          <div
            className={
              path === route.path
                ? "profile-route active-route"
                : "profile-route"
            }
          >
            {route.name}
          </div>
        </Link>
      ))}
    </ProfileSidebarStyles>
  );
}

export default ProfileSidebar;
