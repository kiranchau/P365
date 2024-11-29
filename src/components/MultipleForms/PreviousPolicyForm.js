import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
} from "react-bootstrap";
import ErrorMessage from "../commonModules/ErrorMessage";
import InputFieldDropdown from "../commonModules/InputFieldDropdown";
import InputFieldText from "../commonModules/InputFieldText";
import { convertDate, formikFieldVisibility, sortDropdownOptions } from "../commonModules/CommonCode";
import UseFormContext from "../../../src/context/UseFormContext";
import * as api from "../../API/authCurd"


export default function PreviousPolicyForm(props) {
  const formContext = UseFormContext();
  const [prevPolicyArray, setprevPolicyArray] = useState([]);
  const [policyType, setPolicyType] = useState([
    { value: "", label: "Please Select" },
    { value: "new", label: "New" },
    { value: "renew", label: "Renew" },
  ])
  const [prevPolicyNameArray, setPrevPolicyNameArray] = useState([
    { value: "", label: "Please Select" },
    { value: "comprehensive insurance", label: formContext.carbikeformikValues?.formtype === "bike" ? "Two Wheeler Comprehensive Insurance" : "Four Wheeler Comprehensive Insurance" },
    { value: "standalone OD insurance", label: formContext.carbikeformikValues?.formtype === "bike" ? "Two Wheeler Standalone OD Insurance" : "Four Wheeler Standalone OD Insurance" },
    { value: "standalone TP insurance", label: formContext.carbikeformikValues?.formtype === "bike" ? "Two Wheeler Standalone TP Insurance" : "Four Wheeler Standalone TP Insurance" },
  ])
  // Set initial visibility for formik fields on component mount
  useEffect(() => {
    formikFieldVisibility(["policyNumber", "policyInsuranceName", "PolicyEndtDate", "policyInsuranceNamePrevious", "policyPreviousType","tpPolicyInsuranceName","tpPolicyNumber"], props.formik)
    if (!props?.formik?.values?.policyNumber) {
      defaultValueForFields()
    }
    // api to get pre policy names
    api.getpolicyProviderName(formContext.singleQuotesData?.insuranceCompany).then(data => {
      console.log("data", data)
      // for new india this condtion is required
      if (formContext.singleQuotesData?.insuranceCompany === "New India Assurance") {
        setprevPolicyArray(data?.data?.InsuranceMappingDocuments?.map((mapdata, index) => {
          return { "insurerId": index?.toString(), "insurerName": mapdata.insurerName }
        }))
      }
      else {
        setprevPolicyArray(data?.data?.InsuranceMappingDocuments)

      }
    }).catch(err => { console.log("err", err) })
    sessionStorage.setItem("nextPage","yes")
  }, []);
  useEffect(() => {
    const name = props.formik.values?.policyInsuranceName
    console.log("name", name)
    let uniqueRecord
    if (name) {
      console.log("prevPolicyArray", prevPolicyArray)
      uniqueRecord = prevPolicyArray?.find(item => item.insurerId === name)
      console.log("uniqueRecord", uniqueRecord)
      props.formik.setFieldValue("policyInsuranceId", uniqueRecord?.insurerName)
    }

  }, [props.formik.values?.policyInsuranceName]);
  const defaultValueForFields = () => {
    // const policyEnd = props?.vahanData?.vehicleInsuranceUpto?.split("/")
    const policyEnd1 = props?.quotesPageFormikData?.expiryDate ? convertDate(props?.quotesPageFormikData?.expiryDate, 1) : null
    const policyEnd2 = props?.carbikeformikValues?.previousPolicy
    let finalEndDate = policyEnd1 ? policyEnd1 : policyEnd2
    finalEndDate = finalEndDate?.split("/")

    // vehicleInsuranceUpto: "25/09/2010"
    props.formik.setFieldValue("policyNumber", props?.vahanData?.vehicleInsurancePolicyNumber ? props?.vahanData?.vehicleInsurancePolicyNumber : '')
    props.formik.setFieldValue("policyInsuranceNamePrevious", props?.vahanData?.vehicleInsuranceCompanyName ? props?.vahanData?.vehicleInsuranceCompanyName : "")
    if (finalEndDate) props.formik.setFieldValue("PolicyEndtDate", finalEndDate?.[2] + "-" + finalEndDate?.[1] + "-" + finalEndDate?.[0])
  }
  return (
    <React.Fragment>
      <div>
        <Row>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="policyNumber" placeholder="Policy Number*" formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="policyNumber" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="policyInsuranceName" label="Policy insurance name*" optionsArray={sortDropdownOptions(prevPolicyArray)} formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="policyInsuranceName" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="PolicyEndtDate" placeholder="Policy expiry date*" formik={props.formik} type="date" disabled={true} />
            <ErrorMessage formik={props.formik} fieldValue="PolicyEndtDate" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="policyInsuranceNamePrevious" label="Previous policy name*" optionsArray={prevPolicyNameArray} formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="policyInsuranceNamePrevious" />
          </Col>

          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="policyPreviousType" label="Previous policy type*" optionsArray={policyType} formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="policyPreviousType" />
          </Col>
          {formContext.quotesPageFormikData?.policyType === "OD" && <>
            <Col sm={4} className="mb-4">
              <InputFieldText formikFieldName="tpPolicyNumber" placeholder="Tp policy Number*" formik={props.formik} />
              <ErrorMessage formik={props.formik} fieldValue="tpPolicyNumber" />
            </Col>
            <Col sm={4} className="mb-4">
              <InputFieldDropdown formikFieldName="tpPolicyInsuranceName" label="TP policy Insurer name*" optionsArray={sortDropdownOptions(prevPolicyArray)} formik={props.formik} />
              <ErrorMessage formik={props.formik} fieldValue="tpPolicyInsuranceName" />
            </Col>
          </>}
        </Row>
      </div>
    </React.Fragment>
  );
}
