import React, { useEffect, useState } from "react";
import { Row, Col, } from "react-bootstrap";
import ErrorMessage from "../commonModules/ErrorMessage";
import InputFieldDropdown from "../commonModules/InputFieldDropdown";
import InputFieldText from "../commonModules/InputFieldText";
import InputFieldCheckBox from "../commonModules/InputFieldCheckBox";
import { formikFieldVisibility, getYearDropdown } from "../commonModules/CommonCode";
import UseFormContext from "../../../src/context/UseFormContext";
import AutoSuggestFilePropsal from "../commonModules/AutoSuggestFilePropsal"
import * as api from "../../API/authCurd"

export default function InsuredVehical(props) {
  const formContext = UseFormContext();
  const [ManufacturingDateArray, setManufacturingDateArray] = useState(getYearDropdown(20));
  const [bikePurchaseOrLoan, setBikePurchaseOrLoan] = useState([
    { value: "", label: "Please Select" }, // Set the default value to blank
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ]);

  const [puc, setPuc] = useState([
    { value: "", label: "Please Select" }, // Set the default value to blank
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ]);

  // useEffect to initialize visibility settings for specific form fields using formik
  useEffect(() => {
    formikFieldVisibility(["vehicalMakeModel", "vehicalRegistionDate", "vehicalManufaDate", "vehicalPurchaseLoan", "vehicalTermAccept", "engineNumber", "chassisNumber", "registeredRto"], props.formik)
    if (!props?.formik?.values?.vehicalMakeModel) {
      defaultValueForFields()
    }

  }, []);
  useEffect(() => {
    // to set loanFinancer list
    api.loanFinancer()
      .then(response => {
        const jsonData = JSON.parse(response?.data)
        // console.log("Loan Financer api Response in JSON format:", jsonData?.data);
        if (jsonData?.data) {
          formContext.setlistOfFiniance(jsonData?.data)
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }, []);

  const defaultValueForFields = () => {
   
    const registeredRto = props?.quotesPageFormikData?.registeredRto ? props?.quotesPageFormikData?.registeredRto : props?.carbikeformikValues?.registeredRto
    if (props?.carbikeformikValues?.insuranceFor === "new") {
      props.formik.setFieldValue("vehicalManufaDate", props?.quotesPageFormikData?.registrationYear ? props?.quotesPageFormikData?.registrationYear : props?.carbikeformikValues?.registrationYear)
    }
    let vehicleNumber="New"
    if(formContext.singleQuotesData?.insuranceCompany === "GO DIGIT General Insurance CO. LTD"){
      vehicleNumber=registeredRto
    }
    props.formik.setFieldValue("registeredRto", `${(formContext.isvehNumberMissing && props?.carbikeformikValues?.insuranceFor === "new") ? vehicleNumber : registeredRto}`)
    props.formik.setFieldValue("vehicalMakeModel", props?.singleQuotesData?.carrierVariantDisplayName ? props?.singleQuotesData?.carrierVariantDisplayName : "")
    props.formik.setFieldValue("vehicalRegistionDate", props?.quotesPageFormikData?.registrationYear ? props?.quotesPageFormikData?.registrationYear : props?.carbikeformikValues?.registrationYear)
    props.formik.setFieldValue("chassisNumber", props?.vahanData?.chassis ? props?.vahanData?.chassis : "")
    props.formik.setFieldValue("engineNumber", props?.vahanData?.engine ? props?.vahanData?.engine : "")
  }

  useEffect(() => {
    if (props.formik.values.vehicalPurchaseLoan === "no") {
      props.formik.setFieldValue("vehicalFinancierName", "")
    }
  }, [props.formik.values.vehicalPurchaseLoan]);

  useEffect(() => {
    if (props.formik.values?.vehicalFinancierName?.length > 3) {
      props.formik.setFieldValue("financierNameValidaton", "yes")
      const specificItem = formContext.listOfFiniance.find((item) => item?.financierName?.toLowerCase() === props.formik.values?.vehicalFinancierName?.toLowerCase());
      if (specificItem?.financierName) {
        props.formik.setFieldValue("financierID", specificItem?.financerId)
        setTimeout(() => {
          props.formik.setFieldValue("financierName", specificItem?.financierName)
        }, 2000);

      } else {
        props.formik.setFieldValue("financierID", "")
        props.formik.setFieldValue("financierName", "")

      }
    } else {
      props.formik.setFieldValue("financierNameValidaton", "no")
    }
  }, [props.formik.values.vehicalFinancierName]);

  return (
    <React.Fragment>
      <div>
        <Row>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="vehicalMakeModel" placeholder="Make and model*" formik={props.formik} disabled={true} />
            <ErrorMessage formik={props.formik} fieldValue="vehicalMakeModel" />
          </Col>
          {props?.carbikeformikValues?.insuranceFor === "renew" && <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="vehicalRegistionDate" placeholder="Registration date*" formik={props.formik} type="date" disabled={true} />
            <ErrorMessage formik={props.formik} fieldValue="vehicalRegistionDate" />
          </Col>}
          <Col sm={4} className="mb-4">
            <InputFieldDropdown
              formikFieldName="vehicalManufaDate"
              label="Manufacturing Year*"
              optionsArray={ManufacturingDateArray}
              formik={props.formik}
              disabled={props?.carbikeformikValues?.insuranceFor === "new"}
            />
            <ErrorMessage formik={props.formik} fieldValue="vehicalManufaDate" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="vehicalPurchaseLoan" label={formContext.carbikeformikValues?.formtype === "bike" ? "Bike purchased on loan*" : "Car purchased on loan*"} optionsArray={bikePurchaseOrLoan} formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="vehicalPurchaseLoan" />
          </Col>
          {props.formik.values?.vehicalPurchaseLoan === "yes" && <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="vehicalFinancierName" placeholder="Financier Name *" formik={props.formik} />
            <AutoSuggestFilePropsal filteredData={formContext.financierNamesArray} formik={props.formik} formikFieldName="vehicalFinancierName" formContext={formContext} />
            <ErrorMessage formik={props.formik} fieldValue="vehicalFinancierName" />
            <ErrorMessage formik={props.formik} fieldValue="financierID" />
          </Col>}
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="chassisNumber" placeholder="Chassis Number*" formik={props.formik} capitalize={true} />
            <ErrorMessage formik={props.formik} fieldValue="chassisNumber" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="engineNumber" placeholder="Engine Number*" formik={props.formik} capitalize={true} />
            <ErrorMessage formik={props.formik} fieldValue="engineNumber" />
          </Col> <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="registeredRto" placeholder="Vehicle Registration Number*" formik={props.formik} capitalize={true}
            />
            <ErrorMessage formik={props.formik} fieldValue="registeredRto" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="puc" label="Do you have PUC" optionsArray={puc} formik={props.formik}
            />
            <ErrorMessage formik={props.formik} fieldValue="puc" />
          </Col>

          <Col sm={12} className="mb-4">
            <InputFieldCheckBox formik={props.formik} formikFieldName="vehicalTermAccept" label="I confirm that information provided above is true . I am also aware of the impact on claims and other benifits 
              of the new insurance policy due to false information .I authorize Policy365 to share these details with insurance companies and represent with insurer for any insurance needs." />
            <ErrorMessage formik={props.formik} fieldValue="vehicalTermAccept" />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
}
