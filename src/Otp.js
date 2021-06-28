import React, { useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { sha256} from 'js-sha256';

export default function Otp() {
  const {txnId} = useParams();
  const {register, handleSubmit} = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const history = useHistory();

  const apiEndpoint="https://cdn-api.co-vin.in/api/v2/auth/public/confirmOTP";

  const onOtpSubmit = (data) => {
    axios.post(apiEndpoint, { otp: sha256(data.otp), txnId: txnId})
      .then((data) => { history.push("/display/"+data.data.token); },
            (error) => { setErrorMessage('An error occured! Wrong OTP/Expired OTP'); });
  };

  return (
    <div>
    <h1>Cowin Login</h1>
    <form onSubmit={handleSubmit(onOtpSubmit)}>
      <input {...register("otp", { required: true })} pattern="[0-9]{6}" placeholder="Enter otp sent to your mobile"/>
      {errorMessage && ( <p className="error"> {errorMessage} </p>)}
      <button className="buttonStyle" type="submit">Submit OTP</button>
    </form>
    </div>
  );

};
