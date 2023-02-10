import { HeaderStyles } from './Header.styles'
import Image from 'next/image'
import SearchIcon from '@public/images/search.svg'
import Logo from '@public/images/logo.svg'
import UnfilledHeart from '@public/images/unfilled-heart.svg'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { ChangeEvent, useEffect, useState } from 'react'
import { checkIsAuth, logout } from '@store/reducers/auth/AuthSlice'
import ChatIcon from '@public/images/chat.svg'
import UserIcon from '@public/images/user.svg'
import Cross from '@public/images/cross.svg'
import { filterActions } from '@store/reducers/filter/FilterSlice'
import Router, { useRouter } from 'next/router'

export default function Header() {
  const dispatch = useAppDispatch()
  const username = useAppSelector((state) => state.authReducer.fullName)
  const userPhoto = useAppSelector((state) => state.authReducer.photo)
  const authStatus = useAppSelector((state) => state.authReducer.status)
  const filter = useAppSelector((state) => state.filterReducer)

  const [value, setValue] = useState('')

  useEffect(() => {
    // Set store search value to input
    if (filter.search) {
      setValue(filter.search)
    }

    dispatch(checkIsAuth())
      .unwrap()
      .catch((err) => console.log(err))
  }, [])

  const clearSearch = () => {
    setValue('')
    dispatch(filterActions.setSearchValue(''))
  }

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)

    if (!e.target.value) {
      dispatch(filterActions.setSearchValue(''))
    }
  }

  const searchSubmit = () => {
    if (value.length > 50) return

    if (value === filter.search) return

    dispatch(filterActions.resetFilter())
    dispatch(filterActions.setSearchValue(value))

    Router.push('/shop')
  }

  const logoutHandler = () => {
    dispatch(logout())
      .unwrap()
      .catch((err) => console.log(err))

    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('refresh_token')
  }

  return (
    <HeaderStyles>
      <Link href={'/'}>
        <Image
          src={Logo}
          alt="Logo"
          className="logo"
          draggable={false}
          height={30}
        />
      </Link>

      <div className="input-wrapper">
        <Image
          src={SearchIcon}
          height={16}
          width={16}
          alt="Search icon"
          className="search-icon"
        />
        <input
          type="text"
          placeholder="Search"
          className="input"
          onChange={inputHandler}
          value={value}
          maxLength={50}
        />
        {!!value.length && (
          <div className="search-buttons">
            <Image
              src={Cross}
              height={25}
              width={25}
              alt="Cross"
              className="cross-icon"
              onClick={clearSearch}
            />
            <button className="button input--button" onClick={searchSubmit}>
              Search
            </button>
          </div>
        )}
      </div>
      {authStatus === 'authenticated' ? (
        <div className="right">
          <Link href={'/sell'}>
            <button className="button">Sell clothes</button>
          </Link>
          <Link href={'/chat'}>
            <Image src={ChatIcon} alt="Chat" />
          </Link>

          <div className="profile-wrapper">
            {userPhoto ? (
              <Image
                src={userPhoto}
                alt="User photo"
                className="profile-image"
                width={40}
                height={40}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="profile-image"></div>
            )}
            <div className="profile-menu">
              <div className="profile">
                {userPhoto ? (
                  <Image
                    src={userPhoto}
                    alt="User photo"
                    className="profile-image"
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="profile-image"></div>
                )}
                <div className="profile-info">
                  <h3 className="profile-name">{username}</h3>
                </div>
              </div>
              <ul className="link-list">
                <Link href="/sell">
                  <li>Sell</li>
                </Link>
                <Link href="/settings">
                  <li>Settings</li>
                </Link>
                <Link href="/ordered">
                  <li>Orders</li>
                </Link>
                <Link href="/selling">
                  <li>Selling</li>
                </Link>
                <Link href="/sold">
                  <li>Sold</li>
                </Link>
                <Link href="/favorites">
                  <li>Favorites</li>
                </Link>
              </ul>
              <p className="logout-btn" onClick={logoutHandler}>
                Log out
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="right">
          <Link href={'/login'}>
            <button className="button">Log in</button>
          </Link>
          <Link href={'/register'}>
            <button className="button register-btn">Register</button>
          </Link>
        </div>
      )}
    </HeaderStyles>
  )
}
