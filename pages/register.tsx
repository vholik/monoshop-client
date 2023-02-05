import Header from '@components/Header/Header'
import { IRegisterFormData } from '@store/types/auth'
import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@store/hooks/redux'
import { registerUser } from '@store/reducers/auth/RegisterSlice'
import Router from 'next/router'

export default function Login() {
  const dispatch = useAppDispatch()

  const status = useAppSelector((state) => state.registerReducer.status)
  const error = useAppSelector((state) => state.registerReducer.error)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IRegisterFormData>({ mode: 'onBlur' })

  const onSubmit: SubmitHandler<IRegisterFormData> = (data) => {
    dispatch(registerUser(data))
      .unwrap()
      .then((result) => {
        Router.push('/login')
      })
      .catch((error) => {
        console.error('rejected', error)
      })
  }

  return (
    <LoginStyles>
      <Head>
        <title>Monoshop - Register your account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="wrapper">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="title-md title">Register an account</h1>
          {/* Email */}
          <label className="label">
            <div className="error-label-wrapper">
              E-mail
              {errors.email?.message && (
                <div className="error">{errors.email.message}</div>
              )}
            </div>

            <input
              type="text"
              placeholder="Your email"
              className="input"
              {...register('email', {
                required: 'Please provide your email',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
          </label>
          {/* Fullname  */}
          <label className="label">
            <div className="error-label-wrapper">
              Fullname
              {errors.fullName?.message && (
                <div className="error">{errors.fullName.message}</div>
              )}
            </div>
            <input
              {...register('fullName', {
                required: 'Please provide your name',
                maxLength: {
                  value: 30,
                  message: 'Max 30 symbols'
                }
              })}
              type="text"
              placeholder="Joe Doe"
              className="input"
            />
          </label>
          {/* Password  */}
          <label className="label">
            <div className="error-label-wrapper">
              Password
              {errors.password?.message && (
                <div className="error">{errors.password.message}</div>
              )}
            </div>
            <input
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
              type="password"
              placeholder="Password"
              className="input"
            />
          </label>
          <p className="account-action">
            Already have an account?{' '}
            <Link href="/login">
              <span className="link">Login</span>
            </Link>
          </p>
          <button
            className="button-xl"
            type="submit"
            disabled={status === 'loading'}
          >
            Register
          </button>
          {status === 'error' && <div className="form-error">{error}</div>}
        </form>
      </div>
    </LoginStyles>
  )
}

const LoginStyles = styled.div`
  .wrapper {
    display: flex;
    justify-content: center;
    margin-top: 4rem;

    .title {
      margin-bottom: 2rem;
    }

    .form {
      display: flex;
      flex-direction: column;
      align-items: center;

      .input {
        width: 20rem;
      }

      .button-xl {
        margin-top: 1rem;
      }
    }

    .label {
      margin-bottom: 1rem;
    }

    .account-action {
      color: var(--grey-60);
      .link {
        color: var(--dark);
        text-decoration: underline;
      }
    }
  }
`
