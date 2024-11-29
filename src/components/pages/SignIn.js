import React, { useState, useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { Button } from "react-bootstrap";
import * as api from "../../API/authCurd";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import UseFormContext from "../../context/UseFormContext";
import { numCheck } from "../commonModules/CommonCode";
var CryptoJS = require("crypto-js");

export default function SignIn() {
  const formContext = UseFormContext();
  const [formVisbility, setformVisbility] = useState(true);
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]); // Initialize an array for each digit
  const inputRefs = [];
  const [timer, setTimer] = useState(30); // Timer in seconds (3 minutes)
  const [mobileNumber, setMobileNumber] = useState();
  const [otpCode, setOtpCode] = useState("");
  let history = useHistory();
  const [loaderStatus, setloaderStatus] = useState(false);
  // Function to handle backspace key press in a verification code input field
  const handleBackspace = (index) => {
    if (index > 0) {
      const updatedCode = [...verificationCode];
      updatedCode[index] = "";
      setVerificationCode(updatedCode);
      inputRefs[index - 1].focus();
    } else if (index === 0 && verificationCode[index] !== "") {
      const updatedCode = [...verificationCode];
      updatedCode[index] = "";
      setVerificationCode(updatedCode);
    }
  };

  useEffect(() => {
    // Decrease the timer every second
    const timerInterval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    // Clear the interval when the component unmounts
    return () => {
      clearInterval(timerInterval);
    };
  }, [timer]);
 
  const sendOTP = (text, number) => {
    if (!number || number?.trim()?.length < 10) {
      formContext.notifyError("Please enter valid 10 digit mobile Number");
      return;
    } else {
      setloaderStatus(true);
      api
        .mobileNumber(text, number)
        .then((res) => {
          if ((res.data.message = "OTP sent successfully")) {
            setloaderStatus(false);
            setformVisbility(false);
            setTimer(30);
          } else {
            setloaderStatus(false);
            formContext.notifyError(res.data.message);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };
  // this is temporary remove this method once otp  verification works
  const SkipMethod = () => {
    const encryptNo = CryptoJS.AES.encrypt(mobileNumber, "dynamipass").toString();
    sessionStorage.setItem("userLoggin", encryptNo);
    localStorage.setItem("ownerPhoneNumber", mobileNumber)
    if (formContext.pages === "Myprofile") {
      history.push("/myaccount");
    } else if (formContext.pages === "Quotes") {
      formContext.setloginPopupStatus(false);
    }
    setloaderStatus(false);
  }

  const verifyOTP = (text, number, code) => {
    var isErrorPresent = false;
    verificationCode.forEach((element) => {
      if (!element || element?.trim()?.length < 1) {
        isErrorPresent = true;
      }
    });
    if (isErrorPresent) {
      formContext.notifyError("Please enter valid 4 digit OTP");
      return;
    } else {
      setloaderStatus(true)
      api
        .mobileNumber(text, number, code)
        .then((res) => {
          if (res.data.message === "OTP verification successful") {
            const encryptNo = CryptoJS.AES.encrypt(number, "dynamipass").toString();
            sessionStorage.setItem("userLoggin", encryptNo);
            localStorage.setItem("ownerPhoneNumber", number)
            if (formContext.pages === "Myprofile") {
              history.push("/myaccount");
            } else if (formContext.pages === "Quotes") {
              formContext.setloginPopupStatus(false);
            }
            setloaderStatus(false);
          } else if (res.data.message === "OTP verification failed") {
            setloaderStatus(false);
            formContext.notifyError(res.data.message);
            setVerificationCode(["", "", "", ""]);
            setTimer(0);
          }
        })
        .catch((err) => {
          setformVisbility(false);
          console.log("err", err);
        });
    }
  };
  /*** Handles the change in the verification code input fields.
   * @param {Object} event - The event object containing information about the input change.
   * @param {number} index - The index of the current input field in the verification code array.
   **/
  const handleVerificationCodeChange = (event, index) => {
    const value = event.target.value;
    const updatedCode = [...verificationCode];
    const digit = value.replace(/\D/g, ""); // Ensure only digits are entered
    updatedCode[index] = digit;

    // Move to the next input field if a digit is entered
    if (digit && index < 3) {
      inputRefs[index + 1].focus();
    }
    setVerificationCode(updatedCode);
    const concatenatedValues = updatedCode.map((value) => value.replace(/"/g, "")).join("");
    setOtpCode(concatenatedValues);
  };

  const SendOtpForm = () => (
    <div>
      <h2 className="heading">Login to view your Policies & Risk Profile</h2>
      <FloatingLabel
        controlId="floatingInput"
        label="Registerd mobile number"
        className=""
        aria-autocomplete="off"
      >
        <Form.Control
          type="email"
          placeholder="First name"
          className="floating-input"
          maxLength={10}
          onChange={(e) => setMobileNumber(e.target.value)}
          onKeyDown={(e) => {
            numCheck(e);
          }}
        />
      </FloatingLabel>
    </div>
  );
  const OtpForm = () => (
    <div className="otp-form-wrap">
      <h2 className="heading">Enter your verification code.</h2>
      <p className="">We sent a verification code to {mobileNumber}</p>

      <div className="d-flex">
        <div className="verification-code-inputs d-flex">
          {verificationCode.map((_, index) => (
            <FloatingLabel controlId="floatingInput" className="" key={index}>
              <Form.Control
                key={index}
                type="text"
                maxLength="1"
                value={verificationCode[index]}
                onChange={(e) => handleVerificationCodeChange(e, index)}
                ref={(ref) => (inputRefs[index] = ref)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace") {
                    e.preventDefault();
                    handleBackspace(index);
                  }
                }}
                className="floating-input"
              />
            </FloatingLabel>
          ))}
        </div>
      </div>
      {timer > 0 && (
        <p>
          Time remaining: <span className="time-text">{timer}</span> seconds
        </p>
      )}
      {timer < 1 && <p className="send-code-link" onClick={() => { sendOTP("sendOTP", mobileNumber); formContext.notifySuccess("OTP sent successfully"); setVerificationCode(["", "", "", ""]); }}>
        Send the code agian
      </p>}

    </div >
  );
  return (
    <React.Fragment>
      <div className="bg-image signin-wrap">
        <Container>
          <div className="inner-sign-in">
            {formVisbility ? (
              <>
                {SendOtpForm()}
                <Button
                  onClick={() => sendOTP("sendOTP", mobileNumber)}
                  className="primary-btn"
                  disabled={loaderStatus}
                >
                  Send OTP {loaderStatus && formContext.spinner}
                </Button>
              </>
            ) : (
              <>
                {OtpForm()}
                <Button
                  onClick={() => verifyOTP('verifyOTP', mobileNumber, otpCode)}
                  className="primary-btn"
                  disabled={loaderStatus}
                >
                  Verify {loaderStatus && formContext.spinner}
                </Button>
                <Button
                  onClick={() => SkipMethod('verifyOTP', mobileNumber, otpCode)}
                  className="primary-btn ms-3"
                  disabled={loaderStatus}
                >
                  Skip
                </Button>
              </>
            )}
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}
