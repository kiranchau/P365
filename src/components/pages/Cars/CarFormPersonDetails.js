/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ErrorMessage from "../../commonModules/ErrorMessage";
import InputFieldText from "../../commonModules/InputFieldText";
import { formikFieldVisibility } from "../../commonModules/CommonCode";


export default function CarFormPersonDetails(props) {

  // UseEffect hook to handle initial setup for form field visibility
  useEffect(() => {
    formikFieldVisibility(["firstName", "lastName", "email", "phoneNumber"], props.formik)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, []);

  return (
    <Form as="div" className="form-bg">
      <Row>
        <Col md={6} sm={12} className="mb-3">
          <InputFieldText
            formikFieldName="firstName"
            placeholder="First name*"
            formik={props.formik}
          />
          <ErrorMessage formik={props.formik} fieldValue="firstName" />
        </Col>
        <Col md={6} sm={12} className="mb-3">
          <InputFieldText
            formikFieldName="lastName"
            placeholder="Last name*"
            formik={props.formik}
          />
          <ErrorMessage formik={props.formik} fieldValue="lastName" />
        </Col>
        <Col md={6} sm={12} className="mb-3">
          <InputFieldText
            formikFieldName="email"
            placeholder="Email Id*"
            formik={props.formik}
          />
          <ErrorMessage formik={props.formik} fieldValue="email" />
        </Col>
        <Col md={6} sm={12} className="mb-3">
          <InputFieldText
            formikFieldName="phoneNumber"
            placeholder="Phone Number*"
            formik={props.formik}
            onlyNumber={true}

          />
          <ErrorMessage formik={props.formik} fieldValue="phoneNumber" />
        </Col>
      </Row>
    </Form>
  );
}
