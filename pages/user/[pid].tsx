import { wrapper } from "@store/reducers/store";
import styled from "styled-components";
import { User } from "@store/types/user";
import Header from "@components/Header";
import Categories from "@components/Categories/Categories";
import { getUserById } from "@store/reducers/user/GetUserById";
import Image from "next/image";
import Link from "next/link";
import Phone from "@public/images/phone.svg";
import Location from "@public/images/location.svg";
import Flash from "@public/images/flash.svg";
import { useAppSelector } from "@store/hooks/redux";
import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import { FlexPage } from "@utils/FlexStyle";
import Footer from "@components/Footer/Footer";
import ArrowRight from "@public/images/arrow-left.svg";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const pid = query.pid as string;
      const user = await (await store.dispatch(getUserById(pid))).payload;

      return {
        props: {
          user,
          error: null,
        },
      };
    }
);

interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
  const router = useRouter();

  const { error } = useAppSelector((state) => state.getUserByIdReducer);

  useEffect(() => {
    if (error) {
      Router.push("/404");
    }
  }, []);

  return (
    <FlexPage>
      <UserProfileStyles>
        <Header />
        <Categories />
        <div className="container">
          <div className="back" onClick={() => router.back()}>
            <Image src={ArrowRight} alt="url" width={10} height={10} />
            Back to the previous page
          </div>
          <div className="wrapper">
            <div className="user">
              <Image
                src={user.image}
                alt="User photo"
                width={100}
                height={100}
                style={{ objectFit: "cover" }}
                className="user-photo"
              />
              <div className="right">
                <h2 className="user-name">{user.fullName}</h2>
                <div className="bottom">
                  <p className="user-activity">
                    <Image src={Flash} alt="Flash" height={20} width={20} />{" "}
                    Last active today
                  </p>
                  {user.phone && (
                    <p className="user-phone">
                      <Image src={Phone} alt="Phone" height={20} width={20} />{" "}
                      {user.phone}
                    </p>
                  )}
                  {user.location && (
                    <p className="user-location">
                      <Image
                        src={Location}
                        alt="Location"
                        height={20}
                        width={20}
                      />{" "}
                      {user.location}
                    </p>
                  )}
                </div>
                <button className="button">Message</button>
              </div>
            </div>
          </div>
        </div>
        <div className="items-wrapper">
          <div className="container">
            {!user.items?.length && (
              <p className="no-items">There is not items posted</p>
            )}
            <div className="items-wrapper__inner">
              {user.items?.map((item) => (
                <div className="item" key={item.id}>
                  <Link href={`/shop/${item.id}`}>
                    <div className="item-image">
                      <Image
                        src={item.images[0]}
                        alt="Image"
                        style={{ objectFit: "cover" }}
                        fill
                      />
                    </div>
                  </Link>
                  <h2 className="item-name">{item.name}</h2>
                  <p className="item-price">{item.price} PLN</p>
                  <h3 className="item-size">{item.size}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </UserProfileStyles>
      <Footer />
    </FlexPage>
  );
};

const UserProfileStyles = styled.div`
  .back {
    margin-top: 1.6rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .wrapper {
    margin-top: 1.6rem;
  }

  .items-wrapper {
    margin-top: 2rem;

    &__inner {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-gap: 0.5vw;
    }
  }

  .item {
    .item-image {
      aspect-ratio: 1 / 1.2;
      position: relative;
    }

    .item-name {
      font-size: 1rem;
      margin-top: 0.5rem;
    }

    .item-size {
      font-size: 1rem;
      margin-top: 0.5rem;
      color: var(--grey-60);
    }

    .item-price {
      margin-top: 0.5rem;
    }
  }

  .user {
    display: flex;
    gap: 1rem;
    .bottom {
      margin-top: 0.5rem;
      display: flex;
      gap: 1rem;
    }

    .user-photo {
      border-radius: 50%;
    }

    .user-name {
      font-size: 1.5rem;
    }

    .user-location,
    .user-phone,
    .user-activity {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-activity {
      color: var(--grey);
    }

    .user-detail {
      margin-top: 0.5rem;
      color: var(--grey-60);
    }

    .button {
      margin-top: 1rem;
      padding: 1rem 2rem;
      border-radius: 2rem;
    }
  }
`;

export default UserProfile;
