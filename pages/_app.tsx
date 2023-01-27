import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'
import { wrapper } from '@store/reducers/store'
import 'styles/globals.scss'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from '@components/Layout/Layout'

interface PageProps {
  pageProps: {
    id: number
  }
}

const MyApp = ({
  Component,
  ...rest
}: Omit<AppProps, 'pageProps'> & PageProps) => {
  const { store, props } = wrapper.useWrappedStore(rest)

  return (
    <Provider store={store}>
      <Layout>
        <Component {...props.pageProps} />
        <ToastContainer limit={1} theme="colored" />
      </Layout>
    </Provider>
  )
}

export default MyApp
