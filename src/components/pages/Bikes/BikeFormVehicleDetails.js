/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import clear from "../../../../src/images/clear.svg";
import SVG from "react-inlinesvg";
import VerticallyCenteredModal from "../../commonModules/Popups/VerticallyCenteredModal";
import ErrorMessage from "../../commonModules/ErrorMessage";
import InputFieldText from "../../commonModules/InputFieldText";
import InputFieldDropdown from "../../commonModules/InputFieldDropdown";
import UseFormContext from "../../../context/UseFormContext";
import InputFieldRadio from "../../commonModules/InputFieldRadio";
import * as api from "../../../API/authCurd"
import { VehicalNotFoundModal, CarPolicy } from "../../commonModules/Popups/PopupPages"
import InputFieldTextRTO from "../../commonModules/InputFieldTextRTO";
import { expDateValidation, convertDate, DateConvertFunction, dateCompare, getYearDropdown } from "../../commonModules/CommonCode"
import { Button } from "react-bootstrap";
import AutoSuggestFile from "../../commonModules/AutoSuggestFile"
export default function BikeFormVehicleDetails(props) {
  const formContext = UseFormContext();
  const registeredRtoInputRef = useRef(null);
  const [isTextVisible, setIsTextVisible] = React.useState(true);
  const [vechicleInfoFromRto, setvechicleInfoFromRto] = useState();
  const [carPolicy, setCarPolicy] = React.useState(false);
  const [vehicalNotFound, setVehicalNotFound] = React.useState(false);
  const valuesForExpDate = expDateValidation()
  const [optArrayForPolicyExp, setoptArrayForPolicyExp] = useState(valuesForExpDate?.optionsArray);
  const [tpPolicyStatus, settpPolicyStatus] = useState(false);
  const [errorForOdPopup, seterrorForOdPopup] = useState(false);
  const [errorMessageForOdPopup, seterrorMessageForOdPopup] = useState("");
  const [ManufacturingDateArray, setManufacturingDateArray] = useState(getYearDropdown);
  const [makeModelFilterdData, setmakeModelFilterdData] = useState();
  const [InsuranceFor, setInsuranceFor] = useState([
    { value: "", label: "Please Select" },
    { value: "new", label: "Insure New Bike" },
    { value: "renew", label: "Renew Existing Policy", },
  ]);

  const policyType = [
    {
      value: "OD-TP",
      label: "Comprehensive",
      OverlayTriggerValue:
        "Covers damages to own vehicle and third party",
    },
    {
      value: "OD",
      label: "OD Only",
      OverlayTriggerValue:
        "Covers damages to own vehicle only",
    },
    {
      value: "TP",
      label: "TP Only",
      OverlayTriggerValue:
        "Covers damage to the third-party vehicle, personal property and physical injury",
    },
  ]
  const [arrayForPolicyType, setarrayForPolicyType] = useState(policyType);

  useEffect(() => {
    // Set a timeout to fetch data after 2000 milliseconds
    const getData = setTimeout(() => {
      // Check if the vehicle registration number is valid and certain conditions are met
      if (props.formik.values.registeredRto?.length > 9 && formContext.rtoData?.userId && !isTextVisible) {
        formContext.setloaderStatus(true);
        // Fetch data from the RTO API
        api.rtoGetData(formContext.rtoData?.userId, formContext.rtoData?.id, props.formik.values.registeredRto).then(
          (response) => {
            console.log("response", response)
            // Set vehicle information obtained from the RTO
            setvechicleInfoFromRto(response.data.result)
            // Check if the vehicle category is not "2WN" (2-wheeler)
            formContext.setvahanData(response.data.result)
            if (response?.data?.result?.vehicleCategory !== "2WN") {
              // Set a flag indicating that it's a car policy
              setCarPolicy(true)
            }
            formContext.setloaderStatus(false);
          }
        ).catch(err => {
          console.log("err", err);
          if (err?.response?.data?.error?.message === "Vehicle Number is not valid") {
            setVehicalNotFound(true)
          } else {
            formContext.notifyError("Could not found data for vechicle")
          }
        }).finally(() => {
          formContext.setloaderStatus(false);
        });
      } else if (
        props.formik.values.registeredRto?.length > 9 &&
        !formContext.rtoData?.userId
      ) {
        formContext.setLoginData();
        // Update the registeredRto field in the formik values
        props.formik.setFieldValue(
          "registeredRto",
          props.formik.values.registeredRto
        );
        formContext.setloaderStatus(false);
      }
    }, 2000);

    // Cleanup function to clear the timeout when the component unmounts or when the dependency changes
    return () => clearTimeout(getData);
  }, [props.formik.values.registeredRto]);



  useEffect(() => {
    formContext?.setselectedRto("")
    formContext.makeModelApi("BikeVariants")
    sessionStorage.removeItem('isPageRefreshed');
  }, []);
  useEffect(() => {
    if (formContext.selectedRto?.length > 0) {
      props.formik.setFieldValue("registeredRto", formContext.selectedRto)
      formContext.setselectedRto("")
    }
  }, [formContext.selectedRto]);

  useEffect(() => {
    if (vechicleInfoFromRto?.model) {
      const ownerName = vechicleInfoFromRto.owner.split(" ")
      const regDate = vechicleInfoFromRto.regDate.split("/")
      props.formik.setFieldValue("fuel", vechicleInfoFromRto.type)
      props.formik.setFieldValue("firstName", ownerName[1])
      props.formik.setFieldValue("lastName", ownerName[0])
      props.formik.setFieldValue("registrationYear", regDate[2] + "-" + regDate[1] + "-" + regDate[0])
      handlePolicyExpDate(vechicleInfoFromRto?.vehicleInsuranceUpto)
    }
  }, [vechicleInfoFromRto]);
  // to bind make model varient
  useEffect(() => {
    if (vechicleInfoFromRto?.model) {
      const uniqueID = vechicleInfoFromRto?.mappings?.variantIds.find(data => data.score === 1)
      api.vahanDataCounch(uniqueID?.variantId).then(res => {
        console.log("vahan data counch", res?.data?.data)
        if (res?.data?.data) {
          props.formik.setFieldValue("make", res?.data?.data?.make)
          props.formik.setFieldValue("model", res?.data?.data?.model)
          props.formik.setFieldValue("varient", res?.data?.data?.variant)
        }
      }).catch(err => console.log("errr", err))
    }

  }, [vechicleInfoFromRto]);

  useEffect(() => {
    if (props?.formik?.values?.policyType === "OD") {
      settpPolicyStatus(true)
    } else {
      props.formik.setFieldValue("tpPolicyStartDate", "")
      props.formik.setFieldValue("tpPolicyEndtDate", "")

    }

  }, [props?.formik?.values?.policyType]);
  useEffect(() => {
    props.formik.setFieldValue("isTextVisible", isTextVisible)
  }, [isTextVisible]);
  // to clear tp values when register year changes
  useEffect(() => {
    if (props.formik.values?.policyType === "OD") {
      // props.formik.setFieldValue("tpPolicyStartDate", "")
      // props.formik.setFieldValue("tpPolicyEndtDate", "")
      props.formik.setFieldValue("policyType", "")
    }
  }, [props.formik.values.registrationYear]);
  useEffect(() => {
    if (props.formik.values?.insuranceFor==="new") {
      props?.formik.setFieldValue("policyTerms", 3)
      setarrayForPolicyType(policyType.filter((task) => task.label === "Comprehensive"))
    } else {
      setarrayForPolicyType(policyType)
    }
  }, [props.formik.values?.insuranceFor]);

  const handlePolicyExpDate = (vehicleInsuranceUpto) => {
    const convDate = convertDate(vehicleInsuranceUpto, 2)
    var vahanDate = new Date(convDate)
    if (vahanDate < valuesForExpDate?.priorDate) {
      props.formik.setFieldValue("previousPolicy", DateConvertFunction(valuesForExpDate?.priorDate, 13))
    } else if (vahanDate > valuesForExpDate?.priorDate && vahanDate < valuesForExpDate?.today) {
      props.formik.setFieldValue("previousPolicy", DateConvertFunction(valuesForExpDate?.priorDateSub, 13))
    }
    else if (vahanDate > valuesForExpDate?.today) {
      props.formik.setFieldValue("previousPolicy", valuesForExpDate?.todayConvertedValue)
    }
  }

  const dropdownChange = (e, fieldname) => {
    // Reset the selected RTO number
    formContext?.setselectedRto("");
    // Reset all form values when insuranceFor is changed
    if (props.formik.values.insuranceFor?.length > 0) {
      props.formik.setValues({
        ...props.formik.initialValues,
        insuranceFor: props.formik.values.insuranceFor, // Preserve the insuranceFor value
      });
    }
    props.formik.setFieldValue(fieldname, e)
    // to hide policy type if new one is selected
    if (e === "new") {
      props?.formik.setFieldValue("policyTerms", 3)
      setarrayForPolicyType(policyType.filter((task) => task.label === "Comprehensive"))
    } else {
      setarrayForPolicyType(policyType)
    }
  }
  
  const handleSpanClick = () => {
    setIsTextVisible(predata => !isTextVisible);
    formContext.setisvehNumberMissing(!formContext.isvehNumberMissing)
    props.formik.setFieldValue("isvehNumberMissing", !formContext.isvehNumberMissing)
    if (isTextVisible) {
      registeredRtoInputRef.current.focus();
    } else {
      formContext.setModalShow(true);
    }
  };
  const odPopupClose = (type) => {
    if (!props?.formik?.values?.tpPolicyEndtDate || !props?.formik?.values?.tpPolicyStartDate) {
    }
    if (type === 1) {
      props.formik.setFieldValue("policyType", "")
      props.formik.setFieldValue("tpPolicyEndtDate", "")
      props.formik.setFieldValue("tpPolicyStartDate", "")
      seterrorForOdPopup(false)

    } else {
      const { properDates, dateValid, isFutureDate, policyStartAge, policyEndAge, validRegYear, dateshouldGreaterThanReg,isvalidEndDate } = dateCompare(props.formik?.values?.tpPolicyStartDate, props.formik?.values?.tpPolicyEndtDate, props.formik.values?.registrationYear, props.formik.values?.formtype)
      if (validRegYear?.length < 2) {
        setErrorMessage("Please first select  registration year")
        return
      }
      if (dateValid?.length < 2) {
        setErrorMessage("start date and end date are required")
        return
      }
      if (!properDates) {
        setErrorMessage("Start date should be smaller than end date")
        return
      }
      if (isFutureDate) {
        setErrorMessage("Future dates are not")
        return
      }
      if (policyEndAge) {
        setErrorMessage("End date should be greater than  registration date")
        return
      }
      if (!policyStartAge) {
        setErrorMessage("Policy end date should be with in five year from Policy start date")
        return
      }
      if (!dateshouldGreaterThanReg) {
        setErrorMessage("Policy Start date should be greater than vehicle registration date")
        return
      }
      if (!isvalidEndDate) {
        setErrorMessage("Policy End date should be greater than current date")
        return
      }
    }
    settpPolicyStatus(false)
    seterrorForOdPopup(false)
  }

  const setErrorMessage = (message) => {
    seterrorMessageForOdPopup(message)
    seterrorForOdPopup(true)
  }

  const popForOd = (
    <>
      <Form>
        <div className="inner-form">
          <InputFieldText
            formikFieldName="tpPolicyStartDate"
            placeholder="TP Policy Start Date "
            formik={props.formik}
            type="date"
          />
          <InputFieldText
            formikFieldName="tpPolicyEndtDate"
            placeholder="TP Policy End Date "
            formik={props.formik}
            type="date"
          />
          {errorForOdPopup && <div style={{ color: "red" }}>
            {errorMessageForOdPopup}
          </div>
          }
          <div className="text-center">
            <Button className="back-btn" onClick={() => { odPopupClose(1) }}>Cancel</Button>
            <Button className="primary-btn" onClick={() => { odPopupClose(2) }}>Save</Button>
          </div>
        </div>
      </Form>
    </>
  );
  return (
    <Form className="form-bg">

      <Row>
        <Col md={6} sm={12} className=" mb-4">
          <InputFieldDropdown
            formikFieldName="insuranceFor"
            label="Insurance For"
            optionsArray={InsuranceFor}
            formik={props.formik}
            dropdownChange={dropdownChange}
          />
          <ErrorMessage formik={props.formik} fieldValue="insuranceFor" />

        </Col>
        <Col md={6} sm={12} className="mb-3">
          <div className="addlink">
            {formContext.loaderStatus && (
              <span>{formContext.spinner}</span>
            )}
          </div>
          <InputFieldTextRTO
            isTextVisible={isTextVisible}
            handleSpanClick={handleSpanClick}
            formikFieldName="registeredRto"
            label="Insurance for"
            placeholder="MH01AAXXXX"
            formik={props.formik}
            showPopup={() => {
              if (isTextVisible) {
                formContext.setModalShow(true);
                registeredRtoInputRef.current.blur();
              }
            }}
            inputRef={registeredRtoInputRef}
            capitalize={true}
          />
          <VerticallyCenteredModal
            show={formContext.modalShow}
            onHide={() => formContext.setModalShow(false)}
            heading="Let's locate your registration office"
          >
            {formContext.popupForRto}
          </VerticallyCenteredModal>
          <ErrorMessage formik={props.formik} fieldValue="registeredRto" />
        </Col>
        <Col md={12} sm={12} className="mb-3">
          <InputFieldText
            formikFieldName="make"
            placeholder="Make*"
            formik={props.formik}
            capitalize={true}
            autoComplete="off"
          >
            {props.formik.values.make.length > 0 && (
              <SVG
                src={clear}
                className="clear-icon"
                fill="red"
                onClick={(e) => props.clearIcon("make")}
              />
            )}
          </InputFieldText>
          <AutoSuggestFile filteredData={formContext.makeFilterData} formik={props.formik} formikFieldName="make" formContext={formContext} />
          <ErrorMessage formik={props.formik} fieldValue="make" />
        </Col>
        <Col md={12} sm={12} className="mb-3">
          <InputFieldText
            formikFieldName="model"
            placeholder="Model*"
            formik={props.formik}
            capitalize={true}
            autoComplete="off"
          >
            {props.formik.values.model.length > 0 && (
              <SVG
                src={clear}
                className="clear-icon"
                fill="red"
                onClick={(e) => props.clearIcon("model")}
              />
            )}
          </InputFieldText>
          <AutoSuggestFile filteredData={formContext.modelFilterData} formik={props.formik} formikFieldName="model" formContext={formContext} />
          <ErrorMessage formik={props.formik} fieldValue="model" />
        </Col>
        <Col md={12} sm={6} className="mb-4">
          <InputFieldText
            formikFieldName="varient"
            placeholder="Variant*"
            formik={props.formik}
            capitalize={true}
            autoComplete="off"

          >
            {props.formik.values.varient.length > 0 && (
              <SVG
                src={clear}
                className="clear-icon"
                fill="red"
                onClick={(e) => props.clearIcon("varient")}
              />
            )}
          </InputFieldText>
          <AutoSuggestFile filteredData={formContext.varientFilterData} formik={props.formik} formikFieldName="varient" formContext={formContext} />
          <ErrorMessage formik={props.formik} fieldValue="varient" />
        </Col>
        <Col sm={12}>
          <Row>
            <Col md={6} sm={12} className="mb-4">
              {props.formik.values?.insuranceFor === "renew" ? <InputFieldText
                formikFieldName="registrationYear"
                placeholder={`Registration Year*`}
                formik={props.formik}
                type="date"
              /> :
                <InputFieldDropdown
                  formikFieldName="registrationYear"
                  label="Manufacturing Year*"
                  optionsArray={ManufacturingDateArray}
                  formik={props.formik}
                />}
              <ErrorMessage
                formik={props.formik}
                fieldValue="registrationYear"
              />
            </Col>
            {props.formik.values?.insuranceFor === "renew" && <Col md={6} sm={12}>
              <InputFieldDropdown
                formikFieldName="previousPolicy"
                label="Previous policy?"
                optionsArray={optArrayForPolicyExp}
                formik={props.formik}
              />
              <ErrorMessage formik={props.formik} fieldValue="previousPolicy" />
            </Col>}

          </Row>
        </Col>
        <Col sm={12}>
          <Row>
            {props.formik.values?.insuranceFor === "renew" && <Col md={6} sm={12}>
              <InputFieldDropdown
                formikFieldName="insuranceClaim"
                label="Insurance claim in last 12 months"
                optionsArray={[
                  { value: "false", label: "No" },
                  { value: "true", label: "Yes" },
                ]}
                formik={props.formik}
              />
              <ErrorMessage formik={props.formik} fieldValue="insuranceClaim" />
            </Col>}
            {props.formik.values?.insuranceClaim === "false" && props.formik.values?.insuranceFor === "renew" && <Col md={6} sm={12}>
              <InputFieldDropdown
                formikFieldName="noClaimBonus"
                label="No claim bonus in existing policy"
                optionsArray={[
                  { value: "0", label: "0%" },
                  { value: "20", label: "20%" },
                  { value: "25", label: "25%" },
                  { value: "35", label: "35%" },
                  { value: "45", label: "45%" },
                  { value: "50", label: "50%" },
                ]}
                formik={props.formik}
              />
              <ErrorMessage formik={props.formik} fieldValue="noClaimBonus" />
            </Col>}
          </Row>
        </Col>
        <Col sm={12} className="policyWrap">
          <Row>
            <Col md={6} sm={12}>
              <div>
                <p className="heading">Policy type*</p>
                <div className="policy-type">
                  <InputFieldRadio
                    formikFieldName="policyType"
                    optionsArray={arrayForPolicyType}
                    formik={props.formik}
                  />
                  <ErrorMessage formik={props.formik} fieldValue="policyType" />
                </div>
              </div>
            </Col>
            {props.formik.values?.insuranceFor === "renew" && <Col md={6} sm={12}>
              <div>
                <p className="heading">Policy Terms*</p>
                <div className="policy-type">
                  <InputFieldRadio
                    formikFieldName="policyTerms"
                    optionsArray={[
                      { value: "1", label: "1 Year" },
                      { value: "2", label: "2 Year" },
                      { value: "3", label: "3 Year" },
                    ]}
                    formik={props.formik}
                    id="PolicyTerms"
                  />
                  <ErrorMessage
                    formik={props.formik}
                    fieldValue="policyTerms"
                  />
                </div>
              </div>
            </Col>}
          </Row>
          <>
            <CarPolicy
              show={carPolicy}
              onHide={() => setCarPolicy(false)}
              message="As per RTO this vehicle does not belongs to Two Wheeler category."
              type={2}
              formik={props.formik} />

            <VehicalNotFoundModal
              show={vehicalNotFound}
              onHide={() => setVehicalNotFound(false)}
            />
          </>
        </Col>
      </Row>
      {/* popupfor tp policy */}
      <VerticallyCenteredModal
        show={tpPolicyStatus}
        onHide={() => {
          odPopupClose(1)
        }}
        heading="Enter Relevant Dates"
      >
        {popForOd}
      </VerticallyCenteredModal>
    </Form >
  );
}
