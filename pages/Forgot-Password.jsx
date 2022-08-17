import { Formik, Form, Field, ErrorMessage } from "formik";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

function Forgetpassword() {
  const [status, setStatus] = useState("");
  const submitHandler = async (values) => {
    const response = await axios.post("/api/User/forgot", {
      email: values.email.toLowerCase(),
    });

    console.log(response);

    if (response.status == 201) {
      setStatus(
        "We email you the reset link, it will be Expired after 1 Hour Check your Email."
      );
    } else {
      setStatus(response.data.message);
    }
  };
  return (
    <section className="min-h-screen">
      <div className="mycontainer">
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={submitHandler}
        >
          <Form
            className="mx-auto flex flex-col rounded-lg
                border border-blue-900 px-4 py-8 shadow-xl md:w-1/2 lg:px-8 lg:py-16"
          >
            <h1 className="mb-4 text-center text-xl font-bold text-blue-900 lg:text-3xl">
              Reseting Password
            </h1>
            {status ? (
              <p className="text-center text-blue-500">{status}</p>
            ) : (
              ""
            )}
            <div className="input_group">
              <label htmlFor="email">Enter Your Email:</label>
              <Field type="email" name="email" placeholder="Email Address" />

              <span className="error">
                <ErrorMessage name="email" />
              </span>
            </div>

            <div className="buttons">
              <button type="submit" className="btn-primary mt-4 px-4">
                Send Reset Request
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </section>
  );
}

export default Forgetpassword;
