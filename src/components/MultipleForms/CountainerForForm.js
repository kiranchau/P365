import { useState, React, useEffect } from "react";

import UseMultistepForm from "./UseMultiStepForms";
import OwnerContactInfo from "./OwnerContactInfo";
import AddressDetailsofVehicalDetails from "./AddressDetailsofVehicalDetails";
import Benefits from "./Benefits";
import PreviousPolicyForm from "./PreviousPolicyForm";
import InsuredVehical from "./InsuredVehical";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Done from "../../images/Done.svg";
import SVG from "react-inlinesvg";
import * as Yup from "yup";
import { useFormik } from "formik";
import KYCForm from "./KYCForm";
import PaymentForm from "./PaymentForm";
import * as api from "../../API/authCurd";
import UseFormContext from "../../context/UseFormContext";
import { yearValidation } from "../commonModules/CommonCode";
import VerticallyCenteredModal from "../commonModules/Popups/VerticallyCenteredModal";
import { useHistory } from "react-router-dom";
import { BiSolidError } from "react-icons/bi";
import FileUpload from "../commonModules/FileUpload";
function ContainerForForm(props) {
  const [modalShow, setModalShow] = useState(false);
  const formContext = UseFormContext();
  const currentYear = new Date().getFullYear();
  const minRegistrationYear = currentYear - 50;
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  let paymentdataDestructure = {};
  let history = useHistory();
  const [iframeUrl, setiframeUrl] = useState();
  const [iframeStatus, setiframeStatus] = useState(false);
  const [kycPopUpStatus, setkycPopUpStatus] = useState(false);
  const [kycPopUp, setkycPopUp] = useState(false);
  const [kycPopUpStatusNewInd, setkycPopUpStatusNewInd] = useState();
  const [iframeOpenedCarrier, setiframeOpenedCarrier] = useState();
  const policyType = props.carbikeformikValues?.insuranceFor
  const [kycTokenIcici, setkycTokenIcici] = useState();
  const [iciciKycData, seticiciKycData] = useState({
    poiFile: "",//proof of identity
    poaFile: "",
    poitype: "",
    poatype: ""
  });
  const [poiType, setpoiType] = useState([{ value: "", label: "Please select" }, { value: "PAN", label: "PAN" }, { value: "AADHAAR", label: "AADHAAR" }, { value: "VOTERID", label: "VOTERID" }, { value: "DL", label: "DL" }, { value: "PASSPORT", label: "PASSPORT" }]);
  const [poAType, setpoAType] = useState([{ value: "", label: "Please select" }, { value: "AADHAAR", label: "AADHAAR" }, { value: "VOTERID", label: "VOTERID" }, { value: "DL", label: "DL" }, { value: "PASSPORT", label: "PASSPORT" }]);
  const [icicikycError, seticicikycError] = useState(false);
  // formik methods
  const initialData = {
    currentStepIndex: "0",
    policyType: formContext.quotesPageFormikData?.policyType,

    kycNominePanNumber: "",
    kycNomineAadharNumber: "",
    kycNomineDob: "",
    kycNomineGender: "",
    kycNomineFullName: "",

    ownerPrefix: "",
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPhoneNumber: "",
    ownerMaritialStus: "",
    ownerGstin: "",

    nomineFirstName: "",
    nomineLastName: "",
    nomineDob: "",
    nomineRelation: "",

    ownerFlatNumber: "",
    ownerAddress: "",
    ownerLocation: "",
    ownerPincode: "",
    ownerCity: "",
    ownerState: "",
    isRegisteredAddressSame: false,
    ownerFlatNumberReg: "",
    ownerAddressReg: "",
    ownerLocationReg: "",
    ownerPincodeReg: "",
    ownerCityReg: "",
    ownerStateReg: "",

    policyNumber: "",
    policyInsuranceName: "",
    policyInsuranceId: "",
    // PolicyStartDate: "",
    PolicyEndtDate: "",
    policyInsuranceNamePrevious: "",
    policyPreviousType: "",
    tpPolicyNumber: "",
    tpPolicyInsuranceName: "",


    vehicalMakeModel: "",
    vehicalRegistionDate: "",
    vehicalManufaDate: "",
    vehicalPurchaseLoan: "",
    vehicalFinancierName: "",
    financierID: "",
    financierName: "",
    financierNameValidaton: "no",
    vehicalReferalcode: "",
    vehicalTermAccept: "",
    chassisNumber: "",
    engineNumber: "",
    registeredRto: "",
    puc: "",
    kycFailedData: "",

  };

  const validationSchema = Yup.object().shape({
    // First page
    kycNominePanNumber: Yup.string().trim()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN Number")
      .required("PAN Number Is Required"),

    kycNomineDob: Yup.string().trim().required("DOB Is Required")
      .test("not blank", "Select value", (value) => value !== "")
      .test("valid date", "Future date is not allowed", (value) => {
        const currentDate = new Date();
        const inputDate = new Date(value);
        return inputDate <= currentDate;
      })
      .test("valid range", "Date should be within the past 100 years", (value) => {
        return yearValidation(value, 100);
      }),

    kycNomineGender: Yup.string()
      .trim()
      .required("Gender Is Required")
      .test("not blank", "Select value", (value) => {
        return value !== "";
      }),

    currentStepIndex: Yup.string().required("Field is required"),

    //second page
    ownerPrefix: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () =>
        Yup.string()
          .required(" Prefix Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),
    ownerFirstName: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string()
        .matches(/^[a-zA-Z ]*$/, "Invalid First Name")
        .required(" First Name Is Required"),
    }),

    ownerLastName: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string()
        .matches(/^[a-zA-Z ]*$/, "Invalid Last Name")
        .required(" Last Name Is Required"),
    }),

    ownerEmail: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string()
        .email("Invalid Email Address")
        .required(" Email Is Required"),
    }),

    ownerPhoneNumber: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string()
        .matches(/^\d{10}$/, "Phone Number must be 10 digits")
        .required(" Phone Number Is Required"),
    }),

    ownerMaritialStus: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () =>
        Yup.string()
          .required(" Maritial Status Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),

    // third page
    nomineFirstName: Yup.string().when("currentStepIndex", {
      is: "2",
      then: () => Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed")
        .required(" First Name Is Required"),
    }),

    nomineLastName: Yup.string().when("currentStepIndex", {
      is: "2",
      then: () => Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed")
        .required(" Last Name Is Required"),
    }),

    nomineDob: Yup.string().when(["currentStepIndex", "nomineRelation", "kycNomineDob"], {
      is: (currentStepIndex) => currentStepIndex === "2",
      then: () =>
        Yup.string().required("DOB Is Required")
          .test("not blank", "Select value", (value) => value !== "")
          .test("valid date", "Future date is not allowed", (value) => {
            const currentDate = new Date();
            const inputDate = new Date(value);
            return inputDate <= currentDate;
          })
          .test("valid range", "Date should be within the past 100 years", (value) => {
            return yearValidation(value, 100);
          })
          .test("date comparison", "Invalid Date", function (value) {
            const userDob = new Date(this.parent.kycNomineDob);
            const nomineeDob = new Date(value);

            if (this.parent.nomineRelation === "son" || this.parent.nomineRelation === "daughter") {
              return nomineeDob > userDob || this.createError({ message: "Nominee DOB should be after user DOB" });
            } else if (this.parent.nomineRelation === "mother" || this.parent.nomineRelation === "father") {
              return nomineeDob < userDob || this.createError({ message: "Nominee DOB should be before user DOB" });
            }

            return true;
          }),
      else: Yup.string(),
    }),

    nomineRelation: Yup.string().when("currentStepIndex", {
      is: "2",
      then: () =>
        Yup.string()
          .required(" Relation Of Nomine Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),

    // 4th page

    ownerFlatNumber: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string()
        .matches(/^[0-9]+$/, "Flat Number must be a number")
        .required(" Flat Number Is Required"),
    }),

    ownerAddress: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" Address Is Required"),
    }),

    ownerLocation: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" Location Is Required"),
    }),
    ownerPincode: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string()
        .matches(/^\d{6}$/, "Invalid PIN code")
        .required(" Pincode Is Required"),
    }),

    ownerCity: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" City Is Required"),
    }),

    ownerState: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" State Is Required"),
    }),
    isRegisteredAddressSame: Yup.string().required("Field is required"),

    ownerFlatNumberReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string()
        .matches(/^[0-9]+$/, "Flat Number must be a number")
        .required("  Reg Flat Number Is Required"),
    }),

    ownerAddressReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" Reg Address Is Required"),
    }),

    ownerLocationReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" Reg Location Is Required"),
    }),
    ownerPincodeReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string()
        .matches(/^\d{6}$/, "Invalid PIN code")
        .required(" Reg Pincode Is Required"),
    }),

    ownerCityReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" Reg City Is Required"),
    }),

    ownerStateReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required("Reg State Is Required"),
    }),

    //page 5
    policyNumber: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () => Yup.string()
        .matches(/^[a-zA-Z0-9\/]*$/, "Only letters, numbers, and '/' are allowed")
        .max(30, "Maximum length must be 30 characters")
        .min(4, "Minimum length must be 4 characters")
        .required("Policy Number Is Required"),
    }),

    policyInsuranceNamePrevious: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () => Yup.string().required("Previous Policy Name Is Required"),
    }),

    PolicyEndtDate: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () => Yup.string().required("Policy End Date Is Required")
        .test("valid date", "Policy End Date should be within the past 50 years", (value) => {
          const currentDate = new Date();
          const selectedDate = new Date(value);
          const yearDifference = currentDate.getFullYear() - selectedDate.getFullYear();
          return yearDifference <= 50;
        })
    }),

    policyInsuranceName: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () =>
        Yup.string()
          .required(" Policy Insurance Name Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),


    tpPolicyInsuranceName: Yup.string().when(["currentStepIndex", "policyType"], {
      is: (currentStepIndex, policyType) => currentStepIndex === "4" && policyType === "OD",
      then: () =>
        Yup.string()
          .required("TP Policy Insurer Name Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),

    tpPolicyNumber: Yup.string().when(["currentStepIndex", "policyType"], {
      is: (currentStepIndex, policyType) => currentStepIndex === "4" && policyType === "OD",
      then: () => Yup.string()
        .matches(/^[a-zA-Z0-9\/]*$/, "Only letters, numbers, and '/' are allowed")
        .max(30, "Maximum length must be 30 characters")
        .min(4, "Minimum length must be 4 characters")
        .required("TP policy Number Is Required"),
    }),

    policyPreviousType: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () =>
        Yup.string()
          .required("Previous policy Type Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),

    // page 6

    vehicalMakeModel: Yup.string().when("currentStepIndex", {
      is: "5",
      then: () => Yup.string().required(" Make and Model Is Required"),
    }),

    vehicalRegistionDate: Yup.string().when("currentStepIndex", {
      is: "5",
      then: () => Yup.string().required("Registration Date Is Required")
        .test("not blank", "Select value", (value) => value !== "")
        .test("valid date", "Future date is not allowed", (value) => {
          const currentDate = new Date();
          const inputDate = new Date(value);
          return inputDate <= currentDate;
        })
        .test("valid range", "Date should be within the past 50 years", (value) => {
          return yearValidation(value, 50);
        }),
    }),

    vehicalManufaDate: Yup.string().when("currentStepIndex", {
      is: "5",
      then: () => Yup.string().required(" Manufacturing Year Is Required")
    }),

    vehicalPurchaseLoan: Yup.string().when("currentStepIndex", {
      is: "5",
      then: () =>
        Yup.string().required("Bike Purchased on Loan Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),

    vehicalFinancierName: Yup.string().when(["currentStepIndex", "vehicalPurchaseLoan"], {
      is: (currentStepIndex, vehicalPurchaseLoan) => currentStepIndex === "5" && vehicalPurchaseLoan === "yes",
      then: () =>
        Yup.string().required("Vehicle Financier Name is Required")
          .min(4, "Minimum length must be 4 characters")

    }),

    financierNameValidaton: Yup.string().when("currentStepIndex", {
      is: "5",
      then: () => Yup.string()
        .required("Vehicle Registration Number Is Required")
    }),

    financierID: Yup.string().when(["currentStepIndex", "vehicalPurchaseLoan", "financierNameValidaton"], {
      is: (currentStepIndex, vehicalPurchaseLoan, financierNameValidaton) => currentStepIndex === "5" && vehicalPurchaseLoan === "yes" && financierNameValidaton === "yes",
      then: () =>
        Yup.string().required("Name not found,please pick name from dropdown only")
    }),
    engineNumber: Yup.string().when("currentStepIndex", {
      is: "5",
      then: () => Yup.string()
        .matches(/^[a-zA-Z0-9/]*$/, "Only letters and numbers are allowed")
        .max(20, "Maximum length must be 20 characters")
        .min(10, "Minimum length must be 10 characters")
        .required("Engine Number Is Required"),
    }),

    chassisNumber: Yup.string().when("currentStepIndex", {
      is: "5",
      then: () => Yup.string()
        .matches(/^[a-zA-Z0-9/]*$/, "Only letters and numbers are allowed")
        .max(20, "Maximum length must be 20 characters")
        .min(10, "Minimum length must be 10 characters")
        .required("Chassis Number Is Required"),
    }),

    registeredRto: Yup.string().when("currentStepIndex", {
      is: "5",
      then: () => Yup.string()
        .required("Vehicle Registration Number Is Required")
        .matches(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, "Invalid Vehicle Number,Eg MH12AAXXXX")

    }),

    vehicalTermAccept: Yup.boolean().when("currentStepIndex", {
      is: "5",
      then: () =>
        Yup.boolean()
          .oneOf([true], "You must accept the terms and conditions")
          .required("You must accept the terms and conditions"),
    }),

  });

  const validationSchema2 = Yup.object().shape({
    // First page
    kycNominePanNumber: Yup.string().trim()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN Number")
      .required("PAN Number Is Required"),

    kycNomineDob: Yup.string().trim().required("DOB Is Required")
      .test("not blank", "Select value", (value) => value !== "")
      .test("valid date", "Future date is not allowed", (value) => {
        const currentDate = new Date();
        const inputDate = new Date(value);
        return inputDate <= currentDate;
      })
      .test("valid range", "Date should be within the past 100 years", (value) => {
        return yearValidation(value, 100);
      }),

    kycNomineGender: Yup.string()
      .trim()
      .required("Gender Is Required")
      .test("not blank", "Select value", (value) => {
        return value !== "";
      }),

    currentStepIndex: Yup.string().required("Field is required"),

    //second page
    ownerPrefix: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () =>
        Yup.string()
          .required(" Prefix Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),
    ownerFirstName: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string()
        .matches(/^[a-zA-Z ]*$/, "Invalid First Name")
        .required(" First Name Is Required"),
    }),

    ownerLastName: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string()
        .matches(/^[a-zA-Z ]*$/, "Invalid Last Name")
        .required(" Last Name Is Required"),
    }),

    ownerEmail: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string()
        .email("Invalid Email Address")
        .required(" Email Is Required"),
    }),

    ownerPhoneNumber: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string()
        .matches(/^\d{10}$/, "Phone Number must be 10 digits")
        .required(" Phone Number Is Required"),
    }),

    ownerMaritialStus: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () =>
        Yup.string()
          .required(" Maritial Status Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),

    // third page
    nomineFirstName: Yup.string().when("currentStepIndex", {
      is: "2",
      then: () => Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed")
        .required(" First Name Is Required"),
    }),

    nomineLastName: Yup.string().when("currentStepIndex", {
      is: "2",
      then: () => Yup.string()
        .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed")
        .required(" Last Name Is Required"),
    }),

    nomineDob: Yup.string().when(["currentStepIndex", "nomineRelation", "kycNomineDob"], {
      is: (currentStepIndex) => currentStepIndex === "2",
      then: () =>
        Yup.string().required("DOB Is Required")
          .test("not blank", "Select value", (value) => value !== "")
          .test("valid date", "Future date is not allowed", (value) => {
            const currentDate = new Date();
            const inputDate = new Date(value);
            return inputDate <= currentDate;
          })
          .test("valid range", "Date should be within the past 100 years", (value) => {
            return yearValidation(value, 100);
          })
          .test("date comparison", "Invalid Date", function (value) {
            const userDob = new Date(this.parent.kycNomineDob);
            const nomineeDob = new Date(value);

            if (this.parent.nomineRelation === "son" || this.parent.nomineRelation === "daughter") {
              return nomineeDob > userDob || this.createError({ message: "Nominee DOB should be after user DOB" });
            } else if (this.parent.nomineRelation === "mother" || this.parent.nomineRelation === "father") {
              return nomineeDob < userDob || this.createError({ message: "Nominee DOB should be before user DOB" });
            }

            return true;
          }),
      else: Yup.string(),
    }),

    nomineRelation: Yup.string().when("currentStepIndex", {
      is: "2",
      then: () =>
        Yup.string()
          .required(" Relation Of Nomine Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),

    // 4th page

    ownerFlatNumber: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string()
        .matches(/^[0-9]+$/, "Flat Number must be a number")
        .required(" Flat Number Is Required"),
    }),

    ownerAddress: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" Address Is Required"),
    }),

    ownerLocation: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" Location Is Required"),
    }),
    ownerPincode: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string()
        .matches(/^\d{6}$/, "Invalid PIN code")
        .required(" Pincode Is Required"),
    }),

    ownerCity: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" City Is Required"),
    }),

    ownerState: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" State Is Required"),
    }),
    isRegisteredAddressSame: Yup.string().required("Field is required"),

    ownerFlatNumberReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string()
        .matches(/^[0-9]+$/, "Flat Number must be a number")
        .required("  Reg Flat Number Is Required"),
    }),
    ownerAddressReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" Reg Address Is Required"),
    }),
    ownerLocationReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" Reg Location Is Required"),
    }),
    ownerPincodeReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string()
        .matches(/^\d{6}$/, "Invalid PIN code")
        .required(" Reg Pincode Is Required"),
    }),
    ownerCityReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required(" Reg City Is Required"),
    }),
    ownerStateReg: Yup.string().when("currentStepIndex", {
      is: "3",
      then: () => Yup.string().required("Reg State Is Required"),
    }),
    // page 6

    vehicalMakeModel: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () => Yup.string().required(" Make and Model Is Required"),
    }),

    vehicalRegistionDate: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () => Yup.string().required("Registration Date Is Required")
        .test("not blank", "Select value", (value) => value !== "")
        .test("valid date", "Future date is not allowed", (value) => {
          const currentDate = new Date();
          const inputDate = new Date(value);
          return inputDate <= currentDate;
        })
        .test("valid range", "Date should be within the past 50 years", (value) => {
          return yearValidation(value, 50);
        }),
    }),

    vehicalManufaDate: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () => Yup.string().required(" Manufacturing Year Is Required")
    }),

    vehicalPurchaseLoan: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () =>
        Yup.string().required("Bike Purchased on Loan Is Required")
          .test("not blank", "Select value", (value) => {
            return value !== "";
          }),
    }),

    vehicalFinancierName: Yup.string().when(["currentStepIndex", "vehicalPurchaseLoan"], {
      is: (currentStepIndex, vehicalPurchaseLoan) => currentStepIndex === "4" && vehicalPurchaseLoan === "yes",
      then: () =>
        Yup.string().required("Vehicle Financier Name is Required")
          .min(4, "Minimum length must be 4 characters")

    }),
    financierNameValidaton: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () => Yup.string()
        .required("Vehicle Registration Number Is Required")
    }),

    financierID: Yup.string().when(["currentStepIndex", "vehicalPurchaseLoan", "financierNameValidaton"], {
      is: (currentStepIndex, vehicalPurchaseLoan, financierNameValidaton) => currentStepIndex === "4" && vehicalPurchaseLoan === "yes" && financierNameValidaton === "yes",
      then: () =>
        Yup.string().required("Name not found,please pick name from dropdown only")
    }),

    engineNumber: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () => Yup.string()
        .matches(/^[a-zA-Z0-9/]*$/, "Only letters and numbers are allowed")
        .max(17, "Maximum length must be 17 characters")
        .min(14, "Minimum length must be 14 characters")
        .required("EngineNumber Number Is Required"),
    }),

    chassisNumber: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () => Yup.string()
        .matches(/^[a-zA-Z0-9/]*$/, "Only letters and numbers are allowed")
        .max(17, "Maximum length must be 17 characters")
        .min(17, "Minimum length must be 17 characters")
        .required("Chassis Number Number Is Required"),
    }),
    registeredRto: Yup.string().when("currentStepIndex", {
      is: "4",
      then: () => Yup.string()
        .required("Vehicle Registration Number Is Required")
    }),
    vehicalTermAccept: Yup.boolean().when("currentStepIndex", {
      is: "4",
      then: () =>
        Yup.boolean()
          .oneOf([true], "You must accept the terms and conditions")
          .required("You must accept the terms and conditions"),
    }),
  });

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: policyType === "renew" ? validationSchema : validationSchema2,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setSubmitting(true);
      if (!isLastStep) {
        if (isFirstStep) {
          if (formContext?.singleQuotesData?.insuranceCompany === "Reliance General Insurance Co. Ltd" || formContext?.singleQuotesData?.insuranceCompany === "Future Generali India Insurance Co. Ltd" || formContext?.singleQuotesData?.insuranceCompany === "ICICI Lombard General Insurance Co. Ltd") {
            switch (formContext?.singleQuotesData?.insuranceCompany) {
              case "Reliance General Insurance Co. Ltd":
                kycveryfy()
                break;
              case "Future Generali India Insurance Co. Ltd":
                futureKycApi(values)
                break;
              case "ICICI Lombard General Insurance Co. Ltd":
                iciciKyc(values)
                break;
              default:
              // code block
            }
          } else {
            return next()

          }

        } else {
          return next();
        }
      }
      if (isLastStep) {
        apiCalls(values, props)
      }
    },
  });
  // kyc  first page of form
  const kycveryfy = async () => {
    formContext.setloaderStatus(true)
    api.kycVeryfy(formik.values).then(data => {
      if (data.data.data.message === "OK") {
        formik.setFieldValue("kycFailedData", data.data?.data?.kyc_data?.CKYC?.result?.PERSONAL_DETAILS?.CKYC_NO)
        formContext.setkycApiRes(data.data.data)
        formContext.setcarrierName("reliance")
        clearFormikForKyc()
        return next()
      }
      // formContext.notifyError(data.data.data.message)
      formContext.setkycApiRes()
      if (data.data?.data?.KYC_Verified === "false") {
        formik.setFieldValue("kycFailedData", data.data?.data?.Unique_Id)
        openIframePopUp(data.data.data, 1)
      }
    })
      .catch(err => { console.log("error", err); }).finally(() => {
        formContext.setloaderStatus(false)
      })
  }
  const futureKycApi = (values) => {
    formContext.setloaderStatus(true)
    api.getTokenForFutureApi().then(data => kycveryfyFuture(data, values)).catch(err => {
      formContext.setloaderStatus(false)
      next()
    })
  }
  const iciciKyc = (values) => {
    formContext.setloaderStatus(true)
    api.iciciKycVerify(kycTokenIcici, values).then(data => { iciciKycPart2(data) }).catch(err => {
      formContext.setloaderStatus(false)
      next()
    })
  }

  const iciciKycPart2 = (data) => {
    formContext.setloaderStatus(false)
    console.log("icici", data)

    // success
    if (data?.data?.data?.message === "OK") {
      clearFormikForKyc()
      formContext.setkycApiRes(data?.data?.data?.kyc_details)
      formContext.setcarrierName("icici")
      return next()
    }
    //  failure
    else {
      setkycPopUp(true)
      seticicikycError(false)
      iciciKycData({
        poiFile: "",//proof of identity
        poaFile: "",
        poitype: "",
        poatype: ""
      })
    }

  }

  const kycveryfyFuture = (data, values) => {
    api.getKycFutureApi(data?.data[0]?.ProposalNo, values).then(data => {
      if (data?.data?.data?.url) {
        formik.setFieldValue("kycFailedData", data.data?.data?.proposal_id)
        openIframePopUp(data.data.data, 2)
        formContext.setkycApiRes()
      }
      if (data?.data?.data?.result?.customer_name) {
        formik.setFieldValue("kycFailedData", data.data?.data?.result?.ckyc_number)
        clearFormikForKyc()
        formContext.setkycApiRes(data?.data?.data?.result)
        formContext.setcarrierName("future")

        return next()
      }

    }).catch(err => console.log("err", err)).finally(fin => {
      formContext.setloaderStatus(false)
    })
  }

  const apiCalls = (values, props) => {
    formContext.setloaderStatus(true)
    api.generateBikeproposal(values, props, formContext.carbikeformikValues, formContext.singleQuotesData).then(data => {
      console.log("data", data)
      if (data.data?.data?.ErrorMessages) {
        commonErrorMessage(data.data?.data?.ErrorMessages)
      } else {
        if (formContext?.singleQuotesData.insuranceCompany === "GO DIGIT General Insurance CO. LTD" && data?.data?.data?.KYCLink) {
          formContext.setgodigitpayment(data?.data?.data)
          openIframe(data?.data)
        } else {
          if (formContext?.singleQuotesData.insuranceCompany === "New India Assurance" && data?.data?.data?.linkUrl) {
            formContext.setgodigitpayment(data?.data?.data)
            openIframePopUp(data?.data?.data, 3)
          } else {
            paymentApicalls(values, data?.data.data)
          }
        }
      }
    })
      .catch(err => {
        console.log("error123", err);
        commonErrorMessage()
      })
  }

  const clearFormikForKyc = () => {
    formik.setFieldValue("kycNomineGender", "");
    formik.setFieldValue("ownerPrefix", "");
    formik.setFieldValue("ownerFirstName", "");
    formik.setFieldValue("ownerLastName", "");
    formik.setFieldValue("ownerPhoneNumber", "");
    formik.setFieldValue("ownerEmail", "");
    formik.setFieldValue("ownerPincode", "");
    formik.setFieldValue("ownerCity", "");
    formik.setFieldValue("ownerState", "");
    formik.setFieldValue("ownerLocation", "");
    formik.setFieldValue("ownerAddress", "")
  }

  // for godigit
  const openIframe = (data) => {
    setiframeOpenedCarrier("godigit")
    setiframeUrl(data?.data.KYCLink)
    setiframeStatus(true)

  }

  // for reliance
  const openIframePopUp = (data, type) => {
    console.log("data?.Endpoint_2_URL111", data)
    // reliance
    if (type === 1) {
      setiframeOpenedCarrier("reliance")
      setiframeUrl(data?.Endpoint_2_URL)
      setErrorMessage("KYC details not found")
      setkycPopUpStatus(true)
    }
    // future
    if (type === 2) {
      setiframeOpenedCarrier("future")
      setiframeUrl(data?.url)
      setErrorMessage("KYC details not found")
      setkycPopUpStatus(true)
    }
    // new india
    if (type === 3) {
      setiframeOpenedCarrier("newindia")
      setiframeUrl(data?.linkUrl)
      setErrorMessage("KYC details not found")
      setkycPopUpStatusNewInd(true)
    }

  }
  const paymentApicalls = (values, data) => {
    api.paymentApi(data ? data : formContext.godigitpayment).then(item => {
      console.log("payment create", item)
      const searchCityData = JSON.parse(item?.data);
      console.log("paymentData", searchCityData?.data)
      openpaymentWindow(searchCityData?.data, data)
    })
      .catch(err => {
        console.log("error", err);
        commonErrorMessage()
      }).finally(() => {
        formContext.setloaderStatus(false)
      })
  }
  const openpaymentWindow = (arraydata, generateproData) => {

    let urlCombined = arraydata?.paymentURL;
    let urlCombinedForFutureG = "/futureinsurance";
    arraydata?.paramterList?.map((mapdata, index) => {
      urlCombined = urlCombined + `${index === 0 ? "?" : "&&"}` + mapdata.name + "=" + mapdata.value
      urlCombinedForFutureG = urlCombinedForFutureG + `${index === 0 ? "?" : "&&"}` + mapdata.name + "=" + mapdata.value

      return paymentdataDestructure[mapdata.name] = mapdata.value
    })
    urlCombinedForFutureG = urlCombinedForFutureG + "&&paymentURL=" + arraydata?.paymentURL
    console.log("urlCombinedForFutureG", urlCombinedForFutureG)
    // code for futureindia
    if (formContext?.singleQuotesData.insuranceCompany === "Future Generali India Insurance Co. Ltd") {
      history.push(urlCombinedForFutureG)
    } else {

      window.open(urlCombined, '_self', "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=1100,height=1100")
    }
  }

  const commonErrorMessage = (message) => {
    setErrorMessage(message ? message : 'An error occurred. Please try again.');
    setErrorModalShow(true);
    formContext.setloaderStatus(false);
  };
  const onIframeHide = () => {
    if (iframeOpenedCarrier === "godigit") {
      paymentApicalls()
      formContext.setloaderStatus(false)
      setiframeStatus(!iframeStatus)
      setkycPopUpStatus(false)
      // next()
    } else {
      setkycPopUpStatus(false)
      setkycPopUp(false)

    }
  }

  const kycProceed = () => {
    setkycPopUpStatus(false)
    window.open(iframeUrl, '_blank', "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=1100,height=1100")
    next()
  }
  const newIndiaKycClose = (type) => {
    if (type === 1) {
      setkycPopUpStatusNewInd(false)
      paymentApicalls()


    } else {
      setkycPopUpStatusNewInd(false)
      paymentApicalls()
      window.open(iframeUrl, '_blank', "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100,width=1100,height=1100")
    }
  }
  const titleArray = [
    "Required information for KYC verification",
    "Person who is owning the vehicle and contact information",
    "Person who will receive the benefit in case of death of owner of the vehicle",
    "Address details of the person who is owning the vehicle",
    "Information about the previous policy of the same vehicle",
    "Information about the vehicle insured",
    "Payment Process",
  ];

  const pagesForRenew = [
    <KYCForm {...props} formik={formik} />,
    <OwnerContactInfo {...props} formik={formik} />,
    <Benefits {...props} formik={formik} />,
    <AddressDetailsofVehicalDetails {...props} formik={formik} />,
    <PreviousPolicyForm {...props} formik={formik} />,
    <InsuredVehical {...props} formik={formik} />,
    <PaymentForm {...props} formik={formik} />,
  ]

  const pagesForNew = [
    <KYCForm {...props} formik={formik} />,
    <OwnerContactInfo {...props} formik={formik} />,
    <Benefits {...props} formik={formik} />,
    <AddressDetailsofVehicalDetails {...props} formik={formik} />,
    <InsuredVehical {...props} formik={formik} />,
    <PaymentForm {...props} formik={formik} />,
  ]
  // Destructuring variables from the custom hook UseMultistepForm
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    UseMultistepForm(policyType === "renew" ? pagesForRenew : pagesForNew);

  /*Update the Formik field "currentStepIndex" whenever the value of
   "currentStepIndex" changes, ensuring the form reflects the current step.*/
  useEffect(() => {
    formik.setFieldValue("currentStepIndex", currentStepIndex);
  }, [currentStepIndex]);

  const returnData = (file, previewURL, type) => {
    if (type === 1) {
      seticiciKycData({ ...iciciKycData, poiFile: file, })
    }
    else {
      seticiciKycData({ ...iciciKycData, poaFile: file, })

    }
  }
  const docTypeChanges = (value, type) => {
    if (type === 1) {
      seticiciKycData({ ...iciciKycData, poitype: value, })
    }
    else {
      seticiciKycData({ ...iciciKycData, poatype: value, })

    }
  }
  const iciciKycSubmit = () => {
    for (let i in iciciKycData) {
      if (!iciciKycData[i]) {
        seticicikycError(true)
        return
      }
    }
    api.iciciKycDocSubmit(kycTokenIcici, props.carbikeformikValues?.email, iciciKycData).then(data => { console.log('data', data) }).catch(err => console.log("err", err))

    setkycPopUp(false)
  }
  useEffect(() => {
    if (props.quotesPageFormikData?.vehicalRegType === "organization") {
      setpoiType([{ value: "", label: "Please select" }, { value: "PAN", label: "PAN" }]);
      setpoAType([{ value: "", label: "Please select" }, { value: "CIN", label: "CIN" }, { value: "GSTIN", label: "GSTIN" }]);
    }
  }, [props.quotesPageFormikData?.vehicalRegType]);

  useEffect(() => {
    console.log("iciciKycData", iciciKycData)
  }, [iciciKycData]);
  // token required for icici kyc
  useEffect(() => {
    if (formContext?.singleQuotesData?.insuranceCompany === "ICICI Lombard General Insurance Co. Ltd") {
      api.iciciKycToken().then(data => { console.log("kyc data", data); setkycTokenIcici(data?.data?.data?.access_token) }).catch(err => {
      })
    }
  }, []);


  return (
    <div className="forms-wrap">
      <div className="form-title">
        <p className="form-sub-title">{titleArray[currentStepIndex]}</p>
        <p className="page-nuber">
          ({currentStepIndex + 1} / {steps.length})
        </p>
      </div>
      <form onSubmit={formik.handleSubmit}>
        {step}

        <div
          style={{
            display: "flex",
            gap: ".5rem",
            justifyContent: "flex-end",
            right: "10px",
            bottom: "20px",
          }}
          className="btn-spinner"
        >
          {!isFirstStep && (
            <Button onClick={back} className=" back-btn" disabled={formContext.loaderStatus}>
              Back
            </Button>
          )}
          < Button type="submit" className=" primary-btn" disabled={formContext.loaderStatus}>
            {isLastStep ? "Finish" : "Next"}{formContext.loaderStatus && formContext.spinner}
          </Button>
        </div>
        {/* Error Modal */}
        <VerticallyCenteredModal
          show={errorModalShow}
          onHide={() => setErrorModalShow(false)}
          heading="Error"
        >
          <p>{errorMessage}</p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <Button className=" back-btn" onClick={() => setErrorModalShow(false)}>
              Cancel
            </Button>
            {/* You can add any logic or handle actions needed for the "OK" button */}
            <Button className=" primary-btn" onClick={() => setErrorModalShow(false)}>
              OK
            </Button>
          </div>
        </VerticallyCenteredModal>
        <VerticallyCenteredModal
          show={kycPopUp}
          onHide={() => {

            onIframeHide()
          }}
          heading="KYC not found"
          hideCloseIcon={true}        >
          <div className="kyc-doc-wrap">
            <p className="text-center mt-0">Please Upload identity and address proof</p>
            <div className="upload-section">
              <div className="document-container">
                <div className="form-floating mb-4">
                  <select id="iduniqu" className="form-select" onChange={(e) => docTypeChanges(e.target.value, 1)} >
                    {poiType?.map(data => {
                      return <option value={data?.value}>{data?.label}</option>
                    })}
                  </select>
                  <label htmlFor="iduniqu select-label">identity Document</label>
                </div>
                <FileUpload returnData={returnData} type={1} />
              </div>
              <div className="document-container">
                <div className="form-floating mb-4">
                  <select id="idunique" className="form-select" onChange={(e) => docTypeChanges(e.target.value, 2)}>
                    {poAType?.map(data => {
                      return <option value={data?.value}>{data?.label}</option>
                    })}
                  </select>
                  <label htmlFor="idunique select-label">Address Document</label>
                </div>
                <FileUpload returnData={returnData} type={2} />
              </div>
            </div>
            {icicikycError && <p className="text-center" style={{ color: "red", fontSize: 16 }}>All four fileds are required </p>}
            <p className="text-center mb-0"><span className="font-weight-bold">Note:</span> Fornt and back side must be uploaded as a single image for voter ID, Passport, AADHAAR </p>
            <p className="text-center mb-0">Expected format are: pdf, jpg, jpeg, png and max size up t0 10MB. </p>
            <div className="text-center mt-3">
              <Button className="cancel-btn" onClick={() => onIframeHide()} >Cancel</Button>
              <Button className='primary-btn' onClick={() => iciciKycSubmit()}>Submit</Button>
            </div>
          </div>
        </VerticallyCenteredModal>
      </form >
      <>
        <SuccessModal show={modalShow} onHide={() => setModalShow(false)} />

        {/* Iframe value popup */}
        <VerticallyCenteredModal
          show={iframeStatus}
          onHide={() => {

            onIframeHide()
          }}
          heading="This step is mandatory to download the policy."
        >
          <div>
            <iframe
              src={iframeUrl}
              title="Please fill all data"
              width={'100%'}
              height={575}

            ></iframe>
          </div>
        </VerticallyCenteredModal>
        {/* for popup kyc */}
        <VerticallyCenteredModal
          show={kycPopUpStatus}
          onHide={() => {
            onIframeHide()
          }}
          heading="This step is mandatory to download the policy."
        >
          <div className="kyc-failed-popup">
            <div className="text-center mt-2">
              <p className="mt-2" style={{ color: 'red' }}>{errorMessage}</p>
              <div className="text-center mt-3 mb-3 text-info-label d-flex justify-content-center align-items-center"><BiSolidError className="failed-icon-custom" />Click on below Button for KYC verification</div>
              <div className=" footer-btn-wrap">
                <Button className="back-btn" onClick={() => { setkycPopUpStatus(false); return next() }}>Skip</Button>
                <Button className="primary-btn" onClick={() => { kycProceed(); }}>Proceed for KYC </Button>
              </div>
            </div>
          </div>
        </VerticallyCenteredModal>
        {/* for popup kyc new india */}
        <VerticallyCenteredModal
          show={kycPopUpStatusNewInd}
          onHide={() => {
            newIndiaKycClose(1)
          }}
          heading="This step is mandatory to download the policy."
        >
          <div className="kyc-failed-popup">
            <div className="text-center mt-2">
              <p className="mt-2" style={{ color: 'red' }}>{errorMessage}</p>
              <div className="text-center mt-3 mb-3 text-info-label d-flex justify-content-center align-items-center"><BiSolidError className="failed-icon-custom" />Click on below Button for KYC verification</div>
              <div className=" footer-btn-wrap">
                <Button className="back-btn" onClick={() => { newIndiaKycClose(1) }}>Skip</Button>
                <Button className="primary-btn" onClick={() => { newIndiaKycClose(2) }}>Proceed for KYC </Button>
              </div>
            </div>
          </div>
        </VerticallyCenteredModal>
      </>
    </div >
  );
}

function SuccessModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="success-modal"
    >
      <div className="check-icon-wrap">
        <SVG src={Done} alt="" style={{ width: "80px" }} />
      </div>
      <h3 className="text-center mt-3">Done</h3>
      <Modal.Body className="p-0">
        <p className="text-center mt-0">register successfully!</p>
      </Modal.Body>
      <Modal.Footer className="modalfooter">
        <Button className="primary-btn" onClick={props.onHide}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ContainerForForm;
