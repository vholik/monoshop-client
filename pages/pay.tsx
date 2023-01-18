import Header from "@components/Header/Header";
import styled from "styled-components";
import Image from "next/image";
import Security from "@public/images/security.svg";
import { FlexPage } from "@utils/FlexStyle";
import Footer from "@components/Footer/Footer";
import { useAppDispatch, useAppSelector } from "@store/hooks/redux";
import Router from "next/router";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PayFormData } from "@store/types/pay";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CountryDropdown } from "react-country-region-selector";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useEffect } from "react";

import { getStripeSession } from "@store/reducers/payments/PaySlice";
import { showErrorToast } from "@utils/ReactTostify/tostifyHandlers";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Pay = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.payReducer.status);

  const {
    register,
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<PayFormData>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      phone: "",
      country: "Ukraine",
    },
  });

  const { item } = useAppSelector((state) => state.cartReducer);

  useEffect(() => {
    //Check if item is null
    if (!item) {
      Router.push("/404");
    }
  }, []);

  const getTotalPrice = (price: number) => {
    // Return price plus shop tax 10%
    return price + price / 10;
  };

  const onSubmit: SubmitHandler<PayFormData> = (data) => {
    if (item) {
      dispatch(getStripeSession({ ...data, itemId: item.id }))
        .unwrap()
        .then(async (sessionId) => {
          const stripe = await stripePromise;

          const error = await stripe?.redirectToCheckout({
            sessionId,
          });

          if (error) {
            showErrorToast("Can not create a payment session");
          }
        })
        .catch((err) => {
          showErrorToast("Can not create a payment session");
        });
    }
  };

  return (
    <FlexPage>
      <PayStyles>
        <Header />
        <div className="wrapper">
          <div className="shipping">
            <h1 className="title">Shipping method</h1>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <label className="label">
                First name and last name
                <input
                  type="text"
                  className="input"
                  {...register("fullName", {
                    required: true,
                    maxLength: {
                      value: 50,
                      message: "Max 50 symbols",
                    },
                  })}
                />
                {errors?.fullName?.message && (
                  <div className="error">
                    {errors?.fullName && errors.fullName.message}
                  </div>
                )}
              </label>
              <label className="label">
                Adress line 1
                <input
                  type="text"
                  className="input"
                  {...register("line1", {
                    required: true,
                    maxLength: {
                      value: 50,
                      message: "Max 50 symbols",
                    },
                  })}
                />
                {errors?.line1?.message && (
                  <div className="error">
                    {errors?.line1 && errors.line1.message}
                  </div>
                )}
              </label>
              <label className="label">
                Adress line 2 (optional)
                <input
                  type="text"
                  className="input"
                  {...register("line2", {
                    maxLength: {
                      value: 50,
                      message: "Max 50 symbols",
                    },
                  })}
                />
                {errors?.line2?.message && (
                  <div className="error">
                    {errors?.line2 && errors.line2.message}
                  </div>
                )}
              </label>
              <label className="label">
                City
                <input
                  type="text"
                  className="input"
                  {...register("city", {
                    required: true,
                    maxLength: {
                      value: 50,
                      message: "Max 50 symbols",
                    },
                  })}
                />
                {errors?.city?.message && (
                  <div className="error">
                    {errors?.city && errors.city.message}
                  </div>
                )}
              </label>
              <label className="label">
                State or Country
                <input
                  type="text"
                  className="input"
                  {...register("state", {
                    required: true,
                    maxLength: {
                      value: 50,
                      message: "Max 50 symbols",
                    },
                  })}
                />
                {errors?.state?.message && (
                  <div className="error">
                    {errors?.state && errors.state.message}
                  </div>
                )}
              </label>
              <label className="label">
                Zip or postal code
                <input
                  type="text"
                  className="input"
                  maxLength={6}
                  {...register("postalCode", {
                    required: true,
                    valueAsNumber: true,
                    maxLength: {
                      value: 6,
                      message: "Max 6 symbols",
                    },
                  })}
                />
                {errors?.postalCode?.message && (
                  <div className="error">
                    {errors?.postalCode && errors.postalCode.message}
                  </div>
                )}
              </label>
              <label className="label">
                Country
                <Controller
                  name="country"
                  rules={{
                    required: true,
                  }}
                  render={({ field: { name, onChange, value } }) => (
                    <div className="country-dropdown">
                      <CountryDropdown
                        name={name}
                        value={value}
                        onChange={onChange}
                      />
                    </div>
                  )}
                  control={control}
                />
                {errors?.country?.message && (
                  <div className="error">
                    {errors?.country && errors.country.message}
                  </div>
                )}
              </label>
              <label className="label">
                Email adress
                <input
                  type="text"
                  className="input"
                  {...register("email", {
                    required: "Please provide your email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors?.email?.message && (
                  <div className="error">
                    {errors?.email && errors.email.message}
                  </div>
                )}
              </label>
              <label className="label">
                Phone number
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    validate: (value) => isValidPhoneNumber(value!),
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      value={value}
                      onChange={onChange}
                      defaultCountry="UA"
                      id="phone-input"
                    />
                  )}
                />
                {errors["phone"] && <p className="error">Invalid Phone</p>}
              </label>
              <button className="button" disabled={status === "loading"}>
                Continue to payment
              </button>
            </form>
            <p className="guaranty-icon">
              <Image src={Security} alt="Security" />
              Whenever you but on Monoshop, you're covered with buyer protection
            </p>
          </div>
          <div className="cart">
            <h1 className="title">Cart</h1>
            <div className="cart-table">
              <div className="cart-table__item">
                <h3 className="cart-table__name">Subtotal</h3>
                <p className="cart-table__price">{item?.price} PLN</p>
              </div>
              <div className="cart-table__item">
                <h3 className="cart-table__name">Shipping</h3>
                <p className="cart-table__price">N/A</p>
              </div>
              <div className="cart-table__item">
                <h3 className="cart-table__name">Taxes (10%)</h3>
                <p className="cart-table__price">
                  {item?.price && item.price / 10} PLN
                </p>
              </div>
              <div className="cart-table__item total">
                <h3 className="cart-table__name total--name">Total</h3>
                <p className="cart-table__price total--price">
                  {item?.price && getTotalPrice(item.price)} PLN
                </p>
              </div>
            </div>
            <div className="item-table">
              <Link href={`/shop/${item?.id}`}>
                {item?.images.length && (
                  <Image
                    src={item.images[0]}
                    alt="Item image"
                    width={150}
                    height={150}
                    className="item-image"
                  />
                )}
              </Link>
              <div className="right">
                <div className="right-top">
                  <Link href={`/shop/${item?.id}`}>
                    <div className="item-title">{item?.name}</div>
                  </Link>
                  <div className="item-price">{item?.price} PLN</div>
                </div>
                <p className="item-size">{item?.size}</p>
              </div>
            </div>
          </div>
        </div>
      </PayStyles>
      <Footer />
    </FlexPage>
  );
};

