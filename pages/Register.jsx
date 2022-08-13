import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState, useEffect } from "react";
import Router from "next/router";
import axios from "axios";

function Register() {
  const [error, setError] = useState();
  const [phoneInput, setPhoneInput] = useState();
  const validation = Yup.object({
    name: Yup.string().required("Name is Required!"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is Required!"),
    username: Yup.string().required("Username is Required!"),
    password: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Password is Required!"),
    cpassword: Yup.string()
      .max(20, "Must be Same")
      .required("Confirm Password!"),
  });

  const submitHandler = async (values) => {
    if (values.cpassword !== values.password) {
      return setError("Confirm Password not Matched!");
    }
    setError("");
    values.phone = phoneInput;
    const response = await axios("api/User", {
      method: "POST",
      data: values,
    });
    // const data = await response.json();

    console.log("status: ", response.status);

    if (response.status == 201) {
      Router.push("/");
      setTimeout(() => {
        Router.reload();
      }, 500);
    } else {
      return setError(response.data.message);
    }
  };

  // checking login status
  useEffect(() => {
    async function isLogedIn() {
      const { data } = await axios.get("api/User/cookie");

      if (data !== "") {
        Router.push("/");
      }
    }
    isLogedIn();
  }, []);
  return (
    <section className="min-h-screen">
      <div className="mycontainer my-16">
        <Formik
          initialValues={{
            name: "",
            email: "",
            username: "",
            phone: "",
            password: "",
            cpassword: "",
            referral: "",
          }}
          onSubmit={submitHandler}
          validationSchema={validation}
        >
          <Form
            className={`mx-auto flex w-full flex-col rounded-lg border
               ${
                 error ? "border-red-600" : "border-blue-900"
               } px-4 py-8 shadow-xl lg:w-1/2 lg:px-8 lg:py-16`}
          >
            <h1 className="mb-4 text-center text-xl font-bold text-blue-900 lg:text-3xl">
              Create Free Account
            </h1>
            {error ? <p className="text-center text-red-600">{error}</p> : ""}

            <div className="input_group">
              <label htmlFor="name">Enter Your Name:</label>
              <Field type="text" name="name" placeholder="John Doe" />

              <span className="error">
                <ErrorMessage name="name" />
              </span>
            </div>

            <div className="input_group">
              <label htmlFor="email">Enter Your Email:</label>
              <Field type="email" name="email" placeholder="john@example.com" />
              <span className="error">
                <ErrorMessage name="email" />
              </span>
            </div>

            <div className="input_group">
              <label htmlFor="username">Enter Your Username:</label>
              <Field type="text" name="username" placeholder="johndoe" />
              <span className="error">
                <ErrorMessage name="username" />
              </span>
            </div>

            <div className="input_group">
              <label htmlFor="phone">Enter Your Phone:</label>
              <PhoneInput
                onChange={setPhoneInput}
                inputStyle={{
                  height: "auto",
                  width: "100%",
                  border: "1px solid #1e3a8a",
                }}
                buttonStyle={{ border: "1px solid #1e3a8a" }}
                required={true}
                value={phoneInput}
                type="phone"
                name="phone"
                placeholder="+ xx xxx xxxxxx"
              />

              <span className="error">
                <ErrorMessage name="phone" />
              </span>
            </div>

            <div className="input_group">
              <label htmlFor="password">Enter Your Password:</label>
              <Field type="password" name="password" placeholder="********" />
              <span className="error">
                <ErrorMessage name="password" />
              </span>
            </div>

            <div className="input_group">
              <label htmlFor="cpassword">Confirm Password:</label>
              <Field type="password" name="cpassword" placeholder="********" />
              <span className="error">
                <ErrorMessage name="cpassword" />
              </span>
            </div>

            <div className="input_group">
              <label htmlFor="referral">
                Enter Referral Code <span className="text-xs">(optional)</span>:
              </label>
              <Field type="text" name="referral" placeholder="6 Digit Code" />
              <span className="error">
                <ErrorMessage name="referral" />
              </span>
            </div>

            <button type="submit" className="btn-primary mt-4 px-4">
              Register Now
            </button>

            <p className="my-4 text-center text-slate-600">or</p>

            <p className="text-center font-light">
              Do You already have an Account?{" "}
              <Link href="/Login">
                <a className="font-medium text-blue-900 hover:underline">
                  Login Now
                </a>
              </Link>
            </p>
          </Form>
        </Formik>
      </div>
    </section>
  );
}

export default Register;
