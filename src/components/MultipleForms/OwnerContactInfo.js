/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
} from "react-bootstrap";
import ErrorMessage from "../commonModules/ErrorMessage";
import InputFieldDropdown from "../commonModules/InputFieldDropdown";
import InputFieldText from "../commonModules/InputFieldText";
import { formikFieldVisibility } from "../commonModules/CommonCode";
import UseFormContext from "../../context/UseFormContext";

export default function OwnerContactInfo(props) {
  const formContext = UseFormContext();

  const [gender, setGender] = useState([
    { value: "", label: "Please Select Gender" }, // Set the default value to blank
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ]);

  const [maritalStatus, setMaritalStatus] = useState([
    { value: "", label: "Please Select" }, // Set the default value to blank
    { value: "married", label: "Married" },
    { value: "single", label: "Single" },
  ])

  // UseEffect to initialize the visibility of formik fields for the owner's information.
  // It sets the initial visibility state for the specified fields in the formik configuration.
  // This effect runs once when the component mounts.
  useEffect(() => {
    formikFieldVisibility(["ownerPrefix", "ownerFirstName", "ownerLastName", "ownerEmail", "ownerPhoneNumber", "ownerDob", "kycNomineGender", "ownerMaritialStus", "ownerGstin"], props.formik)
    if (!props?.formik?.values?.ownerEmail) {
      defaultValueForFields()
    }
  }, []);

  const defaultValueForFields = () => {
    // kyc data for fields
    if (formContext.kycApiRes) {
      if (formContext.carrierName === "future") {
        const fullName = formContext?.kycApiRes?.customer_name?.split(" ")
        const prefix=formContext.kycApiRes?.prefix
        props.formik.setFieldValue("kycNomineGender", `${formContext.kycApiRes?.gender === "M" ? "male" : "female"}`);
        props.formik.setFieldValue("ownerPrefix", prefix ?prefix.charAt(0).toUpperCase()+prefix.slice(1).toLowerCase() : "");
        props.formik.setFieldValue("ownerFirstName", fullName?.[1]);
        props.formik.setFieldValue("ownerLastName", fullName?.[3]);
        props.formik.setFieldValue("ownerPhoneNumber", formContext.kycApiRes?.mobile ? formContext.kycApiRes?.mobile : "");
        props.formik.setFieldValue("ownerEmail", formContext.kycApiRes?.email ? formContext.kycApiRes?.email : "");
      }
      if (formContext.carrierName === "reliance") {
        const nestedData = formContext?.kycApiRes?.kyc_data?.CKYC?.result?.PERSONAL_DETAILS
        const fullName = formContext?.kycApiRes?.kyc_data?.CKYC?.result?.PERSONAL_DETAILS?.FULLNAME.split(" ")
        const prefix=nestedData?.PREFIX

        props.formik.setFieldValue("kycNomineGender", `${nestedData?.GENDER === "M" ? "male" : "female"}`);
        props.formik.setFieldValue("ownerPrefix",prefix ?prefix.charAt(0).toUpperCase()+prefix.slice(1).toLowerCase() : "");
        props.formik.setFieldValue("ownerFirstName", fullName?.[1]);
        props.formik.setFieldValue("ownerLastName", fullName?.[3]);
        props.formik.setFieldValue("ownerPhoneNumber", nestedData?.MOB_NUM ? nestedData?.MOB_NUM : "");
        props.formik.setFieldValue("ownerEmail", nestedData?.EMAIL ? nestedData?.EMAIL : "");
      }
      if (formContext.carrierName === "newindia") {
        const fullName = formContext?.kycApiRes?.customerName.split(" ")
        const prefix=formContext.kycApiRes?.namePrefix
        props.formik.setFieldValue("kycNomineGender", `${formContext.kycApiRes?.gender === "M" ? "male" : "female"}`);
        props.formik.setFieldValue("ownerPrefix", prefix ?prefix.charAt(0).toUpperCase()+prefix.slice(1).toLowerCase() : "");
        props.formik.setFieldValue("ownerFirstName", fullName?.[1]);
        props.formik.setFieldValue("ownerLastName", fullName?.[3]);
        props.formik.setFieldValue("ownerPhoneNumber", formContext.kycApiRes?.mobileNo ? formContext.kycApiRes?.mobileNo : "");
        props.formik.setFieldValue("ownerEmail", formContext.kycApiRes?.emailid ? formContext.kycApiRes?.emailid : "");
      }

      if (formContext.carrierName === "icici") {
        const fullName = formContext?.kycApiRes?.full_name.split(" ")
        const prefix=formContext?.kycApiRes?.full_name.split(" ")?.[0]
        props.formik.setFieldValue("kycNomineGender", `${formContext.kycApiRes?.gender === "M" ? "male" : "female"}`);
        props.formik.setFieldValue("ownerPrefix", prefix ?prefix.charAt(0).toUpperCase()+prefix.slice(1).toLowerCase() : "");
        props.formik.setFieldValue("ownerFirstName", fullName?.[1]);
        props.formik.setFieldValue("ownerLastName", fullName?.[3]);
        props.formik.setFieldValue("ownerPhoneNumber", formContext.kycApiRes?.mobile_number ? formContext.kycApiRes?.mobile_number : "");
        props.formik.setFieldValue("ownerEmail", formContext.kycApiRes?.email ? formContext.kycApiRes?.email : "");
      }



    } else {
      props.formik.setFieldValue("ownerEmail", props.carbikeformikValues?.email ? props.carbikeformikValues?.email : "")
      props.formik.setFieldValue("ownerFirstName", props.carbikeformikValues?.firstName ? props.carbikeformikValues?.firstName : "")
      props.formik.setFieldValue("ownerLastName", props.carbikeformikValues?.lastName ? props.carbikeformikValues?.lastName : "")
      props.formik.setFieldValue("ownerPhoneNumber", props.carbikeformikValues?.phoneNumber ? props.carbikeformikValues?.phoneNumber : "")

    }

  }


  return (
    <React.Fragment>
      <div>
        <Row>
          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="ownerPrefix" label="Prefix*" optionsArray={[{ value: "", label: "Please Select" }, { value: "Mr", label: "Mr" }, { value: "Mrs", label: "Mrs" }, { value: "Miss", label: "Miss" }]} formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="ownerPrefix" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerFirstName" placeholder="First name*" formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="ownerFirstName" />
          </Col>

          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerLastName" placeholder="Last Name*" formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="ownerLastName" />
          </Col>

          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerEmail" placeholder="Email id*" formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="ownerEmail" />
          </Col>

          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerPhoneNumber" placeholder="Mobile number*" formik={props.formik} onlyNumber={true}
            />
            <ErrorMessage formik={props.formik} fieldValue="ownerPhoneNumber" />
          </Col>

          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="kycNomineDob" placeholder="Date of birth*" formik={props.formik} type="date" disabled={true}
            />
            <ErrorMessage formik={props.formik} fieldValue="kycNomineDob" />
          </Col>

          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="kycNomineGender" label="Gender*" optionsArray={gender} formik={props.formik} disabled={true} />
            <ErrorMessage formik={props.formik} fieldValue="kycNomineGender" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="ownerMaritialStus" label="Marital status*" optionsArray={maritalStatus} formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="ownerMaritialStus" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerGstin" placeholder="GSTIN" formik={props.formik} maxlength={15} />
            <ErrorMessage formik={props.formik} fieldValue="ownerGstin" />
          </Col>

        </Row>
      </div>
    </React.Fragment>
  );
}
