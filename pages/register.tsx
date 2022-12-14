import Header from "@components/Header";
import { IRegisterFormData } from "@store/types/auth";
import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import { fetchRegister } from "@store/reducers/auth/RegisterSlice";
import Router from "next/router";

export default function Login() {
  const dispatch = useAppDispatch();

  const { error } = useAppSelector((state) => state.registerReducer);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFormData>({ mode: "onBlur" });

  const onSubmit: SubmitHandler<IRegisterFormData> = (data) => {
    dispatch(fetchRegister(data))
      .unwrap()
      .then((result) => {
        Router.push("/login");
      })
      .catch((error) => {
        console.error("rejected", error);
      });
  };

  return (
    <LoginStyles>
      <Head>
        <title>Monoshop - Login to your account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="wrapper">
        <div className="bg"></div>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="title-md title">Register an account</h1>
          {/* Email */}
          <label className="label">
            E-mail
            <input
              type="text"
              placeholder="Your email"
              className="input"
              {...register("email", {
                required: "Please provide your email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address",
                },
              })}
            />
          </label>
          <div className="error">{errors?.email && errors.email.message}</div>
          {/* Fullname  */}
          <label className="label">
            Fullname
            <input
              {...register("fullName", {
                required: true,
                maxLength: {
                  value: 30,
                  message: "Max 30 symbols",
                },
              })}
              type="text"
              placeholder="Joe Doe"
              className="input"
            />
          </label>
          {/* Password  */}
          <label className="label">
            Password
            <input
              {...register("password", {
                required: true,
                maxLength: {
                  value: 30,
                  message: "Max 30 symbols",
                },
                minLength: {
                  value: 8,
                  message: "Use at least 8 symbols",
                },
              })}
              type="password"
              placeholder="Password"
              className="input"
            />
          </label>
          <p className="account-action">
            Already have an account?{" "}
            <Link href="/login">
              <span className="link">Login</span>
            </Link>
          </p>
          <button className="button" type="submit">
            Register
          </button>
          <div className="error">{error && error}</div>
        </form>
      </div>
    </LoginStyles>
  );
}

const LoginStyles = styled.div`
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
      color: var(--grey-60);
      margin-top: 0.5rem;
      .link {
        color: var(--dark);
        text-decoration: underline;
      }
    }
  }
`;
