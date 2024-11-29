import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import ErrorMessage from "../commonModules/ErrorMessage";
import InputFieldDropdown from "../commonModules/InputFieldDropdown";
import InputFieldText from "../commonModules/InputFieldText";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import NotFound from "../../images/not-found.png";

export const MyVerticallyCenteredModal = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="success-modal kyc-modal"
    >
      <div className="check-icon-wrap">
        <img src={NotFound} alt="" style={{ width: "140px" }} />
      </div>
      <h3 className="text-center mt-3 mb-4">KYC Not Found</h3>
      <Modal.Body className="p-0">
        <p className="text-center mt-0">
          Click on below link to proceed with KYC process!
        </p>
      </Modal.Body>
      <Modal.Footer className="modalfooter">
        <Button className="back-btn" style={{ width: 'auto', marginRight: 15 }} onClick={props.onHide}>
          Proceed with KYC
        </Button>
        <Button className="primary-btn" style={{ width: 'auto' }} onClick={props.onHide}>
          Proceed without KYC
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
function Warning(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="success-modal kyc-modal"
    >
      {/* <div className="check-icon-wrap">
        <img src={Done} alt="" style={{ width: "80px" }} />
      </div> */}
      <Modal.Body className="p-0">
        <p className="text-center mt-0">
          (Display warning as per insurer)
        </p>
        <span>KYC is mandatory to get the policy document after payment</span>
      </Modal.Body>
      <Modal.Footer className="modalfooter">
        <Button className="primary-btn" style={{ width: 'auto' }} onClick={props.onHide}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default function KYCForm(props) {
  const [modalShow, setModalShow] = React.useState(false);
  const [warning, setWarning] = React.useState(false);
  const [gender, setGender] = useState([
    { value: "", label: "Please Select Gender" }, // Set the default value to blank
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ]);

  return (
    <React.Fragment>
      <div>
        <Row>
          <Col sm={4} className="mb-4">
            <InputFieldText
              formikFieldName="kycNominePanNumber"
              placeholder="PAN*"
              formik={props.formik}
              capitalize={true}
              maxlength={10}
            />
            <ErrorMessage formik={props.formik} fieldValue="kycNominePanNumber" />
          </Col>

          <Col sm={4} className="mb-4">
            <InputFieldText
              formikFieldName="kycNomineAadharNumber"
              placeholder="Aadhar"
              formik={props.formik}
              onlyNumber={true}
              maxlength={12}
            />
            <ErrorMessage formik={props.formik} fieldValue="kycNomineAadharNumber" />
          </Col>

          <Col sm={4} className="mb-4">
            <InputFieldText
              formikFieldName="kycNomineDob"
              placeholder="Date of birth*"
              formik={props.formik}
              type="date"
            />
            <ErrorMessage formik={props.formik} fieldValue="kycNomineDob" />
          </Col>

          <Col sm={4} className="mb-4">
            <InputFieldDropdown
              formikFieldName="kycNomineGender"
              label="Gender*"
              optionsArray={gender}

              formik={props.formik}
            />
            <ErrorMessage formik={props.formik} fieldValue="kycNomineGender" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText
              formikFieldName="kycNomineFullName"
              placeholder="Full Name (as per Aadhar)"
              formik={props.formik}
            />
            <ErrorMessage formik={props.formik} fieldValue="kycNomineFullName" />
          </Col>
        </Row>
        <Warning
          show={warning}
          onHide={() => setWarning(false)}
        />
      </div>
    </React.Fragment>
  );
}
