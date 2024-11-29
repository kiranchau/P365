/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ErrorMessage from "../../commonModules/ErrorMessage";
import InputFieldText from "../../commonModules/InputFieldText";
import { formikFieldVisibility } from "../../commonModules/CommonCode";
var CryptoJS = require("crypto-js");

export default function BikeFormPersonDetails(props) {
  const userLogin = sessionStorage.getItem('userLoggin');

  // useEffect to set initial visibility for form fields
  useEffect(() => {
    // Function to set visibility for specified form fields
    formikFieldVisibility(["firstName", "lastName", "email", "phoneNumber"], props.formik)
    if (userLogin) {
      var bytes = CryptoJS.AES.decrypt(userLogin, 'dynamipass');
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      props.formik.setFieldValue("phoneNumber", decryptedData)
    }
  }, []);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [])

  return (
    <Form className="form-bg">
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
            placeholder="Last Name*"
            formik={props.formik}
          />
          <ErrorMessage formik={props.formik} fieldValue="lastName" />
        </Col>
        <Col md={6} sm={12} className="mb-3">
          <InputFieldText
            formikFieldName="email"
            placeholder="Email*"
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
            disabled={userLogin?true:false}
          />
          <ErrorMessage formik={props.formik} fieldValue="phoneNumber" />
        </Col>
      </Row>
    </Form>
  );
}
