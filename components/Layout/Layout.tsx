import Categories from '@components/Categories/Categories'
import Footer from '@components/Footer/Footer'
import Header from '@components/Header/Header'
import { ReactNode } from 'react'
import { LayoutStyles } from './Layout.styles'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <LayoutStyles>
      <Header />
      <Categories />
      {children}
      <Footer />
    </LayoutStyles>
  )
}

export default Layout
