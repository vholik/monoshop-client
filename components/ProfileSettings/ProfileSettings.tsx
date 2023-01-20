import { IProfileFormData, User } from "@store/types/user";
import { ProfileSettingsStyles } from "./ProfileSettings.styles";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { uploadImage } from "@store/reducers/image/UploadImageSlice";
import { editProfile } from "@store/reducers/user/EditProfileSlice";
import "react-phone-number-input/style.css";
import {
  showErrorToast,
  showLoadingToast,
  showSuccesToast,
} from "@utils/ReactTostify/tostifyHandlers";

interface IProfileSetting {
  user: User | null;
}

const ProfileSettings = ({ user }: IProfileSetting) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IProfileFormData>({
    mode: "onBlur",
  });

  const dispatch = useAppDispatch();

  const imageStatus = useAppSelector(
    (state) => state.uploadImageReducer.status
  );
  const profileStatus = useAppSelector(
    (state) => state.editProfileReducer.status
  );

  useEffect(() => {
    if (profileStatus === "error") {
      showErrorToast("Error displaying profile page");
    }
  }, []);

  const [profilePhoto, setProfilePhoto] = useState("");

  const handleImageSubmit = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files![0];

    if (image) {
      let body = new FormData();
      body.set("key", process.env.NEXT_PUBLIC_IMAGE_API_KEY!);
      body.append("image", image);

      dispatch(uploadImage(body))
        .unwrap()
        .then((result) => {
          const image = result.data.url;
          setProfilePhoto(image);
        })
        .catch((error) => {
          showErrorToast("Error uploading photo");
        });
    }
  };

  const onSubmit: SubmitHandler<IProfileFormData> = (data) => {
    if (
      !profilePhoto &&
      (data.fullName === user?.fullName || !data.fullName) &&
      (data.location === user?.location || !data.location) &&
      (data.phone === user?.phone || !data.phone)
    ) {
      showErrorToast("Please make some changes");

      return;
    }

    if (imageStatus === "loading") {
      showLoadingToast("Wait until photo uploads");

      return;
    }

    //Remove keys with empty strings
    const mappedObject = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != false)
    );

    dispatch(
      editProfile({ ...mappedObject, image: profilePhoto || user?.image })
    )
      .unwrap()
      .then(() => showSuccesToast("Succesfuly updated profile"))
      .catch((err) => {
        showErrorToast("Error updating profile");
      });
  };

  return (
    <ProfileSettingsStyles>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label className="label">
          Full Name
          <input
            type="text"
            className="input"
            defaultValue={user?.fullName}
            {...register("fullName", {
              maxLength: {
                value: 30,
                message: "Max 30 symbols",
              },
              minLength: {
                value: 4,
                message: "Use at least 4 symbols",
              },
            })}
          />
          {errors.fullName?.message && (
            <p className="error">{errors.fullName.message}</p>
          )}
        </label>
        <label className="label">
          Phone
          <input
            type="text"
            className="input"
            defaultValue={user?.phone}
            {...register("phone", {
              minLength: {
                value: 9,
                message: "Phone number must have at least 9 numbers",
              },
              maxLength: {
                value: 13,
                message: "Phone number can not have more than 13 numbers",
              },
            })}
          />
          {errors.phone?.message && (
            <p className="error">{errors.phone.message}</p>
          )}
        </label>
        <label className="label">
          Location
          <input
            type="text"
            className="input"
            defaultValue={user?.location}
            {...register("location", {
              minLength: {
                value: 4,
                message: "Use at least 4 symbols",
              },
              maxLength: {
                value: 30,
                message: "Max 30 symbols",
              },
            })}
          />
          {errors.location?.message && (
            <p className="error">{errors.location.message}</p>
          )}
        </label>
        {user?.image && (
          <div className="label">
            Photo
            <div className="photo-wrapper">
              {imageStatus === "loading" ? (
                <div className="photo skeleton-animation"></div>
              ) : (
                <Image
                  src={profilePhoto || user.image}
                  alt="Your photo"
                  width={150}
                  height={150}
                  className="photo"
                  style={{ objectFit: "cover" }}
                />
              )}
              <label className="upload-btn button">
                Upload new
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSubmit}
                />
              </label>
            </div>
          </div>
        )}
        <button
          className="button submit--buton"
          type="submit"
          disabled={
            imageStatus === "loading" ||
            profileStatus === "loading" ||
            profileStatus === "success"
          }
        >
          Save
        </button>
      </form>
    </ProfileSettingsStyles>
  );
};

export default ProfileSettings;
