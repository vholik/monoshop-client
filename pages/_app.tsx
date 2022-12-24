import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { setupStore } from "@store/reducers/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={setupStore}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
