import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
} from "react-bootstrap";
import ErrorMessage from "../commonModules/ErrorMessage";
import InputFieldDropdown from "../commonModules/InputFieldDropdown";
import InputFieldText from "../commonModules/InputFieldText";
import { formikFieldVisibility } from "../commonModules/CommonCode";

export default function Benefits(props) {

  const [relation, setRelation] = useState([
    { value: "", label: "Please Select" }, // Set the default value to blank
    { value: "mother", label: "Mother" },
    { value: "father", label: "Father" },
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "spouse", label: "Spouse" },

  ]);

  // useEffect to set initial visibility of formik fields for nominee information
  useEffect(() => {
    formikFieldVisibility(["nomineFirstName", "nomineLastName", "nomineDob", "nomineRelation"], props.formik)
    sessionStorage.setItem("nextPage","yes")
  }, []);

  return (
    <React.Fragment>
      <div>
        <Row>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="nomineFirstName" placeholder="First name*" formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="nomineFirstName" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="nomineLastName" placeholder="Last Name*" formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="nomineLastName" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="nomineDob" placeholder="Date of birth*" formik={props.formik} type="date" />
            <ErrorMessage formik={props.formik} fieldValue="nomineDob" />
          </Col>

          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="nomineRelation" label="Relation*" optionsArray={relation}
              formik={props.formik} />
          </Col>
          <ErrorMessage formik={props.formik} fieldValue="nomineRelation" />
        </Row>
      </div>
    </React.Fragment>
  );
}
