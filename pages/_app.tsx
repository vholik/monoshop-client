import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { setupStore, wrapper } from "@store/reducers/store";

// const store = setupStore();

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default wrapper.withRedux(App);
