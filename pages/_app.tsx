import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { wrapper } from "@store/reducers/store";
import "styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />;
      <ToastContainer />
    </>
  );
}

export default wrapper.withRedux(MyApp);
