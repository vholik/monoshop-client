import { useRouter } from 'next/router'

export const isRouteSold = () => {
  const router = useRouter()

  return router.pathname === '/sold'
}
