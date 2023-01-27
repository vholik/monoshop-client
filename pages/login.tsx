import Header from '@components/Header/Header'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { ILoginFormData } from '@store/types/auth'
import Head from 'next/head'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import styled from 'styled-components'
import { useCookies } from 'react-cookie'
import Router, { useRouter } from 'next/router'
import instance, { AuthResponse } from '@utils/axios'
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider
} from '@react-oauth/google'
import { hasGrantedAllScopesGoogle } from '@react-oauth/google'
import { useEffect, useState } from 'react'
import { loginUser } from '@store/reducers/auth/AuthSlice'

export default function Login() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [googleError, setGoogleError] = useState('')

  const status = useAppSelector((state) => state.authReducer.status)
  const error = useAppSelector((state) => state.authReducer.error)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginFormData>({ mode: 'onBlur' })

  const onSubmit: SubmitHandler<ILoginFormData> = (data) => {
    dispatch(loginUser(data))
      .unwrap()
      .then((res) => {
        localStorage.setItem('access_token', res.accessToken)
        localStorage.setItem('refresh_token', res.refreshToken)

        // Return to redirect query value
        const redirect = router.query.redirect as string
        if (redirect) {
          router.push(redirect)
        } else {
          router.push('/')
        }
      })
      .catch((error) => {
        console.error('rejected', error)
      })
  }

  // Google handler
  const successHandler = async (response: CredentialResponse) => {
    await instance
      .post<AuthResponse>('google-authentication', {
        token: response.credential
      })
      .then((res) => {
        localStorage.setItem('access_token', res.data.accessToken)
        localStorage.setItem('refresh_token', res.data.refreshToken)

        Router.push('/')
      })
      .catch((err) => Router.push('/404'))
  }

  const googleErrorHandler = () => {
    setGoogleError('Error google login')
  }

  return (
    <LoginStyles>
      <Head>
        <title>Monoshop - Login to your account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="wrapper">
        <div className="bg"></div>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="title-md title">Login to your account</h1>
          {/* Email */}
          <label htmlFor="#email-input" className="label">
            Your email
            <input
              type="text"
              placeholder="Your email"
              className="input"
              id="email-input"
              {...register('email', {
                required: 'Please provide your email',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'invalid email address'
                }
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </label>
          {/* Password */}
          <label htmlFor="#password-input" className="label">
            Password
            <input
              type="password"
              placeholder="Password"
              className="input"
              id="password-input"
              {...register('password', {
                required: true,
                maxLength: {
                  value: 30,
                  message: 'Max 30 symbols'
                },
                minLength: {
                  value: 8,
                  message: 'Use at least 8 symbols'
                }
              })}
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
            {status === 'error' && <div className="error">{error}</div>}
            {googleError && <div className="error">{googleError}</div>}
          </label>
          <p className="account-action">
            Haven't created an account yet?{' '}
            <Link href="/register">
              <span className="link">Register</span>
            </Link>
          </p>
          <button className="button">Login</button>

          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID!}
          >
            <div className="google-login-btn">
              <GoogleLogin
                context="signin"
                useOneTap
                onSuccess={successHandler}
                onError={googleErrorHandler}
              />
            </div>
          </GoogleOAuthProvider>
        </form>
      </div>
    </LoginStyles>
  )
}

const LoginStyles = styled.div`
  .google-login-btn {
    max-width: 10rem;
  }

  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    height: 100vh;
    grid-column-gap: 4rem;

    .error {
      color: red;
      margin-bottom: 0.5rem;
    }

    .title {
      margin-bottom: 2rem;
    }

    .bg {
      height: 100%;
      background-color: var(--grey-30);
    }

    .form {
      display: flex;
      flex-direction: column;

      .input {
        width: 20rem;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
      }

      .button {
        margin-top: 2rem;
        width: fit-content;
        margin-bottom: 1rem;
      }
    }

    .account-action {
      font-family: 400;
      color: var(--grey-60);
      .link {
        color: var(--dark);
        text-decoration: underline;
      }
    }
  }
`
