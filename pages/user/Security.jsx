import ProfileNav from "./Profile-Navbar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Security() {
  return (
    <section className="min-h-screen">
      <div className="mycontainer">
        <ProfileNav />
        <UserSecurity />
      </div>
    </section>
  );
}

function UserSecurity() {
  const [status, setStatus] = useState("");
  const submitHandler = async (values) => {
    if (values.newpass !== values.confirmpass) {
      setStatus("Confirm Password must be Matched!");
    } else {
      setStatus("");
      const response = await axios.patch("/api/User/profile", {
        oldPass: values.old,
        newPass: values.newpass,
      });
      console.log(response);

      if (response.status == 201) {
        toast.success("Password Updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setStatus(response.data.message);
        toast.error("Failed to Update, try again!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 100,
        });
      }
    }
  };

  return (
    <div className="mx-auto mt-8 flex w-full flex-col lg:w-2/3">
      <Formik
        initialValues={{
          old: "",
          newpass: "",
          confirmpass: "",
        }}
        onSubmit={submitHandler}
      >
        <Form
          className="flex w-full flex-col rounded-lg border
                border-blue-900 px-4 py-8 shadow-xl lg:px-8 lg:py-16"
        >
          {status ? <p className="text-center text-red-500">{status}</p> : ""}
          <div className="input_group">
            <label htmlFor="old">Enter Old Password:</label>
            <Field type="password" name="old" placeholder="Old Password" />

            <span className="error">
              <ErrorMessage name="old" />
            </span>
          </div>

          <div className="flex flex-col justify-between lg:flex-row">
            <div className="input_group w-full lg:w-[49%]">
              <label htmlFor="newpass">Enter New Password:</label>
              <Field
                type="password"
                name="newpass"
                placeholder="New Password"
              />

              <span className="error">
                <ErrorMessage name="new" />
              </span>
            </div>

            <div className="input_group w-full lg:w-[49%]">
              <label htmlFor="confirmpass">Re-Enter New Password:</label>
              <Field
                type="password"
                name="confirmpass"
                placeholder="Confirm Password"
              />

              <span className="confirm">
                <ErrorMessage name="old" />
              </span>
            </div>
          </div>

          <div className="buttons">
            <button type="reset" className="btn-secondary mt-4 px-4">
              Cancel
            </button>
            <button type="submit" className="btn-primary mt-4 px-4">
              Update
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Security;
