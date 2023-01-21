import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { wrapper } from "@store/reducers/store";
import "styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@components/Layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />;
      <ToastContainer />
    </Layout>
  );
}

export default wrapper.withRedux(MyApp);
