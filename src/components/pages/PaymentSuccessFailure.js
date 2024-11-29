/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Row } from "react-bootstrap";
import { paymentConstants } from "../../mockDataFolder/MockData";

export default function PaymentSuccessFailure(props) {
  // fake data
  props = {
    certificateNo: "123456",
    startDate: "10/02/2023",
    endDate: "09/02/2024",
    premiumAmount: 6000,
  };
  var headingText;
  var description;
  var bgClass = "payment-success-image";


  // This useEffect sets the payment template based on the presence of certificateNo
  // If certificateNo is true, setPaymentSuccessTemplate is called; otherwise, setPaymentFailureTemplate is called.
  useEffect(() => {
    props.certificateNo
      ? setPaymentSuccessTemplate()
      : setPaymentFailureTemplate();
  }, []);

  const setPaymentSuccessTemplate = () => {
    headingText = "Payment Successful";
    description = () => (
      <div className="text-container">
        <p>
          We thank you for choosing Policies365 for your insurance needs. You
          would receive a confirmation for the premium paid along with the
          policy copy attached in a short while
        </p>
        <p className="text-dark">The policy details are as follows:</p>

        <div className="payment-success-table">
          <div className="row mb-2">
            <div className="col-6 text-right">Policy Certificate Number</div>
            <div className="col-6 text-left">{props.certificateNo}</div>
          </div>

          <div className="row mb-2">
            <div className="col-6 text-right">Policy Start Date</div>
            <div className="col-6 text-left">{props.startDate}</div>
          </div>

          <div className="row mb-2">
            <div className="col-6 text-right">Policy End Date</div>
            <div className="col-6 text-left">{props.endDate}</div>
          </div>

          <div className="row mb-1">
            <div className="col-6 text-right">Premium Paid Amount</div>
            <div className="col-6 text-left">
              &#x20b9; {props.premiumAmount}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const setPaymentFailureTemplate = () => {
    bgClass = "payment-failure-image";
    headingText = "Sorry for the inconvenience";
    description = () => (
      <div className="text-container">
        <p>Dear Customer,</p>
        <p>
          Due to some technical difficulties your payment has failed and hence
          we are unable to process your request with proposal number .
        </p>
        <p>
          If amount has been deducted from your account kindly get in touch with
          your bank for refund. Sorry for the inconvenience caused
        </p>
      </div>
    );
  }

  const footer = () => (
    <div>
      <hr className="divider" />
      <p className="mb-0">
        In case of any queries or assistance, please call us on our
        Helpline:&nbsp;
        <a
          className="text-primary text-decoration-none"
          href={`tel:${paymentConstants.HELPLINE_PHONE}`}
        >
          {paymentConstants.HELPLINE_PHONE}
        </a>
      </p>
      <p className="mb-0 mt-2">
        (Office hours 10:00 am to 7:00 pm) Or write to us at:&nbsp;
        <a
          className="text-primary text-decoration-none mb-0"
          href={`mailto:${paymentConstants.HELPLINE_EMAIL}`}
        >
          {paymentConstants.HELPLINE_EMAIL}
        </a>
      </p>
    </div>
  );

  return (
    <React.Fragment>
      <div className={"payment-success-failure-page   " + bgClass}>
        <Row>
          <h1 className="page-heading mt-3">{headingText}</h1>
        </Row>
        <Row className="text-secondary">{description}</Row>
        <Row>{footer()}</Row>
      </div>
    </React.Fragment>
  );
}
