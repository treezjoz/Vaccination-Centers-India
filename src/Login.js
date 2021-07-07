import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { sha256} from 'js-sha256';

export default function Login() {
  const {register, handleSubmit} = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const [txnId, setTxnId] = useState(null);
  const history = useHistory();

  const apiGenerate="https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP";
  const apiConfirm="https://cdn-api.co-vin.in/api/v2/auth/public/confirmOTP";

  const onMobileSubmit = (data, e) => {
    axios.post(apiGenerate, { mobile: data.mobile })
      .then((data) => { setTxnId(data.data.txnId); },
            (error) => { setErrorMessage('An error occured! OTP already sent to this number'); });
    e.target.reset();
  };

  const onOtpSubmit = (data) => {
    axios.post(apiConfirm, { otp: sha256(data.otp), txnId: txnId})
      .then((data) => { sessionStorage.setItem('token',data.data.token); history.push("/display"); },
            (error) => { setErrorMessage('An error occured! Wrong OTP/Expired OTP'); });
  };

  return (
    <div>
    <h1>Cowin Login</h1>
    {txnId?
      <form onSubmit={handleSubmit(onOtpSubmit)}>
        <input {...register("otp", { required: true })} pattern="[0-9]{6}" placeholder="Enter otp sent to your mobile"/>
        {errorMessage && ( <p className="error"> {errorMessage} </p>)}
        <button className="buttonStyle" type="submit">Submit OTP</button>
      </form>
      :
      <form onSubmit={handleSubmit(onMobileSubmit)}>
        <input {...register("mobile", { required: true })} pattern="[6-9]{1}[0-9]{9}" placeholder="Enter registered mobile number"/>
        {errorMessage && ( <p className="error"> {errorMessage} </p>)}
        <button className="buttonStyle" type="submit">Get OTP</button>
      </form>
    }
    </div>
  );

};
