import Head from 'next/head'

interface CustomHeadProps {
  title: string
}

export const CustomHead = ({ title }: CustomHeadProps) => {
  return (
    <>
      <Head>
        <title>{title ? `Monoshop - ${title}` : 'Monoshop'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Monoshop is a marketplace for selling clothes. Everyone can shop and sell with Monoshop"
        />
      </Head>
    </>
  )
}
