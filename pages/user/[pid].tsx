import { wrapper } from "@store/reducers/store";
import styled from "styled-components";
import { User } from "@store/types/user";
import Header from "@components/Header";
import Categories from "@components/Categories/Categories";
import { getUserById } from "@store/reducers/user/GetUserById";
import Image from "next/image";
import Link from "next/link";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const pid = query.pid as string;
      const user = await (await store.dispatch(getUserById(pid))).payload;

      if (!user) {
        return {
          props: {
            user: {},
          },
        };
      }

      return {
        props: {
          user,
        },
      };
    }
);

interface UserProfileProps {
  user: User;
}

const UserProfile = ({ user }: UserProfileProps) => {
  console.log(user);

  return (
    <UserProfileStyles>
      <Header />
      <Categories />
      <div className="container">
        <div className="wrapper">
          <div className="user">
            <Image
              src={user.image}
              alt="User photo"
              width={150}
              height={150}
              className="user-photo"
            />
            <div className="right">
              <h2 className="user-name">{user.fullName}</h2>
              <p className="user-detail">{user.email}</p>
              <button className="button">Message</button>
            </div>
          </div>
        </div>
      </div>
      <div className="items-wrapper">
        <div className="container">
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
                <p className="item-price">{item.price} PLN</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserProfileStyles>
  );
};

const UserProfileStyles = styled.div`
  .wrapper {
    margin-top: 2rem;
  }

  .items-wrapper {
    margin-top: 2rem;
    padding-top: 2rem;
    padding-bottom: 3rem;
    background-color: white;

    &__inner {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-gap: 2rem;
    }
  }

  .item {
    .item-image {
      aspect-ratio: 1 / 1;
      position: relative;
    }

    .item-price {
      margin-top: 0.5rem;
    }
  }

  .user {
    display: flex;
    align-items: center;
    gap: 1rem;
    .user-photo {
      border-radius: 50%;
    }

    .user-name {
      font-size: 1.5rem;
    }

    .user-detail {
      margin-top: 0.5rem;
      color: var(--grey-60);
    }

    .button {
      margin-top: 1rem;
    }
  }
`;

export default UserProfile;
