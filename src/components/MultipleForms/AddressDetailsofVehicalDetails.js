import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
} from "react-bootstrap";
import ErrorMessage from "../commonModules/ErrorMessage";
import InputFieldText from "../commonModules/InputFieldText";
import InputFieldCheckBox from "../commonModules/InputFieldCheckBox";
import { formikFieldVisibility } from "../commonModules/CommonCode";
import * as api from "../../API/authCurd"
import UseFormContext from "../../../src/context/UseFormContext"
import InputFieldDropdown from "../commonModules/InputFieldDropdown";

export default function AddressDetailsofVehicalDetails(props) {
  const formContext = UseFormContext();
  const [fieldVisibility, setFieldVisibility] = useState(false);
  const { isRegisteredAddressSame, ownerFlatNumber, ownerAddress, ownerLocation, ownerPincode, ownerCity, ownerState } = props.formik.values
  const [pincodeStatus, setpincodeStatus] = useState(true);
  const [stateArray, setstateArray] = useState([]);
  const [cityArray, setCityArray] = useState([]);
  const [cityArrayForPermentAdd, setcityArrayForPermentAdd] = useState([]);
  const [pinCodeData, setpinCodeData] = useState();
  const [pinCodeDataForPremAdd, setpinCodeDataForPremAdd] = useState();

  // Set initial visibility of formik fields when the component mounts
  useEffect(() => {
    formikFieldVisibility(["ownerFlatNumber", "ownerAddress", "ownerLocation", "ownerPincode", "ownerCity", "ownerState", "isRegisteredAddressSame", "ownerFlatNumberReg", "ownerAddressReg", "ownerLocationReg", "ownerPincodeReg", "ownerCityReg", "ownerStateReg"], props.formik)
    if (!props?.formik?.values?.ownerPincode) {
      defaultValueForFields()
    }
  }, []);
  useEffect(() => {
    getState()
  }, []);

  // this is for temporary address fileds
  useEffect(() => {
    if (props?.formik?.values?.ownerPincode?.length === 6 && pincodeStatus) {
      formContext.setloaderStatus(true);
      setTimeout(() => {
        formContext.setloaderStatus(false);
      }, 2000);

      api.getPincodeData(props?.formik?.values?.ownerPincode).then(data => {
        const jsondata = JSON.parse(data?.data)
        setpinCodeData(jsondata?.data[0])

      }).catch(err => { }).finally((res) => { formContext.setloaderStatus(false); })

      // api.getFullAddress(props?.formik?.values?.ownerPincode).then(data => { fillAddress(data.data) }).catch(err => { }).finally((res) => { formContext.setloaderStatus(false); })
    }

  }, [props?.formik?.values?.ownerPincode]);

  // this is for perment address fileds

  useEffect(() => {
    if (props?.formik?.values?.ownerPincodeReg?.length === 6 && pincodeStatus) {

      formContext.setloaderStatus(true);
      setTimeout(() => {
        formContext.setloaderStatus(false);
      }, 2000);

      api.getPincodeData(props?.formik?.values?.ownerPincodeReg).then(data => {
        const jsondata = JSON.parse(data?.data)
        setpinCodeDataForPremAdd(jsondata?.data[0])

      }).catch(err => { }).finally((res) => { formContext.setloaderStatus(false); })

      // api.getFullAddress(props?.formik?.values?.ownerPincode).then(data => { fillAddress(data.data) }).catch(err => { }).finally((res) => { formContext.setloaderStatus(false); })
    }

  }, [props?.formik?.values?.ownerPincodeReg]);

  // to set dropdownvalue for state and city depends on pincode
  useEffect(() => {
    if (pinCodeData?.state) {
      const uniqueState = stateArray?.find(data => data.value.toLowerCase() === pinCodeData?.state.toLowerCase())
      props.formik.setFieldValue("ownerState", uniqueState?.value)
      if (uniqueState?.value) {
        getCity(uniqueState?.value, 1)
      }
    }
  }, [pinCodeData, stateArray]);
  // this is for permentAddress
  useEffect(() => {
    if (pinCodeDataForPremAdd?.state) {
      const uniqueState = stateArray?.find(data => data.value.toLowerCase() === pinCodeDataForPremAdd?.state.toLowerCase())
      props.formik.setFieldValue("ownerStateReg", uniqueState?.value)

      if (uniqueState?.value) {
        getCity(uniqueState?.value, 2)
      }
    }
  }, [pinCodeDataForPremAdd,stateArray]);
  // when state value chnages set city value as well
  useEffect(() => {
    if (props.formik.values.ownerState) {
      props.formik.setFieldValue("ownerCity", "");
      getCity(props.formik.values.ownerState, 1)
    }
  }, [props.formik.values.ownerState]);
  // for perment address
  useEffect(() => {
    if (props.formik.values.ownerStateReg) {
      props.formik.setFieldValue("ownerCityReg", "");
      getCity(props.formik.values.ownerStateReg, 2)
    }
  }, [props.formik.values.ownerStateReg]);
  // to get state list
  const getState = () => {
    api.getState().then(data => {
      const convertedValue = data?.data?.map(mapvalue => {
        return { value: mapvalue.state, label: mapvalue.state }
      })
      setstateArray([{ value: "", label: "Select value" }, ...convertedValue])
    }).catch(error => { console.log("error", error) })
  }
  // to get city list
  const getCity = (stateName, type) => {
    api.getCity(stateName).then(data => {
      const convertedValue = data?.data?.[0].cities?.map(mapvalue => {
        return { value: mapvalue, label: mapvalue }
      })
      let uniqueState
      if (type === 1) {
        setCityArray([{ value: "", label: "Select value" }, ...convertedValue])
        uniqueState = convertedValue?.find(data => data.value.toLowerCase() === pinCodeData?.district.toLowerCase())
      } else {
        setcityArrayForPermentAdd([{ value: "", label: "Select value" }, ...convertedValue])
        uniqueState = convertedValue?.find(data => data.value.toLowerCase() === pinCodeDataForPremAdd?.district.toLowerCase())
      }
      if (uniqueState?.value) {
        props.formik.setFieldValue(`${type === 1 ? 'ownerCity' : 'ownerCityReg'}`, uniqueState?.value);
      } else {
        props.formik.setFieldValue(`${type === 1 ? 'ownerCity' : 'ownerCityReg'}`, "");
      }

    }).catch(error => { console.log("error", error) })
  }

  const defaultValueForFields = () => {
    // kyc data for fields
    if (formContext.kycApiRes) {
      setpincodeStatus(false)
      setTimeout(() => {
        setpincodeStatus(true)
      }, 2000);
      if (formContext.carrierName === "future") {
        const nestedData = formContext?.kycApiRes
        props.formik.setFieldValue("ownerPincode", nestedData?.pincode ? nestedData?.pincode : "");
        props.formik.setFieldValue("ownerAddress", nestedData?.customer_address ? nestedData?.customer_address : "");
      }
      if (formContext.carrierName === "reliance") {
        const nestedData = formContext?.kycApiRes?.kyc_data?.CKYC?.result?.PERSONAL_DETAILS
        props.formik.setFieldValue("ownerPincode", nestedData?.PERM_PIN ? nestedData?.PERM_PIN : "");
        // props.formik.setFieldValue("ownerCity", nestedData?.PERM_CITY ? nestedData?.PERM_CITY : "");
        // props.formik.setFieldValue("ownerState", nestedData?.PERM_STATE ? nestedData?.PERM_STATE : "");
        props.formik.setFieldValue("ownerLocation", nestedData?.PERM_CITY ? nestedData?.PERM_CITY : "");
        props.formik.setFieldValue("ownerAddress", nestedData?.PERM_LINE1 ? nestedData?.PERM_LINE1 + nestedData?.PERM_LINE2 + nestedData?.PERM_LINE3 : "");
      }
      if (formContext.carrierName === "newindia") {
        const nestedData = formContext?.kycApiRes
        props.formik.setFieldValue("ownerPincode", nestedData?.pinCode ? nestedData?.pinCode : "");
        props.formik.setFieldValue("ownerAddress", nestedData?.address1 ? nestedData?.address1 + " " + nestedData?.address2 + " " + nestedData?.address3 : "");
      }
      if (formContext.carrierName === "icici") {
        const nestedData = formContext?.kycApiRes
        props.formik.setFieldValue("ownerPincode", nestedData?.permanent_address?.pin_code ? nestedData?.permanent_address?.pin_code: "");
        props.formik.setFieldValue("ownerAddress", nestedData?.permanent_address?.address_line_1 ? nestedData?.permanent_address?.address_line_1 + " " + nestedData?.permanent_address?.address_line_2 + " " +nestedData?.permanent_address?.address_line_3 : "");
      }

    } else {
      setpincodeStatus(true)
      props.formik.setFieldValue("ownerPincode", props?.vahanData?.splitPermanentAddress?.pincode ? props?.vahanData?.splitPermanentAddress?.pincode : "")
      // props.formik.setFieldValue("ownerCity", props?.vahanData?.splitPermanentAddress?.city?.[0] ? props?.vahanData?.splitPermanentAddress?.city?.[0] : "")
      // props.formik.setFieldValue("ownerState", props?.vahanData?.splitPermanentAddress?.state?.[0][0] ? props?.vahanData?.splitPermanentAddress?.state?.[0][0] : "")
      props.formik.setFieldValue("ownerAddress", props?.vahanData?.presentAddress ? props?.vahanData?.presentAddress : "")
      props.formik.setFieldValue("ownerLocation", props?.vahanData?.regAuthority?.split(",")?.[0] ? props?.vahanData?.regAuthority?.split(",")?.[0] : "")

    }
  }
  useEffect(() => {
    // if Registered address same as above  is checked
    if (props.formik.values.isRegisteredAddressSame) {
      setcityArrayForPermentAdd(cityArray)
      props.formik.setFieldValue('ownerFlatNumberReg', props.formik.values.ownerFlatNumber);
      props.formik.setFieldValue('ownerAddressReg', props.formik.values.ownerAddress);
      props.formik.setFieldValue('ownerLocationReg', props.formik.values.ownerLocation);
      props.formik.setFieldValue('ownerPincodeReg', props.formik.values.ownerPincode);
      props.formik.setFieldValue("ownerCityReg", props.formik.values.ownerCity);
      props.formik.setFieldValue("ownerStateReg", props.formik.values.ownerState);
      setFieldVisibility(true)
    }
  }, [isRegisteredAddressSame, ownerAddress, ownerFlatNumber, ownerState, ownerCity, ownerPincode, ownerLocation]);

  // to clear reg address values
  useEffect(() => {

    if (!props.formik.values.isRegisteredAddressSame && !sessionStorage.getItem("nextPage")) {
      setFieldVisibility(false)
      props.formik.setFieldValue('ownerFlatNumberReg', "");
      props.formik.setFieldValue('ownerAddressReg', "");
      props.formik.setFieldValue('ownerLocationReg', "");
      props.formik.setFieldValue('ownerPincodeReg', "");
      props.formik.setFieldValue("ownerCityReg", "");
      props.formik.setFieldValue("ownerStateReg", "");
      setpinCodeDataForPremAdd()
      setcityArrayForPermentAdd([])
    }
    setTimeout(() => {
      sessionStorage.removeItem("nextPage")

    }, 1000);
  }, [isRegisteredAddressSame]);

  const fillAddress = (address) => {
    const addressObj = address?.[0]?.PostOffice[0]
    props.formik.setFieldValue('ownerLocation', addressObj?.Block);
    props.formik.setFieldValue("ownerCity", addressObj?.Name);
    props.formik.setFieldValue("ownerState", addressObj?.State);

  }
  return (
    <React.Fragment>
      <div>
        <Row>
          <Col sm={4} className="mb-4">
            <div className="inputWrap">
              <InputFieldText formikFieldName="ownerPincode" placeholder="Pin Code*" formik={props.formik} onlyNumber={true} maxlength={6} />
              {formContext.loaderStatus && formContext.spinner}
            </div>
            <ErrorMessage formik={props.formik} fieldValue="ownerPincode" />

          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerFlatNumber" placeholder="Flat number*" formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="ownerFlatNumber" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerAddress" placeholder="Enter address*" formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="ownerAddress" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerLocation" placeholder="Enter a location*" formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="ownerLocation" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="ownerState" label="State*" optionsArray={stateArray} formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="ownerState" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="ownerCity" label="City*" optionsArray={cityArray} formik={props.formik} />
            <ErrorMessage formik={props.formik} fieldValue="ownerCity" />
          </Col>
        </Row>

        <InputFieldCheckBox formik={props.formik} formikFieldName="isRegisteredAddressSame" label="Registered address same as above" />

        <Row>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerPincodeReg" placeholder="Pin code*" formik={props.formik} disabled={fieldVisibility} onlyNumber={true} maxlength={6} />
            <ErrorMessage formik={props.formik} fieldValue="ownerPincodeReg" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerFlatNumberReg" placeholder="Flat number*" formik={props.formik} disabled={fieldVisibility} />
            <ErrorMessage formik={props.formik} fieldValue="ownerFlatNumberReg" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldText formikFieldName="ownerAddressReg" placeholder="Enter address*" formik={props.formik} disabled={fieldVisibility} />
            <ErrorMessage formik={props.formik} fieldValue="ownerAddressReg" />
          </Col>
          <Col sm={4}>
            <InputFieldText formikFieldName="ownerLocationReg" placeholder="Enter a location*" formik={props.formik} disabled={fieldVisibility} />
            <ErrorMessage formik={props.formik} fieldValue="ownerLocationReg" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="ownerStateReg" label="State*" optionsArray={stateArray} formik={props.formik} disabled={fieldVisibility} />
            <ErrorMessage formik={props.formik} fieldValue="ownerStateReg" />
          </Col>
          <Col sm={4} className="mb-4">
            <InputFieldDropdown formikFieldName="ownerCityReg" label="City*" optionsArray={cityArrayForPermentAdd} formik={props.formik} disabled={fieldVisibility} />
            <ErrorMessage formik={props.formik} fieldValue="ownerCityReg" />
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
}
