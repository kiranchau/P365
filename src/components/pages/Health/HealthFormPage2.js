/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ErrorMessage from "../../commonModules/ErrorMessage";
import InputFieldText from "../../commonModules/InputFieldText";
import { formikFieldVisibility } from "../../commonModules/CommonCode";

export default function HealthFormPage2(props) {

  // UseEffect to set the initial visibility of form fields specified in the array for the given Formik instance.
  useEffect(() => {
    formikFieldVisibility(["firstName", "lastName", "email", "phoneNumber"], props.formik)
  }, []);

  return (
    <Form className="form-bg">
      <Row>
        <Col md={6} sm={12} className="mb-3">
          <InputFieldText formikFieldName="firstName" placeholder="First name*" formik={props.formik} />
          <ErrorMessage formik={props.formik} fieldValue="firstName" />
        </Col>
        <Col md={6} sm={12} className="mb-3">
          <InputFieldText formikFieldName="lastName" placeholder="Last Name*" formik={props.formik} />
          <ErrorMessage formik={props.formik} fieldValue="lastName" />
        </Col>
        <Col md={6} sm={12} className="mb-3">
          <InputFieldText formikFieldName="email" placeholder="Email id*" formik={props.formik} />
          <ErrorMessage formik={props.formik} fieldValue="email" />
        </Col>
        <Col md={6} sm={12} className="mb-3">
          <InputFieldText formikFieldName="phoneNumber" placeholder="Phone number*" formik={props.formik} />
          <ErrorMessage formik={props.formik} fieldValue="phoneNumber" />
        </Col>
      </Row>
    </Form>
  )
}