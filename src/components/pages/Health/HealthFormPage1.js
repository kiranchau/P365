import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import VerticallyCenteredModal from "../../commonModules/Popups/VerticallyCenteredModal";
import InputFieldText from "../../commonModules/InputFieldText";
import InputFieldDropdown from "../../commonModules/InputFieldDropdown";

import ErrorMessage from "../../commonModules/ErrorMessage";

export default function HealthFormPage1(props) {

  const [modalShow, setModalShow] = React.useState(false);
  const [InsurancemodalShow, SetInsurancemodalShow] = React.useState(false);

  return (
    <Form as="div" className="form-bg">
      <Row>
        <Col md={6} sm={12}>
          <InputFieldDropdown formikFieldName="gender" label="Gender" optionsArray={[{ value: "male", label: "Male" }, { value: "female", label: "Female" },]} formik={props.formik} />
        </Col>

        <Col md={6} sm={12}>
          <InputFieldDropdown formikFieldName="existanceIllness" label="Existing illness" optionsArray={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" },]} formik={props.formik} />
        </Col>

        <Col md={6} sm={12}>
          <InputFieldDropdown formikFieldName="hospitalLimit" label="Hospital Limit" optionsArray={[{ value: "2", label: "2 Lac" }, { value: "4", label: "4 Lac" },]} formik={props.formik} />
        </Col>

        <Col md={6} sm={12}>
          <InputFieldText formikFieldName="pincode" placeholder="Pincode [Change]" formik={props.formik} showPopup={() => { setModalShow(true) }} />
          <VerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            heading="Enter Area or City or Pincode"
          >
            {props.popForPinCode}
          </VerticallyCenteredModal>
          <ErrorMessage formik={props.formik} fieldValue="pincode" />
        </Col>

        <Col sm={12}>
          <Row>
            <Col md={12} sm={12}>
              <div className="health-input" >
                <p className="text-left-align">Health Insure for <span className="change-member" onClick={() => SetInsurancemodalShow(true)}>[Change]</span></p>
                <div className="insuranceFor">
                  <p className="text-left-align font-weight-bold">Self - Male - 28 Years</p>
                  <p className="text-left-align font-weight-bold">Mother - Female - 48 Years</p>
                </div>
              </div>
              <InputFieldText formikFieldName="healthInsurefor" placeholder="Health Insure for" formik={props.formik} showPopup={() => { SetInsurancemodalShow(true) }} />
              <VerticallyCenteredModal
                show={InsurancemodalShow}
                onHide={() => SetInsurancemodalShow(false)}
                heading="Add your family members"
              >
                {props.popForInsurance}
              </VerticallyCenteredModal>
              <ErrorMessage formik={props.formik} fieldValue="healthInsurefor" />
            </Col>
          </Row>
        </Col>
      </Row >
    </Form >
  )
}