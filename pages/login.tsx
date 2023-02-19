import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { ILoginFormData } from '@store/types/auth'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import styled from 'styled-components'
import Router, { useRouter } from 'next/router'
import instance, { AuthResponse } from '@utils/axios'
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider
} from '@react-oauth/google'
import { useEffect, useState } from 'react'
import { loginUser } from '@store/reducers/auth/AuthSlice'
import OkayIcon from '@public/images/okay.svg'
import ErrorIcon from '@public/images/error.svg'
import Image from 'next/image'
import { confirmEmail } from '@store/reducers/auth/ConfirmEmailSlice'
import { CustomHead } from '@utils/CustomHead'

export default function Login() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [googleError, setGoogleError] = useState('')

  useEffect(() => {
    const token = router.query.token

    if (typeof token === 'string') {
      dispatch(confirmEmail({ token: token }))
        .unwrap()
        .catch((error) => {
          console.log('rejected', error)
        })
    }
  }, [router.isReady])

  const status = useAppSelector((state) => state.authReducer.status)
  const emailStatus = useAppSelector(
    (state) => state.confirmEmailReducer.status
  )
  const error = useAppSelector((state) => state.authReducer.error)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginFormData>({ mode: 'onChange' })

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
        console.log('rejected', error)
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
      <CustomHead title="Login" />
      {status === 'email_wait' ? (
        <div className="email-confirm-table">
          <h2 className="title-md">Confirm an e-mail</h2>
          <p className="email-subtitle">
            We resent you a link that confirms your e-mail
          </p>
          <Link href="/">
            <button className="button-xl email-button">Okay</button>
          </Link>
        </div>
      ) : (
        <div className="wrapper">
          {emailStatus === 'success' && (
            <div className="email-status">
              <Image src={OkayIcon} alt="Success" />
              Your e-mail succesfuly confirmed. Now log in
            </div>
          )}
          {emailStatus === 'error' && (
            <div className="email-status error-email">
              <Image src={ErrorIcon} alt="Error" />
              Error confirming your email
            </div>
          )}
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="title-md title">Login to your account</h1>
            {/* Email */}
            <label htmlFor="#email-input" className="label">
              <div className="error-label-wrapper">
                Your email
                {errors.email && (
                  <p className="error">{errors.email.message}</p>
                )}
              </div>

              <input
                type="text"
                placeholder="Your email"
                className="input"
                id="email-input"
                {...register('email', {
                  required: 'Please provide your email',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </label>
            {/* Password */}
            <label htmlFor="#password-input" className="label">
              <div className="error-label-wrapper">
                Password
                {errors.password && (
                  <p className="error">{errors.password.message}</p>
                )}
              </div>
              <input
                type="password"
                placeholder="Password"
                className="input"
                id="password-input"
                {...register('password', {
                  required: 'Please provide a password',
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
            </label>
            <p className="account-action">
              Haven't created an account yet?{' '}
              <Link href="/register">
                <span className="link">Register</span>
              </Link>
            </p>
            <button className="button-xl">Continue</button>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID!}
            >
              <div className="google-login-btn">
                <GoogleLogin
                  context="signin"
                  useOneTap
                  onSuccess={successHandler}
                  onError={googleErrorHandler}
                  size="large"
                  theme="filled_blue"
                  text="signin_with"
                  type="standard"
                />
              </div>
            </GoogleOAuthProvider>
            {status === 'error' && <div className="form-error">{error}</div>}
          </form>
        </div>
      )}
    </LoginStyles>
  )
}

const LoginStyles = styled.div`
  .email-confirm-table {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 6rem;
    gap: 1rem;
  }

  .email-status {
    font-weight: 500;
    padding: 0.5rem 1rem;
    color: var(--white);
    background-color: #14a800;
    border-radius: 6px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .error-email {
    background-color: #d80101;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 4rem;

    .label {
      font-size: 0.9rem;
      color: var(--grey-60);
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
      align-items: center;
      border: 1px solid var(--stroke);
      padding: 2rem 2rem 3rem 2rem;
      border-radius: 1em;

      .input {
        width: 20rem;
        margin-bottom: 1rem;
      }

      .button-xl {
        margin-top: 2rem;
        margin-bottom: 2rem;
      }
    }

    .account-action {
      font-family: 400;
      color: var(--grey-60);
      margin-top: 2rem;

      .link {
        color: var(--dark);
        text-decoration: underline;
      }
    }
  }
`
