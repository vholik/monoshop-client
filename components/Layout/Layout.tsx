import Categories from "@components/Categories/Categories";
import Footer from "@components/Footer/Footer";
import Header from "@components/Header/Header";
import { ReactNode } from "react";
import { LayoutStyles } from "./Layout.styles";
import { useEffect } from "react";
import { useAppDispatch } from "@store/hooks/redux";
import { checkIsAuth } from "@store/reducers/auth/AuthSlice";
import { useRouter } from "next/router";

const Layout = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(checkIsAuth())
      .unwrap()
      .catch((err) => console.log(err));

    console.log("check");
  });

  return (
    <LayoutStyles>
      <Header />
      <Categories />
      {children}
      <Footer />
    </LayoutStyles>
  );
};

export default Layout;
