import { IProfileFormData, User } from "@store/types/user";
import { ProfileSettingsStyles } from "./ProfileSettings.styles";
import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { uploadImage } from "@store/reducers/item/UploadImageSlice";
import { editProfile } from "@store/reducers/user/EditProfileSlice";
import Loading from "@components/Loading/Loading";
import Router from "next/router";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface IProfileSetting {
  user: User | null;
}

const ProfileSettings = ({ user }: IProfileSetting) => {
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector(
    (state) => state.uploadImageReducer
  );

  const { isProfileLoading, profileError, profile } = useAppSelector(
    (state) => state.editProfileReducer
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IProfileFormData>({
    mode: "onBlur",
    defaultValues: {
      phone: user?.phone || "",
    },
  });

  const [profilePhoto, setProfilePhoto] = useState("");
  const [formError, setFormError] = useState("");

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
          console.error("rejected", error);
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
      setFormError("Please make some changes");

      setTimeout(() => {
        setFormError("");
      }, 5000);

      return;
    }

    if (isLoading) {
      setFormError("Wait until photo uploads");

      setTimeout(() => {
        setFormError("");
      }, 5000);

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
      .then(() => Router.push("/success-update"))
      .catch((err) => {
        console.log("rejected", err), Router.push("/404");
      });
  };

  console.log(user);

  return (
    <ProfileSettingsStyles>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="row">
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
            <Controller
              name="phone"
              control={control}
              render={({ field: { onChange, value } }) => (
                <PhoneInput
                  value={value}
                  onChange={onChange}
                  defaultCountry="UA"
                  id="phone-input"
                />
              )}
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

          <button
            className="button submit--buton"
            type="submit"
            disabled={isLoading || isProfileLoading || Boolean(profile)}
          >
            Save
          </button>
          <div className="status">
            {formError && <p className="error">{formError}</p>}
            {profileError && <p className="error">{profileError}</p>}
            {profile && <p className="success">Saved succesfully</p>}
          </div>
        </div>

        <div className="row">
          {user?.image && (
            <label className="label">
              Photo
              <div className={isLoading ? "loading-background photo" : "photo"}>
                <Image
                  src={user.image}
                  alt="Your photo"
                  fill
                  objectFit="cover"
                />
                {profilePhoto && (
                  <Image src={profilePhoto} alt="" fill objectFit="cover" />
                )}
                {!isLoading && (
                  <label className="upload">
                    Click here to upload a picture
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isLoading}
                      onChange={handleImageSubmit}
                    />
                  </label>
                )}
              </div>
            </label>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      </form>
    </ProfileSettingsStyles>
  );
};

export default ProfileSettings;
