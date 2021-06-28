import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const {register, handleSubmit} = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();

  const apiEndpoint="https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP";

  const onMobileSubmit = (data) => {
    axios.post(apiEndpoint, { mobile: data.mobile })
      .then((data) => { history.push("/enter-otp/"+data.data.txnId); },
            (error) => { setErrorMessage('An error occured! OTP already sent to this number'); });
  };

  return (
    <div>
    <h1>Cowin Login</h1>
    <form onSubmit={handleSubmit(onMobileSubmit)}>
      <input {...register("mobile", { required: true })} pattern="[6-9]{1}[0-9]{9}" placeholder="Enter registered mobile number"/>
      {errorMessage && ( <p className="error"> {errorMessage} </p>)}
      <button className="buttonStyle" type="submit">Get OTP</button>
    </form>
    </div>
  );

};
