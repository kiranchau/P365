import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import location from "../../../../src/images/location.svg";
import health from "../../../../src/images/health.png";
import SVG from "react-inlinesvg";
import { useHistory } from "react-router-dom";
import CountainerForHealth from "../CommonComponents/CountainerForHealth";
import { Button } from "react-bootstrap";
import deleteIcon from "../../../../src/images/delete.svg"

export default function HealthPage() {

  // -----State and var------
  const [modalShow, setModalShow] = React.useState(false);

  // ---- --useEffect---------
  useEffect(() => {
    // Add the "car-page" class to the body element when the component mounts
    document.body.classList.add("car-page");
    // Clean up function: Remove the "car-page" class when the component unmounts
    return () => {
      document.body.classList.remove("car-page");
    };
  }, []);
  // ---methods and jsx------

  const popForPinCode = (
    <>
      <div className="">
        <div className="d-flex pincode-wrap">
          <SVG className="location-icon" src={location}></SVG>
          <div className="input-wrap">
            <FloatingLabel
              controlId="floatingPassword"
              label="Pincode"
              className="mb-1 "
            >
              <Form.Control
                type="text"
                placeholder="Pincode"
                className="floating-input"
                onClick={() => setModalShow(true)}
              />
            </FloatingLabel>
            <p className="help-text">No Results Found</p>
          </div>
        </div>
      </div>
    </>
  );
  const popForInsurance = (
    <>
      <div className="">
        <div>
          <div className="member-row">
            <div className="member" >
              <div className="form-floating mb-2">
                <select id="idunique" className="form-select" value="">
                  <option value="petrol">Mother</option>
                  <option value="disel">Father</option>
                </select>
                <label htmlFor="idunique select-label">Relation</label>
              </div>
            </div>
            <div className="member">
              <div>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Age "
                  className="mb-3"
                  aria-autocomplete="off"
                >
                  <Form.Control
                    type="text"
                    placeholder=""
                    className="floating-input"
                    value=""
                  />
                </FloatingLabel>
              </div>
            </div>
            <div className="member">
              <div>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Date of birth "
                  className="mb-3"
                  aria-autocomplete="off"
                >
                  <Form.Control
                    type="date"
                    placeholder=""
                    className="floating-input"
                    value=""
                  />
                </FloatingLabel>
              </div>
            </div>
            <div className="delete-icon-wrap">
              <SVG className="delete-icon" src={deleteIcon} />
            </div>
          </div>
          <div className="text-center mb-3">
            <Button className="add-member-btn">+ OTHER FAMILY MEMBERS</Button>
          </div>
          <div className="text-center">
            <Button className="primary-btn">Submit</Button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <React.Fragment>
      <Container>
        <Row>
          <h4 className="mb-5 mt-5">Find the best Health plan</h4>
          <Col sm={12} md={5}>
            <div>
              <img src={health} alt="" width={"100%"} />
            </div>
          </Col>
          <Col sm={12} md={7}>
            <CountainerForHealth
              popForPinCode={popForPinCode}
              popForInsurance={popForInsurance}
            />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
