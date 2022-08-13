import ProfileNav from "./Profile-Navbar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

function Verification() {
  return (
    <section className="min-h-screen">
      <div className="mycontainer">
        <ProfileNav />
        <UserVerification />
      </div>
    </section>
  );
}

function UserVerification() {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    async function checkStatus() {
      const response = await axios.get("/api/User/kyc");
      setStatus(response.data);
    }
    checkStatus();
  }, []);

  const submitHandler = async (values) => {
    let formdata = new FormData();

    formdata.set("address", values.address);
    formdata.set("city", values.city);
    formdata.set("country", values.country);
    formdata.set("dob", values.dob);
    formdata.set("kyc", values.selfie);
    formdata.append("kyc", values.frontside);
    formdata.append("kyc", values.backside);
    const response = await axios.post("/api/User/kyc", formdata, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    if (response.status == 201) {
      setStatus("waiting");
      toast.success("Documents Have been Submited", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Failed to Submit, try again!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 100,
      });
    }
  };

  const resubmit = async () => {
    const response = await axios.patch("/api/User/kyc");
    setStatus(response.data);
  };

  return (
    <div className="mx-auto mt-8 flex w-full flex-col lg:w-2/3">
      {status == "pending" || status == "resubmition" ? (
        <Formik
          initialValues={{
            address: "",
            city: "",
            country: "",
            cnic: "",
            dob: "",
            selfie: "",
            frontend: "",
            backside: "",
          }}
          onSubmit={submitHandler}
        >
          {({ setFieldValue }) => {
            return (
              <Form
                className="flex w-full flex-col rounded-lg border
                       border-blue-900 px-4 py-8 shadow-xl lg:px-8 lg:py-16"
              >
                <div className="input_group">
                  <label htmlFor="address">Enter Your Address:</label>
                  <Field
                    type="text"
                    name="address"
                    placeholder="Street Address"
                  />

                  <span className="error">
                    <ErrorMessage name="address" />
                  </span>
                </div>

                <div className="flex flex-col justify-between lg:flex-row">
                  <div className="input_group w-full lg:w-[49%]">
                    <label htmlFor="city">Enter Your City:</label>
                    <Field type="text" name="city" placeholder="City Name" />

                    <span className="error">
                      <ErrorMessage name="city" />
                    </span>
                  </div>

                  <div className="input_group w-full lg:w-[49%]">
                    <label htmlFor="country">Enter Your Country:</label>
                    <Field
                      type="text"
                      name="country"
                      placeholder="Country Name"
                    />

                    <span className="error">
                      <ErrorMessage name="country" />
                    </span>
                  </div>
                </div>

                <h3 className="mt-8 font-semibold text-blue-900">
                  Identity Verification Required*
                </h3>
                <p className="font-light">
                  We need to verify your Identity, for that you have to submit
                  your CNIC or Passport Pictures. You can check the below
                  samples before uploading Pictures. It can take upto 7 Days.
                </p>

                <div className="flex flex-col justify-between lg:flex-row">
                  <div className="input_group w-full lg:w-[49%]">
                    <label htmlFor="selfie">
                      Selfie with Holding Document(Frontside):
                    </label>
                    <input
                      type="file"
                      name="selfie"
                      id="selfie"
                      accept="image/*"
                      onChange={(e) => {
                        setFieldValue("selfie", e.target.files[0]);
                      }}
                    />

                    <span className="error">
                      <ErrorMessage name="selfie" />
                    </span>
                  </div>

                  <div className="input_group w-full lg:w-[49%]">
                    <label htmlFor="dob">Date of Birth:</label>
                    <Field type="date" name="dob" />

                    <span className="error">
                      <ErrorMessage name="dob" />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between lg:flex-row">
                  <div className="input_group w-full lg:w-[49%]">
                    <label htmlFor="frontside">
                      Frontside of Your Document:
                    </label>
                    <input
                      type="file"
                      name="frontside"
                      id="frontside"
                      accept="image/*"
                      onChange={(e) => {
                        setFieldValue("frontside", e.target.files[0]);
                      }}
                    />

                    <span className="error">
                      <ErrorMessage name="frontside" />
                    </span>
                  </div>

                  <div className="input_group w-full lg:w-[49%]">
                    <label htmlFor="backside">Backside of Your Document:</label>
                    <input
                      type="file"
                      name="backside"
                      id="backside"
                      accept="image/*"
                      onChange={(e) => {
                        setFieldValue("backside", e.target.files[0]);
                      }}
                    />

                    <span className="error">
                      <ErrorMessage name="backside" />
                    </span>
                  </div>
                </div>

                <div className="buttons">
                  <button type="reset" className="btn-secondary mt-4 px-4">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary mt-4 px-4">
                    Send for Verification
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      ) : (
        ""
      )}

      {status == "waiting" ? (
        <div className="mx-auto w-2/3 text-center">
          <h2 className="text-3xl text-blue-600">Under Review!</h2>
          <p>Your KYC Application is under Review it can take upto 7 days.</p>
        </div>
      ) : (
        ""
      )}

      {status == "approved" ? (
        <div className="mx-auto w-2/3 text-center">
          <h2 className="text-3xl  text-green-600">Application Status!</h2>
          <p>
            Your KYC Application has been approved, now you can Trade on our
            MetalCharts.
          </p>
        </div>
      ) : (
        ""
      )}

      {status == "rejected" ? (
        <div className="mx-auto w-2/3 text-center">
          <h2 className="text-3xl  text-red-600">Application Status!</h2>
          <p>
            Your KYC Application has been rejected, you have resubmit your
            Documents.
          </p>
          <button className="btn-primary mt-2 px-4" onClick={resubmit}>
            Re-Submit Application
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Verification;
