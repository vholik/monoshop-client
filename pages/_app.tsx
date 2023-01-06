import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { wrapper } from "@store/reducers/store";
import "styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default wrapper.withRedux(MyApp);
