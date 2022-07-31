import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import Password from "../../models/Password";
import axios from "axios";
import Router from "next/router";

export default function ResetPassword({ params }) {
  const data = JSON.parse(params);
  const user = data.data;
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState(data.error);
  const submitHandler = async (values) => {
    if (values.newPass === values.cpass) {
      const response = await axios.patch("/api/User/forgot", {
        pass: values.newPass,
        cpass: values.cpass,
        pid: user?.pid,
        uid: user?.uid,
      });
      console.log(response);
      if (response.status == 201) {
        setSuccess(
          "Password has been Changed Successfully, Now you can login with new Password."
        );
      } else {
        alert(response.data.message);
      }
    } else {
      setSuccess("New Password and Confirm Password Doesn't Match.");
    }
  };

  console.log("params", params);
  return (
    <section className="min-h-screen">
      <div className="mycontainer">
        <Formik
          initialValues={{
            newPass: "",
            cpass: "",
          }}
          onSubmit={submitHandler}
        >
          <Form
            className="mx-auto mt-20 flex md:w-1/2 flex-col
              rounded-lg border border-blue-900 px-4 py-8 shadow-xl lg:px-8 lg:py-16"
          >
            <h1 className="mb-4 text-center text-xl font-bold text-blue-900 lg:text-3xl">
              Reseting Password
            </h1>
            {success ? (
              <p className="text-center text-blue-500">{success}</p>
            ) : (
              ""
            )}
            {status ? (
              <p className="text-center text-red-500">{status}</p>
            ) : (
              <>
                <div className="input_group">
                  <label htmlFor="newPass">Enter New Password:</label>
                  <Field
                    type="password"
                    name="newPass"
                    placeholder="********"
                  />

                  <span className="error">
                    <ErrorMessage name="newPass" />
                  </span>
                </div>

                <div className="input_group">
                  <label htmlFor="cpass">Enter Confim Password:</label>
                  <Field type="password" name="cpass" placeholder="********" />

                  <span className="error">
                    <ErrorMessage name="cpass" />
                  </span>
                </div>

                <div className="buttons">
                  <button type="submit" className="btn-primary mt-4 px-4">
                    Reset Password
                  </button>
                </div>
              </>
            )}
          </Form>
        </Formik>
      </div>
    </section>
  );
}

export async function getServerSideProps(context) {
  const { params } = context.params;
  const [uid, pid] = params;
  let error = "";
  let data = "";

  console.log("uid:-", uid);
  console.log("pid:-", pid);

  if (!uid || !pid) {
    error = "Incorrect Reseting URL";
  } else {
    const passwrd = await Password.findOne({ userid: uid, _id: pid });
    if (passwrd) {
      const reDate = new Date(passwrd.created_at);
      const date = new Date();

      console.log("reDate:-", reDate.toUTCString());
      console.log("date:-", date.toUTCString());
      const diffTime = Math.abs(date - reDate);
      const hours = diffTime / (1000 * 60 * 60);
      console.log("Date:-", hours);

      if (parseInt(hours) > 1) {
        error =
          "Reseting Link Expired, Initiate new Request for Password Reset";
      } else {
        if (passwrd.status == "active") {
          data = { uid, pid };
        } else {
          error =
            "Oops! You cant use this url, Initiate new Request for Password Reset";
        }
      }
    } else {
      error = "Incorrect Reseting URL";
    }
  }

  return {
    props: {
      params: JSON.stringify({ data, error }),
    },
  };
}
