import Loading from '@components/Loading/Loading'
import ProfileSidebar from '@components/ProfileSidebar/ProfileSidebar'
import { useRouter } from 'next/router'
import ErrorPage from 'pages/404'
import React, { ReactNode } from 'react'
import { ProfileStyles } from './Profile.styles'

interface ProfileProps {
  children: ReactNode
  isLoading: boolean
  isError: boolean
}

function Profile({ children, isLoading, isError }: ProfileProps) {
  const { pathname } = useRouter()

  if (isError) {
    return <ErrorPage />
  }

  return (
    <>
      <ProfileStyles>
        <ProfileSidebar path={pathname} />
        {isLoading ? (
          <div className="loading-wrapper">
            <Loading />
          </div>
        ) : (
          <>{children}</>
        )}
      </ProfileStyles>
    </>
  )
}

export default Profile
