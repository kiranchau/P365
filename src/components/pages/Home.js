import React from "react";
import Container from "react-bootstrap/Container";
import { Button } from "react-bootstrap";
import UseFormContext from "../../context/UseFormContext";
import VerticallyCenteredModal from "../commonModules/Popups/VerticallyCenteredModal";

export default function SignIn() {
  const formContext = UseFormContext();

  return (
    <React.Fragment>
      <div className="bg-image signin-wrap">
        <Container>
          <div className="inner-sign-in">
            <div>
              <h2 className="heading">Personalized Insurance Jo Aapke Liye Sahi!!</h2>
              <div className="form-floating mb-4">
                <select id="idunique" className="form-select">
                  <option value="petrol">Healthcare and Doctor</option>
                  <option value="disel">IT, ITES & Tech Startup</option>
                  <option value="lphcng">CA & Financial Services</option>
                  <option value="lphcng">Retail and E Commerce</option>
                </select>
                <label htmlFor="idunique select-label">Select your occupation</label>
              </div>
            </div>
            <Button className="primary-btn w-auto">Get Insurance Quotes</Button>
          </div>
        </Container>
      </div>
      {/* popup for timeout */}
      <VerticallyCenteredModal
        show={formContext.errorPopUp}
        onHide={() => formContext.seterrorPopUp(false)}
        heading="Your session has expired. Please login to pick up where you left off."
      >
        {formContext.popupForTimeout}
      </VerticallyCenteredModal>
    </React.Fragment>
  );
}
