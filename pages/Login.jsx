import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import { useState, useLayoutEffect } from "react";
import axios from "axios";
import Router from "next/router";

function Login() {
  const [isLoggedin, setLoggedin] = useState("");
  const [error, setError] = useState("");
  const validation = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is Required!"),
    password: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Password is Required!"),
  });

  const submitHandler = async (values) => {
    console.log(values);

    const result = await axios.get("api/User", {
      headers: {
        "Content-Type": "application/json",
      },
      params: { email: values.email.toLowerCase(), password: values.password },
    });
    setError("");
    console.log(result);
    if (result.status == 200) {
      Router.push("/");
      setTimeout(() => {
        Router.reload();
      }, 500);
    } else {
      return setError(result.data.message);
    }
  };

  // checking login status
  useLayoutEffect(() => {
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
      <div className="mycontainer">
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={submitHandler}
          validationSchema={validation}
        >
          <Form
            className={`mx-auto flex w-full flex-col rounded-lg border
						${error ? "border-red-600" : "border-blue-900"}
						 px-4 py-8 shadow-xl lg:w-1/2 lg:px-8 lg:py-16`}
          >
            <h1 className="mb-4 text-center text-xl font-bold text-blue-900 lg:text-3xl">
              Welcome back, Sign in to MetalCharts
            </h1>
            {error ? <p className="text-center text-red-600">{error}</p> : ""}

            <div className="input_group">
              <label htmlFor="email">Enter Your Email:</label>
              <Field type="email" name="email" placeholder="john@example.com" />
              <span className="error">
                <ErrorMessage name="email" />
              </span>
            </div>

            <div className="input_group">
              <label htmlFor="password">Enter Your Password:</label>
              <Field type="password" name="password" placeholder="********" />
              <span className="error">
                <ErrorMessage name="password" />
              </span>
            </div>

            <div className="flex flex-col justify-between lg:flex-row">
              <div className="my-2 flex flex-row items-center">
                <Field type="checkbox" name="remember" id="remember"></Field>
                <label htmlFor="remember" className="ml-2 text-blue-900">
                  Remmeber Me
                </label>
              </div>

              <Link href="/Forgot-Password">
                <a className="my-2 text-blue-900 hover:underline">
                  Forgot Password?
                </a>
              </Link>
            </div>

            <button type="submit" className="btn-primary px-4">
              Login
            </button>

            <p className="my-4 text-center text-slate-600">or</p>

            <p className="text-center font-light">
              Don&apos;t have an Account?{" "}
              <Link href="/Register">
                <a className="font-medium text-blue-900 hover:underline">
                  Register Now
                </a>
              </Link>
            </p>
          </Form>
        </Formik>
      </div>
    </section>
  );
}

export default Login;