const PayStyles = styled.div`
  .wrapper {
    display: grid;
    margin-top: 4rem;
    padding: 0 50px;
    grid-template-columns: 3fr 2fr;
    column-gap: var(--gap);
  }

  .item-table {
    background-color: #f9f9f9;
    border-radius: 0.5em;
    padding: 1em 1em;
    margin-top: 1rem;
    display: flex;
    gap: 1rem;

    .item-title {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .item-price {
      font-size: 1.1rem;
    }

    .item-size {
      margin-top: 0.5rem;
      color: var(--grey-60);
    }

    .right {
      width: 100%;
    }

    .right-top {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .item-image {
      object-fit: cover;
    }
  }

  .cart-table {
    background-color: #f9f9f9;
    border-radius: 0.5em;
    padding: 1em 1em;
    margin-top: 2rem;

    &__item {
      padding: 0.6em 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--grey-30);
      border-bottom: 1px solid var(--grey-10);
    }

    &__name {
      font-weight: 600;
      font-size: 1rem;
    }

    &__price {
      font-weight: 500;
      font-size: 1.1rem;
    }

    .total {
      border-bottom: none;
      color: var(--dark);
    }

    .total--name {
      font-size: 1.2rem;
    }
  }

  .guaranty-icon {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    gap: 0.5rem;
    color: var(--grey-60);
  }

  .form {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: var(--gap);

    .input {
      margin-top: 0.5rem;
    }

    .button {
      grid-column: 1;
      width: fit-content;
      margin-top: 1rem;
    }
  }
`;

export default Pay;
