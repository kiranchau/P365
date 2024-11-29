import React from "react";
import UseFormContext from "../../context/UseFormContext";

export default function PaymentForm(props) {
  const formContext = UseFormContext();

  return (
    <React.Fragment>
      <div>
        <h2>
          Click the finish button to Proceed for payment
        </h2>
        {formContext.loaderStatus && <div>{formContext.spinner}
          <br />
          please wait, we are redirecting you to payment page.
        </div>}
      </div>
    </React.Fragment>
  );
}
