/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button, Card } from "react-bootstrap";
import Arrow from "../../images/down-arrow.svg";
import Share from "../../images/share.svg";
import reliance from "../../images/reliance.png";
import Star from "../../images/star.svg";
import Best from "../../images/best-value.svg";
import Lowest from "../../images/lowest.svg";
import futureGenrali from "../../images/futureGenrali.png";
import ICICI from "../../images/ICICI-insurance.png"
import Godigit from "../../images/Godigit.png";
import SVG from "react-inlinesvg";
import { useHistory, useParams } from "react-router-dom";
import VerticallyCenteredModal from "../commonModules/Popups/VerticallyCenteredModal";
import { useLocation } from "react-router";
import InputFieldCheckBox from "../../components/commonModules/InputFieldCheckBox";
import InputFieldRadio from "../../components/commonModules/InputFieldRadio";
import NewIndia from "../../images/new-india.png"
import InputFieldText from "../commonModules/InputFieldText";
import * as Yup from "yup";
import { useFormik } from "formik";
import ErrorMessage from "../commonModules/ErrorMessage";
import InputFieldDropdown from "../commonModules/InputFieldDropdown";
import * as api from "../../API/authCurd"
import UseFormContext from "../../../src/context/UseFormContext";
import { PageNotFound } from "../commonModules/PageNotFound"
import { FullStar } from "../pages/Rating/FullStar";
import { HalfStar } from "../pages/Rating/HalfStar";
import { ZeroStar } from "../pages/Rating/ZeroStar";
import { yearValidation, expDateValidation, dateCompare, getYearDropdown } from "../commonModules/CommonCode";
import InputFieldTextRTO from "../commonModules/InputFieldTextRTO";
import { convertDate } from "../commonModules/CommonCode";
import { propTypes } from "react-bootstrap/esm/Image";
import AutoSuggestFile from "../commonModules/AutoSuggestFile"
import { SkeletonCard } from "../commonModules/SkeletonCard";
import SignIn from "../../components/pages/SignIn";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaEye } from "react-icons/fa";
import generatePDF from 'react-to-pdf';
import { bikeFormikIntialData, initialDataQuotesPage } from "../../components/commonModules/CommonCode"
import IMAGE from "../../images/Godigit.png"
import {
  EmailIcon, EmailShareButton, FacebookMessengerIcon, FacebookMessengerShareButton,
  TelegramIcon, TelegramShareButton, WhatsappIcon, WhatsappShareButton,
} from "react-share";
var CryptoJS = require("crypto-js");


export default function QuotesPage(props) {
  // -----------------------State and var----------------------------

  let location = useLocation();
  const { id } = useParams();
  const formContext = UseFormContext();
  let history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  const [childForPopup, setchildForPopup] = useState();
  const [headingForPopup, setheadingForPopup] = useState();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [quotesResultsArray, setquotesResultsArray] = useState([]);
  const prevPageType = location?.state?.prePage
  const valuesForExpDate = expDateValidation()
  const [optArrayForPolicyExp, setoptArrayForPolicyExp] = useState(valuesForExpDate?.optionsArray);
  const [tpPolicyStatus, settpPolicyStatus] = useState(false);
  const [quotePremiumPopup, setQuotePremiumPopup] = useState(false);
  const [riderStatus, setriderStatus] = useState(false);
  const [addOnArray, setaddOnArray] = useState([]);
  const [personalAccCover, setpersonalAccCover] = useState();
  const [isTextVisible, setIsTextVisible] = React.useState(location?.state?.values?.isTextVisible);
  const registeredRtoInputRef = useRef(null);
  const [errorForOdPopup, seterrorForOdPopup] = useState(false);
  const [errorMessageForOdPopup, seterrorMessageForOdPopup] = useState("");
  const [idvSelectedValue, setidvSelectedValue] = useState(0);
  const [idvPopupStatus, setidvPopupStatus] = useState(false);
  const [loaderForQuotes, setloaderForQuotes] = useState(false);
  const [ownedByPopup, setownedByPopup] = useState(false);
  const [ownedByPopuppreviousValue, setownedByPopuppreviousValue] = useState();
  const [netPremiumForBrekupvalue, setnetPremiumForBrekupvalue] = useState();
  const [count, setcount] = useState(0);
  const [amountArray, setamountArray] = useState([
    { value: 10000, label: "10,000" },
    { value: 20000, label: "20,000" },
    { value: 30000, label: "30,000" },
    { value: 40000, label: "40,000" },
    { value: 50000, label: "50,000" },
    { value: 60000, label: "60,000" },
    { value: 70000, label: "70,000" },
    { value: 80000, label: "80,000" },
    { value: 90000, label: "90,000" },
    { value: 100000, label: "1,00,000" },
    { value: 120000, label: "1,20,000" },
    { value: 130000, label: "1,30,000" },
    { value: 140000, label: "1,40,000" },
    { value: 150000, label: "1,50,000" },
    { value: 160000, label: "1,60,000" },
    { value: 170000, label: "1,70,000" },
    { value: 180000, label: "1,80,000" },
    { value: 190000, label: "1,90,000" },
    { value: 200000, label: "2,00,000" },
  ]);
  var loadercount = 0
  const ref = useRef();
  const [idvValue, setidvValue] = useState({
    minValue: 1000000,
    maxValue: 0,
    insuredDeclareValue: 0,
    netPremium: 100000,
    betstValue: 0
  });
  const [ManufacturingDateArray, setManufacturingDateArray] = useState(getYearDropdown);
  const [shareQuotesPopup, setshareQuotesPopup] = useState(false);
  const [shareUrl, setshareUrl] = useState("https://uat1.policies365.com/");
  const [shareQuotesData, setshareQuotesData] = useState();
  const title = "chek out this quotes on policies365.com";
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
  const tpStartDateArray = location?.state?.values?.tpPolicyStartDate.split("-")
  const tpEndDateArray = location?.state?.values?.tpPolicyEndtDate.split("-")
  const initialData = {
    registeredRto: location?.state?.values?.registeredRto ? location?.state?.values?.registeredRto : "",
    make: location?.state?.values?.make ? location?.state?.values?.make : "",
    model: location?.state?.values?.model ? location?.state?.values?.model : "",
    varient: location?.state?.values?.varient ? location?.state?.values?.varient : "",
    registrationYear: location?.state?.values?.registrationYear ? location?.state?.values?.registrationYear : "",
    fuel: location?.state?.values?.fuel ? location?.state?.values?.fuel : "petrol",
    expiryDate: location?.state?.values?.previousPolicy ? convertDate(location?.state?.values?.previousPolicy, 2) : "",
    insuranceClaim: location?.state?.values?.insuranceClaim ? location?.state?.values?.insuranceClaim : "",
    noClaimBonus: location?.state?.values?.noClaimBonus ? location?.state?.values?.noClaimBonus : "",
    policyType: location?.state?.values?.policyType ? location?.state?.values?.policyType : "",
    policyTerms: location?.state?.values?.policyTerms ? location?.state?.values?.policyTerms : "",
    idv: "",
    vehicalRegType: "individual",
    zeroDep: "",
    personalCover: 50000,
    personalCoverFlag: "",
    personalAccidentCover: true,
    driverAccidentCover: "",
    driverAccidentCoverAmount: 10000,
    lpgCngKit: true,
    lpgCngKitAmount: 10000,
    accessories: "",
    electricalAccessories: "",
    electricalAccessoriesAmount: 10000,
    nonElectricalAccessories: "",
    nonElectricalAccessoriesAmount: 10000,
    roadSideAssistance: "",
    ncbProtection: "",
    engineProtector: "",
    tyreProtection: "",
    tyreDetails: "",
    tyreProtectionAmount: "",
    keyProtection: "",
    consumablesCover: "",
    baggageCover: "",
    invoiceCover: "",
    transportHotelExpenses: "",
    transportHotelExpensesAmount: "",
    addOnCover: [],
    tpPolicyStartDate: tpStartDateArray?.[0] ? tpStartDateArray?.[0] + "-" + tpStartDateArray?.[1] + "-" + tpStartDateArray?.[2] : "",
    tpPolicyEndtDate: tpEndDateArray?.[0] ? tpEndDateArray?.[0] + "-" + tpEndDateArray?.[1] + "-" + tpEndDateArray?.[2] : "",
    insuranceFor: location?.state?.values?.insuranceFor,
    isvehNumberMissing: location?.state?.values?.isvehNumberMissing,
    idvSelectedValue: "",
    formtype: location?.state?.values.formtype ? location?.state?.values.formtype : ""
  };

  const imgArrayForCard = {
    "Reliance General Insurance Co. Ltd": reliance,
    "New India Assurance": NewIndia,
    "Future Generali India Insurance Co. Ltd": futureGenrali,
    "GO DIGIT General Insurance CO. LTD": Godigit,
    "ICICI Lombard General Insurance Co. Ltd": ICICI,

  }

  const validationSchema = Yup.object().shape({
    registeredRto: Yup.string().when(["isvehNumberMissing"], {
      is: (isvehNumberMissing) => isvehNumberMissing === true,
      then: () =>
        Yup.string()
          .required("Vehicle Rto code is required")
          .matches(/^[A-Za-z]{2}\d{2}$/, "Invalid Vehicle Rto code,Eg MH12"),
      otherwise: () => Yup.string()
        .required("Vehicle Registration Number Is Required")
        .matches(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, "Invalid Vehicle Number,Eg MH12AAXXXX"),
    }),

    make: Yup.string().trim().required("Make Field Is Required"),
    model: Yup.string().trim().required("Model Field Is Required"),
    varient: Yup.string().trim().required("Variant Field Is Required"),

    registrationYear: Yup.string()
      .required("Year Field is Required")
      .test("not blank", "Select value", (value) => value !== "")
      .test("valid date", "Future date is not allowed", (value) => {
        const currentDate = new Date();
        const inputDate = new Date(value);
        return inputDate <= currentDate;
      })
      .test("valid range", "Date should be within the past 50 years", (value) => {
        return yearValidation(value, 50);
      }),
    expiryDate: Yup.date()
      .required("Date is Required"),
    insuranceClaim: Yup.string()
      .trim()
      .required("Insurance Claim Field Is Required")
      .test("not blank", "Select value", (value) => {
        return value !== "";
      }),
    noClaimBonus: Yup.string()
      .trim()
      .required("Field Is Required")
      .test("not blank", "Select value", (value) => {
        return value !== "";
      }),
    policyType: Yup.string().trim().required("Policy Type Field Is Required"),
    // policyTerms: Yup.string()
    //   .trim()
    //   .required("policy  Terms Field Is Required"),

    policyTerms: Yup.string().when(["formtype"], {
      is: (formtype) => formtype === "bike",
      then: () =>
        Yup.string()
          .required("Vehicle Rto code is required")
    }),

  });

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsFormDirty(false);
      apiTocreateQuotes(values, idvSelectedValue)
    },
  });

  const buyNow = (data) => {
    const userLogin = sessionStorage.getItem('userLoggin');
    formContext.setsingleQuotesData(data);
    if (userLogin) {
      history.push("/proposal");
      formContext.setquotesPageFormikData(formik?.values);
      formContext.setloaderStatus(false)
    } else {
      formContext.setPages('Quotes');
      formContext.setloginPopupStatus(true)
    }
  }
  const apiTocreateQuotes = (values, idv) => {
    formContext.setloaderStatus(true)
    setloaderForQuotes(true)
    if (formContext.carbikeformikValues?.formtype === "bike") {
      api.createQoteApi(values, idv, formContext?.PolicyDates?.QUOTE_ID).then(data => { redirectMethod(values, data) }).catch(err => {
        console.log("error", err); formContext.notifyError("An error occurred while fetching data");
        formContext.setquotesPageFormikData()
        formContext.setloaderStatus(false)
        setloaderForQuotes(false)

      })
        .finally(() => {
          // Set loader back to false
          setIsFormDirty(false);
        });
    } else {
      api.createQoteApiCar(values, idv, formContext?.PolicyDates?.QUOTE_ID).then(data => { redirectMethod(values, data) }).catch(err => {
        console.log("error", err); formContext.notifyError("An error occurred while fetching data");
        formContext.setquotesPageFormikData()
        formContext.setloaderStatus(false)
        setloaderForQuotes(false)

      })
        .finally(() => {
          // Set loader back to false
          setIsFormDirty(false);
        });
    }

  }

  const handleIdvPopupSave = (carbikevalue, idvvalue) => {
    if (!idvvalue) {
      seterrorMessageForOdPopup("Please Select IDV")
      seterrorForOdPopup(true)
      return
    }
    setidvPopupStatus(false)
    apiTocreateQuotes(carbikevalue, idvvalue)

  }
  const handleIdvCancle = () => {
    setidvPopupStatus(false)
    setidvSelectedValue()
    formik.setFieldValue("idv", "")
    seterrorForOdPopup(false)
  }

  const redirectMethod = (values, data) => {
    formContext.setgetquotesApiFlag(true)
    setquotesResultsArray([])// to clear previous qotes
    const JsonDataForCreateQuotes = JSON.parse(data.data);
    sessionStorage.setItem("quoteId", JsonDataForCreateQuotes?.QUOTE_ID)
    formContext.setPolicyDates(JsonDataForCreateQuotes)
    console.log("qotes create", JsonDataForCreateQuotes.data)
    formContext.setcreatequotesresult(JsonDataForCreateQuotes.data)

  }
  // ------------------------useEffect-----------------------------
  // to update share quotes url
  useEffect(() => {
    if (formContext?.PolicyDates?.QUOTE_ID) {
      const quoteID = CryptoJS.AES.encrypt(formContext?.PolicyDates?.data?.[0]?.QUOTE_ID, 'dynamipass').toString();
      console.log("formContext?.PolicyDates?.QUOTE_ID", formContext?.PolicyDates)

      setshareUrl(`https://uat1.policies365.com/quotes?quoteID=${formContext?.PolicyDates?.QUOTE_ID}`)
    }
  }, [formContext?.PolicyDates]);
  // to get share quote id from url , and pass that value to api
  useEffect(() => {
    let params = new URLSearchParams(window.location.search)
    const quotesID = params.get("quoteID")
    if (quotesID) {
      // sessionStorage.setItem("quoteId", quotesID)

      var bytes = CryptoJS.AES.decrypt(quotesID, 'dynamipass');
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      formContext.setloaderStatus(true)
      setloaderForQuotes(true)

      api.shareQuotes(quotesID).then(data => {
        const jsonData = JSON.parse(data.data)
        const businessLineId = jsonData?.data.businessLineId
        var nestedDataVeh
        var nestedData
        var nestedDate
        if (businessLineId === 2) {
          formContext.setroutingPath("/bike/1")
          setquotesResultsArray(jsonData?.data?.bikeQuoteResponse)
          nestedData = jsonData?.data?.bikeQuoteRequest?.quoteParam
          nestedDataVeh = jsonData?.data?.bikeQuoteRequest?.vehicleInfo
          nestedDate = jsonData?.data?.bikeQuoteRequest
        } else {
          formContext.setroutingPath("/car/1")
          setquotesResultsArray(jsonData?.data?.carQuoteResponse)
          nestedData = jsonData?.data?.carQuoteRequest?.quoteParam
          nestedDataVeh = jsonData?.data?.carQuoteRequest?.vehicleInfo
          nestedDate = jsonData?.data?.carQuoteRequest

        }
        console.log("share quotes jsonData", jsonData?.data)

        var policyTypeArray = nestedData?.planType?.split("-")
        var policyType
        var policyTerm

        if (policyTypeArray?.length === 3) {
          policyType = policyTypeArray[0] + "-" + policyTypeArray[1]
          policyTerm = policyTypeArray[2]

        } else {
          policyType = policyTypeArray[0]
          policyTerm = policyTypeArray[1]
          // for car
          if (businessLineId === 3 && policyTypeArray?.length === 2) {
            policyType = policyTypeArray[0] + "-" + policyTypeArray[1]
          }
          else if (businessLineId === 3 && policyTypeArray?.length === 1) {
            policyType = policyTypeArray[0]
          }

        }

        const objForCarBike = {
          "noClaimBonus": nestedData?.ncb,
          "insuranceFor": nestedData?.policyType,
          "addOnCover": nestedData?.riders,
          "lastName": nestedData?.lastName,
          "insuranceClaim": nestedDataVeh?.previousClaim,
          "previousPolicy": nestedData?.policyType === "new" ? valuesForExpDate.todayConvertedValue : nestedDataVeh?.PreviousPolicyExpiryDate,
          "firstName": nestedData?.firstName,
          "email": nestedData?.email,
          "phoneNumber": nestedData?.phoneNumber,
          "currentStepIndex": "1",
          "policyType": policyType,
          "policyTerms": policyTerm,
          "make": nestedDataVeh.make,
          "model": nestedDataVeh.model,
          "varient": nestedDataVeh.variant,
          "registeredRto": nestedDataVeh?.RTOCode,
          "registrationYear": convertDate(nestedDataVeh?.dateOfRegistration, 2),
          "formtype": jsonData?.data.businessLineId === 2 ? "bike" : "car",
          "fuel": nestedDataVeh.fuel ? nestedDataVeh.fuel : "petrol",

        }


        const objForQuotesPage = {
          "noClaimBonus": nestedData?.ncb,
          "insuranceFor": nestedData?.policyType,
          "addOnCover": nestedData?.riders,
          "insuranceClaim": nestedDataVeh?.previousClaim,
          "policyType": policyType,
          "policyTerms": policyTerm,
          "make": nestedDataVeh.make,
          "model": nestedDataVeh.model,
          "varient": nestedDataVeh.variant,
          "registeredRto": nestedDataVeh.RTOCode,
          "registrationYear": convertDate(nestedDataVeh?.dateOfRegistration, 2),
          "expiryDate": convertDate(nestedDataVeh?.PreviousPolicyExpiryDate, 2),
          "fuel": nestedDataVeh.fuel ? nestedDataVeh.fuel : "petrol",
          "idv": nestedDataVeh?.IDV,
          "vehicalRegType": nestedData?.ownedBy === "Individual" ? "individual" : "organization",
          "zeroDep": "",
          "personalCover": 50000,
          "personalCoverFlag": "",
          "personalAccidentCover": false,
          "driverAccidentCover": "",
          "driverAccidentCoverAmount": 10000,
          "lpgCngKit": "",
          "lpgCngKitAmount": "",
          "accessories": "",
          "electricalAccessories": "",
          "electricalAccessoriesAmount": "",
          "nonElectricalAccessories": "",
          "nonElectricalAccessoriesAmount": "",
          "roadSideAssistance": "",
          "ncbProtection": "",
          "engineProtector": "",
          "tyreProtection": "",
          "tyreDetails": "",
          "tyreProtectionAmount": "",
          "keyProtection": "",
          "consumablesCover": "",
          "baggageCover": "",
          "invoiceCover": "",
          "transportHotelExpenses": "",
          "transportHotelExpensesAmount": "",
          "tpPolicyStartDate": nestedDataVeh?.TPPolicyStartDate,
          "tpPolicyEndtDate": nestedDataVeh?.TPPolicyExpiryDate,
          "isvehNumberMissing": true,
          "idvSelectedValue": nestedDataVeh?.IDV,
          "formtype": jsonData?.data.businessLineId === 2 ? "bike" : "car"

        }

        const valuesForCarBike = { ...bikeFormikIntialData, ...objForCarBike }
        const valuesForQuotes = { ...initialDataQuotesPage, ...objForQuotesPage }

        formik.setValues(valuesForQuotes);
        formContext.setquotesPageFormikData(valuesForQuotes)
        formContext.setcarbikeformikValues(valuesForCarBike)

        // saving dates and date which are required while creating quotes and on propsal page respectively
        const policydates = {
          QUOTE_ID: jsonData?.data?.QUOTE_ID,
          policyDate: {
            policyStartDate: nestedDate?.systemPolicyStartDate?.sysPolicyStartDate
          }
        }
        formContext.setPolicyDates(policydates)

        // setting up rider values
        nestedData?.riders?.forEach(element => {
          // riders for bike
          if (businessLineId === 2) {

            switch (element.riderId) {
              case 10:
                formik.setFieldValue("personalAccidentCover", true)
                break;
              case 11:
                formik.setFieldValue("zeroDep", true)
                break;
              case 28:
                formik.setFieldValue("personalCoverFlag", true)
                formik.setFieldValue("personalCover", element?.riderAmount)
                break;

              default:
                console.log("Default123")
                break;
            }
          }
          else {
            // riders for cars
            switch (element.riderId) {
              case 11:
                formik.setFieldValue("personalAccidentCover", true)
                break;
              case 6:
                formik.setFieldValue("zeroDep", true)
                break;
              case 21:
                formik.setFieldValue("personalCoverFlag", true)
                formik.setFieldValue("personalCover", element?.riderAmount)
                break;


              case 20:
                formik.setFieldValue("driverAccidentCover", true)
                formik.setFieldValue("driverAccidentCoverAmount", element?.riderAmount)
                break;

              case 35:
                formik.setFieldValue("lpgCngKit", true)
                formik.setFieldValue("lpgCngKitAmount", element?.riderAmount)
                break;

              case 25:
                formik.setFieldValue("electricalAccessories", true)
                formik.setFieldValue("electricalAccessoriesAmount", element?.riderAmount)
                formik.setFieldValue("accessories", true)
                break;

              case 30:
                formik.setFieldValue("nonElectricalAccessories", true)
                formik.setFieldValue("nonElectricalAccessoriesAmount", element?.riderAmount)
                formik.setFieldValue("accessories", true)
                break;

              case 9:
                formik.setFieldValue("roadSideAssistance", true)
                break;

              case 7:
                formik.setFieldValue("ncbProtection", true)
                break;

              case 8:
                formik.setFieldValue("engineProtector", true)
                break;

              case 37:
                formik.setFieldValue("tyreProtection", true)
                formik.setFieldValue("tyreProtectionAmount", element?.riderAmount)
                break;
              case 23:
                formik.setFieldValue("keyProtection", true)
                break;

              case 10:
                formik.setFieldValue("invoiceCover", true)
                break;
              case 41:
                formik.setFieldValue("transportHotelExpenses", true)
                formik.setFieldValue("transportHotelExpensesAmount", element?.riderAmount)
                break;
              case 24:
                formik.setFieldValue("consumablesCover", true)
                break;
              case 40:
                formik.setFieldValue("baggageCover", true)
                break;
              default:
                break;
            }
          }
        });

        // idv selected value
        setidvSelectedValue(nestedDataVeh?.IDV)
        // to fix personalAccCover checkbox issue(by default selected)
        const singleRider = nestedData?.riders.find(data => data.riderName === "Personal Accident cover")
        const singleRiderForLpg = nestedData?.riders.find(data => data.riderName === "LPG-CNG Kit")

        setTimeout(() => {
          if (!singleRider) {
            formik.setFieldValue("personalAccidentCover", false)
          }
          if (!singleRiderForLpg) {
            formik.setFieldValue("lpgCngKit", false)
          }
          settimeoutMethod()

        }, 1000);

        setshareQuotesData(valuesForQuotes)

      }).catch(err => { console.log("share quotes err", err) }).finally(fin => {
        formContext.setloaderStatus(false)
        setloaderForQuotes(false)
      })
    }
  }, []);


  useEffect(() => {
    console.log("formik.values", formik.values)
    console.log("formContext.setcarbikeformikValues", formContext.carbikeformikValues)
    console.log("formContext.setquotesPageFormikData", formContext.quotesPageFormikData)
  }, [formik.values]);

  // to redirect user after login success
  useEffect(() => {
    if (formContext?.loginPopupStatus === false && sessionStorage.getItem('userLoggin') && quotesResultsArray.legth > 0) {
      history.push("/proposal");
      formContext.setquotesPageFormikData(formik?.values);
      formContext.setloaderStatus(false)
    }
  }, [formContext?.loginPopupStatus]);
  useEffect(() => {
    const isPageRefreshed = sessionStorage.getItem('isPageRefreshed');

    if (isPageRefreshed) {
      // Redirect to the home page
      let params = new URLSearchParams(window.location.search)
      const quotesID = params.get("quoteID")
      const shareId = sessionStorage.getItem("quoteId") ? sessionStorage.getItem("quoteId") : quotesID
      // Redirect to the home page
      history.replace(`/paymentFailed/${shareId}`);

    }

    // Set the flag indicating the page has been refreshed
    sessionStorage.setItem('isPageRefreshed', 'true');

    // Clean up the sessionStorage when the component is unmounted
    return () => {
      sessionStorage.removeItem('isPageRefreshed');
    };
  }, [history]);

  // useEffect to track changes in formik values and set a flag if the form is dirty

  useEffect(() => {
    if (formik.dirty) {
      setIsFormDirty(true);
    }
  }, [formik?.values, formik?.dirty]);

  useEffect(() => {
    settimeoutMethod()
    formContext.setPages('Quotes');
    sessionStorage.removeItem("nextPage")

  }, []);
  useEffect(() => {
    // to hide policy type if new one is selected
    if (formContext.carbikeformikValues?.insuranceFor === "new") {
      formik.setFieldValue("policyTerms", 3)
      setarrayForPolicyType(policyType.filter((task) => task.label === "Comprehensive"))
    } else {
      setarrayForPolicyType(policyType)
    }
  }, [formContext.carbikeformikValues?.insuranceFor]);

  //useEffect is used to set the RegisteredRto values
  useEffect(() => {
    formContext?.setselectedRto("")
  }, []);
  useEffect(() => {
    if (id) { formContext.setgetquotesApiFlag(false) }

    if (id && formContext.quotesPageFormikData) {
      formik.setValues({
        ...formik.initialValues,
        ...formContext.quotesPageFormikData
      });
      setquotesResultsArray(formContext.quotesList)
      setTimeout(() => {
        setidvSelectedValue(formContext.quotesPageFormikData?.idvSelectedValue)
      }, 1000);
    }

  }, []);
  useEffect(() => {
    if (formContext.selectedRto?.length > 0) {
      formik.setFieldValue("registeredRto", formContext.selectedRto)
    }
  }, [formContext.selectedRto]);

  useEffect(() => {
    setIsFormDirty(true)
  }, [formik.values.personalAccidentCover]);

  //useEffect is used to fetch and display a single record based on certain conditions.
  useEffect(() => {
    setcount(0)
    loadercount = 0
    // Finding a single record from the API response based on the condition that qname includes "RelianceGenBikeResQ"
    const singlerecord = formContext.createquotesresult
    if (singlerecord?.length > 0 && formContext.getquotesApiFlag) {
      setloaderForQuotes(true)
      for (let i = 0; i < singlerecord?.length; i++) {
        getQoteResult(singlerecord[i], i, singlerecord?.length)
      }
    }

  }, [formContext.createquotesresult]);



  useEffect(() => {
    if (formik?.values?.policyType === "OD") {
      if (!formik?.values?.tpPolicyStartDate) {
        settpPolicyStatus(true)
      }
    } else if (formik?.values?.policyType === "TD" || formik?.values?.policyType === "OD-TP") {
      formik.setFieldValue("tpPolicyStartDate", "")
      formik.setFieldValue("tpPolicyEndtDate", "")

    }

  }, [formik?.values?.policyType]);



  // -------------------------methods and jsx----------------------
  const settimeoutMethod = () => {
    setTimeout(() => {
      setIsFormDirty(false);

    }, 500);
  }
  const backButtonPressed = () => {
    history.push(formContext.routingPath);
  };
  const popupReturnMethod = (child, heading) => {
    setModalShow(true);
    setheadingForPopup(heading);
    setchildForPopup(child);
  };

  // Function to retrieve a quote result using API
  const getQoteResult = (singlerecord, currentIndex, actuallength) => {
    formContext.setloaderStatus(true)

    api.getQoteApi(singlerecord?.qname, singlerecord?.messageId, singlerecord?.QUOTE_ID, formContext.carbikeformikValues?.formtype).then(data => { apiResopnse(data, actuallength, currentIndex) }).catch(err => {
      console.log("error", err);
    }).finally(() => {
      setcount((prev) => prev + 1)
      loadercount = loadercount + 1
      setTimeout(() => {
        if (actuallength === loadercount) {
          formContext.setloaderStatus(false);
          setloaderForQuotes(false)
        }
      }, 1000);

    })
  }

  const apiResopnse = (data, actuallength, currentIndex) => {
    const jsonData = JSON.parse(data?.data)?.data
    if (jsonData?.quotes) {
      setquotesResultsArray((prevdata) => { return [...prevdata, ...jsonData?.quotes] })
    }
  }



  useEffect(() => {
    console.log("addOnArray", addOnArray)
    formik.setFieldValue("addOnCover", addOnArray)
  }, [addOnArray]);

  useEffect(() => {
    console.log("quotesResultsArray", quotesResultsArray)
    if (quotesResultsArray?.length > 0) {

      setTimeout(() => {

        let tempArray = {
          minValue: 1000000,
          maxValue: 0,
          insuredDeclareValue: 0,
          netPremium: 100000,
          betstValue: 0
        }
        const filterdData = quotesResultsArray?.filter((filterData) => (Number(filterData?.netPremium)) !== 0)

        for (let i = 0; i < filterdData?.length; i++) {
          const minIdvValue = Number(filterdData[i]?.minIdvValue)
          const maxIdvValue = Number(filterdData[i]?.maxIdvValue)
          const netPremium = Number(filterdData[i]?.netPremium)
          const insuredDeclareValue = Number(filterdData[i]?.insuredDeclareValue)

          const minValueidv = Number(tempArray?.minValue)
          const maxValueidv = Number(tempArray?.maxValue)
          const netPremiumIdv = Number(tempArray?.netPremium)
          const betstValue = Number(tempArray?.betstValue)

          if (minIdvValue <= minValueidv && minIdvValue !== 0) {
            tempArray.minValue = minIdvValue
          }
          if (maxIdvValue >= maxValueidv && maxIdvValue !== 0) {
            tempArray.maxValue = maxIdvValue
          }

          if (netPremium <= netPremiumIdv) {
            tempArray.netPremium = netPremium
          }
          if (insuredDeclareValue >= betstValue && insuredDeclareValue > 0) {
            tempArray.betstValue = insuredDeclareValue
          }
        }

        setidvValue(tempArray)
        tempArray = {
          minValue: 1000000,
          maxValue: 0,
          insuredDeclareValue: 0,
          netPremium: 100000,
          betstValue: 0
        }
      }, 1000);
      formContext.setquotesList(quotesResultsArray)
    } else {
      setidvValue({
        minValue: 0,
        maxValue: 0,
        insuredDeclareValue: 0,
        netPremium: 100000,
        betstValue: 0
      })
    }
  }, [quotesResultsArray]);


  const openQuotePopup = (data) => {
    console.log("data", data)
    var premium = 0
    var odpremium = 0
    // for new india we get array for net premium and for idv so we need this logic
    if (typeof (data?.netPremium) === "object") {
      data?.netPremium?.forEach((foreachdata, index) => {
        premium = premium + foreachdata
      })
    }
    else {
      premium = data?.netPremium
    }
    if (typeof (data?.odpremium) === "object") {
      data?.odpremium?.forEach((foreachdata, index) => {
        odpremium = odpremium + foreachdata
      })
    }
    else {
      odpremium = data?.odpremium
    }
    setnetPremiumForBrekupvalue({ premium: premium, odpremium: odpremium })
    formContext.setsingleQuotesData(data);
    setQuotePremiumPopup(!quotePremiumPopup);
  };

  useEffect(() => {
    console.log("formContext.singleQuotesData", formContext.singleQuotesData)
  }, [formContext.singleQuotesData]);

  const QpPopupClose = () => {
    setQuotePremiumPopup(false);
  };
  useEffect(() => {
    let arrayForAddon = [];

    if (formContext.carbikeformikValues?.formtype === "bike") {
      if (formik?.values?.zeroDep) {
        arrayForAddon.push({
          "riderId": 11,
          "riderName": "Zero Depreciation cover"
        })
      }
      if (formik?.values?.personalCoverFlag) {
        arrayForAddon.push({
          "riderId": 28,
          "riderName": "Passenger Cover",
          "riderAmount": formik.values?.personalCover
        })
      }

      if (formik?.values?.personalAccidentCover) {
        arrayForAddon.push({
          "riderName": "Personal Accident cover",
          "riderId": 10
        })
      }

    }
    // Check if Passenger Accident Cover is selected
    else {
      if (formik?.values?.personalCoverFlag) {
        arrayForAddon.push({
          "riderId": 21,
          "riderName": "Passenger Cover",
          "riderAmount": formik.values?.personalCover
        });
      }
      // Check if Zero Depreciation cover is selected
      if (formik?.values?.zeroDep) {
        arrayForAddon.push({
          "riderId": 6,
          "riderName": "Zero Depreciation cover",
        })
      }
      // Check if Personal Accident Cover is selected
      if (formik?.values?.personalAccidentCover) {
        arrayForAddon.push({
          "riderId": 11,
          "riderName": "Personal Accident Cover",
        })
      }
      // Check if Driver Accident cover is selected
      if (formik?.values?.driverAccidentCover) {
        arrayForAddon.push({
          "riderId": 20,
          "riderName": "Driver Accident Cover",
          "riderAmount": formik.values?.driverAccidentCoverAmount
        });
      }
      // Check if LPG-CNG Kit cover is selected
      if (formik?.values?.lpgCngKit) {
        arrayForAddon.push({
          "riderId": 35,
          "riderName": "LPG-CNG Kit",
          "riderAmount": formik.values?.lpgCngKitAmount
        });
      }
      if (formik?.values?.accessories) {
        // Check if Electrical Accessories cover is selected
        if (formik?.values?.electricalAccessories) {
          arrayForAddon.push({
            "riderId": 25,
            "riderName": "Electrical Accessories",
            "riderAmount": formik.values?.electricalAccessoriesAmount
          });
        }
        // Check if Non-Electrical Accessories cover is selected
        if (formik?.values?.nonElectricalAccessories) {
          arrayForAddon.push({
            "riderId": 30,
            "riderName": "Non-Electrical Accessories",
            "riderAmount": formik.values?.nonElectricalAccessoriesAmount
          });
        }
      }
      // Check if Road Side Assistance cover is selected
      if (formik?.values?.roadSideAssistance) {
        arrayForAddon.push({
          "riderId": 9,
          "riderName": "24X7 Road Side Assistance",
        });
      }
      // Check if NCB Protection cover is selected
      if (formik?.values?.ncbProtection) {
        arrayForAddon.push({
          "riderId": 7,
          "riderName": "NCB Protection",
        });
      }

      // Check if Engine Protector cover is selected
      if (formik?.values?.engineProtector) {
        arrayForAddon.push({
          "riderId": 8,
          "riderName": "Engine Protector",
        });
      }

      // Check if Tyre Protection is selected
      if (formik?.values?.tyreProtection) {
        arrayForAddon.push({
          "riderId": 37,
          "riderName": "Tyre Secure",
          "TyreDetails": formik.values?.tyreProtectionAmount
        });
      }
      // Check if Key Protection is selected
      if (formik?.values?.keyProtection) {
        arrayForAddon.push({
          "riderId": 23,
          "riderName": "Key Replacement cover",
        });
      }
      // Check if invoice cover is selected
      if (formik?.values?.invoiceCover) {
        arrayForAddon.push({
          "riderId": 10,
          "riderName": "Invoice Cover",
        });
      }

      // Check if Transport Hotel Expenses cover is selected
      if (formik?.values?.transportHotelExpenses) {
        arrayForAddon.push({
          "riderId": 41,
          "riderName": "Emergency Transport and Hotel Expenses",
          "riderAmount": formik.values?.transportHotelExpensesAmount
        });
      }
      // Check if Consumable cover is selected
      if (formik?.values?.consumablesCover) {
        arrayForAddon.push({
          "riderId": 24,
          "riderName": "Consumables cover",
        });
      }

      // Check if Baggage cover is selected
      if (formik?.values?.baggageCover) {
        arrayForAddon.push({
          "riderId": 40,
          "riderName": "Baggage cover",
        });
      }

    }
    setaddOnArray(arrayForAddon)
  }, [formik?.values?.personalCoverFlag, formik?.values?.transportHotelExpensesAmount, formik?.values?.tyreProtectionAmount, formik?.values?.nonElectricalAccessoriesAmount, formik?.values?.lpgCngKitAmount, formik.values?.electricalAccessoriesAmount, formik?.values?.driverAccidentCoverAmount, formik?.values?.personalCover, formik?.values?.zeroDep, formik?.values?.personalAccidentCover, formik?.values?.consumablesCover, formik?.values?.baggageCover, formik?.values?.invoiceCover, formik?.values?.roadSideAssistance, formik?.values?.tyreProtection, formik?.values?.keyProtection, formik?.values?.engineProtector, formik?.values?.ncbProtection, formik?.values?.driverAccidentCover, formik?.values?.lpgCngKit, formik?.values?.accessories, formik?.values?.transportHotelExpenses, formik?.values?.nonElectricalAccessories, formik?.values?.electricalAccessories]);


  useEffect(() => {
    if (formik.values.policyType === "TP") {
      formik.setFieldValue("zeroDep", false)
      formik.setFieldValue("roadSideAssistance", false)
      formik.setFieldValue("consumablesCover", false)
      formik.setFieldValue("engineProtector", false)
      formik.setFieldValue("ncbProtection", false)
      formik.setFieldValue("tyreProtection", false)
      formik.setFieldValue("keyProtection", false)
      formik.setFieldValue("baggageCover", false)
      formik.setFieldValue("invoiceCover", false)
      formik.setFieldValue("transportHotelExpenses", false)
      formik.setFieldValue("electricalAccessories", false)
      formik.setFieldValue("nonElectricalAccessories", false)
      formik.setFieldValue("accessories", false)

    }
    if (formik.values.policyType === "OD") {
      formik.setFieldValue("personalCoverFlag", false)
      formik.setFieldValue("driverAccidentCover", false)
      formik.setFieldValue("personalAccidentCover", false)
      if (formik.values.type === "bike") {
        formik.setFieldValue("electricalAccessories", false)
        formik.setFieldValue("nonElectricalAccessories", false)
        formik.setFieldValue("accessories", false)
      }
    }
    if (formik.values.policyType === "OD-TP") {
      formik.setFieldValue("personalAccidentCover", true)

    }

  }, [formik.values.policyType]);

  // lpg/cng flag bydefault true logic
  useEffect(() => {
    const value1 = "petrol\+lpg"
    const value2 = "petrol\+cng"
    if (formik.values.fuel === value1 || formik.values.fuel === value2) {
      formik.setFieldValue("lpgCngKit", true)
    } else {
      formik.setFieldValue("lpgCngKit", false)

    }
  }, [formik.values.fuel]);


  // Resets the form using Formik's resetForm function and sets form dirty state to false.
  const handleCancel = () => {
    console.log("setshareQuotesData", shareQuotesData)
    const personalAccCoverBackup = formik.values.personalAccidentCover
    formik.resetForm();
    formik.setFieldValue('personalAccidentCover', personalAccCoverBackup)
    if (shareQuotesData) {
      formik.setValues(shareQuotesData);
    }
    settimeoutMethod()
  };

  useEffect(() => {
    if (formik?.values?.idv) {
      setidvSelectedValue(idvValue?.[formik?.values?.idv])
    }
  }, [formik?.values?.idv]);
  // to set idv selected value when comes back from proposal
  useEffect(() => {
    formik.setFieldValue("idvSelectedValue", Number(idvSelectedValue))
  }, [idvSelectedValue]);

  // Marks the form as not dirty when the save action is triggered.
  const handleSave = () => {
    setshareQuotesData(formik?.values);
    formContext.setquotesPageFormikData(formik?.values)
    formik.handleSubmit();
  };

  // to give ratings
  const giveRating = (rating) => {
    return (<div className="">
      {(rating >= 1)
        ? <FullStar />
        : (rating >= 0.5)
          ? <HalfStar />
          : <ZeroStar />
      }
      {(rating >= 2)
        ? <FullStar />
        : (rating >= 1.5)
          ? <HalfStar />
          : <ZeroStar />
      }
      {(rating >= 3)
        ? <FullStar />
        : (rating >= 2.5)
          ? <HalfStar />
          : <ZeroStar />
      }
      {(rating >= 4)
        ? <FullStar />
        : (rating >= 3.5)
          ? <HalfStar />
          : <ZeroStar />
      }
      {(rating >= 5)
        ? <FullStar />
        : (rating >= 4.5)
          ? <HalfStar />
          : <ZeroStar />
      }
    </div>
    )
  }
  const handleSpanClick = () => {
    formContext.setisvehNumberMissing(!formContext.isvehNumberMissing)
    formik.setFieldValue("isvehNumberMissing", !formContext.isvehNumberMissing)
    setIsTextVisible(predata => !isTextVisible);
    if (isTextVisible) {
      registeredRtoInputRef.current.focus();
    } else {
      formContext.setModalShow(true);
    }
  };
  const odPopupClose = (type) => {
    if (!formik?.values?.tpPolicyEndtDate || !formik?.values?.tpPolicyStartDate) {
    }
    if (type === 1) {
      formik.setFieldValue("policyType", "")
      formik.setFieldValue("tpPolicyEndtDate", "")
      formik.setFieldValue("tpPolicyStartDate", "")
      seterrorForOdPopup(false)

    } else {
      const { properDates, dateValid, isFutureDate, policyStartAge, policyEndAge, validRegYear, dateshouldGreaterThanReg, isvalidEndDate } = dateCompare(formik?.values?.tpPolicyStartDate, formik?.values?.tpPolicyEndtDate, formik.values?.registrationYear, formik.values?.formtype)
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
        setErrorMessage(`Policy end date should be with in ${formik.values?.formtype === "bike" ? "five" : "three"} year from Policy start date`)
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

  const closeShareQuptes = () => {
    setshareQuotesPopup(false)

  }
  // jsx
  const popForIdvMinIdv = (
    <>
      {" "}
      <Form className="IDV">

        <InputFieldRadio
          formikFieldName="idv"
          optionsArray={[
            { value: "maxValue", label: "BEST DEAL", name: "IDV" },
            { value: "minValue", label: "MIN IDV", name: "IDV" },
            { value: "insuredDeclareValue", label: "YOUR IDV", name: "IDV" },
          ]}
          formik={formik}
        />
        <FloatingLabel controlId="floatingPassword" >
          <Form.Control placeholder="" className="floating-input"
            value={Number(idvSelectedValue)?.toFixed(0)}
            disabled />
        </FloatingLabel>
        <div className="price-wrap">
          <span className="">₹ {Number(idvValue?.minValue)?.toFixed(0)}  </span>
          <span className="">₹ {Number(idvValue.maxValue)?.toFixed(0)}</span>
        </div>
        <div className="range">
          <input className="rangeinput" type="range" id="points " name="points" min={idvValue?.minValue || 0} max={idvValue.maxValue || 0} value={idvSelectedValue} onChange={(e) => { setidvSelectedValue(e.target.value); formik.setFieldValue("idv", "insuredDeclareValue") }} />
        </div>
        {errorForOdPopup && <div style={{ color: "red" }}>{errorMessageForOdPopup}</div>}
        <div className="text-center mt-4 footer-btn-wrap">
          <Button className="back-btn" onClick={() => { handleIdvCancle() }} >Cancel</Button>
          <Button className="primary-btn" onClick={() => { handleIdvPopupSave(formik.values, idvSelectedValue) }} >Save</Button>
        </div>
      </Form>
    </>
  );
  const popPersonalAccident = (
    <>
      {" "}
      <Form>
        <div className="personal-accident">
          <p className="text-color">
            This policy covers the owner for death or disability due to an
            accident. Owner (in case of disability) or nominee (in case of death)
            will get 15 lakhs.
          </p>
          <p>YOU CAN BUY A PLAN WITHOUT PA COVER IN FOLLOWING CASES.</p>
          <ul className="list-style text-color">
            <li>The bike is registered in a company's name.</li>
            <li> You already have a Standalone PA Cover of 15 lakhs.</li>
            <li>You don't have valid driving license.</li>
          </ul>
          <div className="checkbox-row">
            <InputFieldCheckBox formik={formik} formikFieldName="personalAccidentCover" label="I declare that the vehicle is either company owned by an individual with existing Personal Accident(PA) cover of Rs.15 lakhs" />
          </div>
          <div className="text-center mt-4 footer-btn-wrap">
            <Button className="cancel-btn" onClick={() => {
              setpersonalAccCover(!personalAccCover)
              formik.setFieldValue("personalAccidentCover", "")
            }}>No Need</Button>
          </div>
        </div>
      </Form>
    </>
  );
  const popForAdditionalCover = (
    <>
      <Form className="additional-cover-form" >
        <div className="inner-container">
          <div className="left-cover">
            {formik.values.policyType !== "TP" && <div className="checkbox-row mb-3">
              <InputFieldCheckBox
                formik={formik}
                formikFieldName="zeroDep"
                label="Zero Depreciation cover"
              />
              <div className="padding-left">
                <span className="help-text">
                  Also known as "nil depreciation" or "bumper-to-bumper" insurance, provides full coverage for repair or replacement costs without factoring the vehicle body part depreciation.
                </span>
              </div>
            </div>}
            {formik.values.policyType !== "TP" && <div className="checkbox-row mb-3">
              <InputFieldCheckBox
                formik={formik} formikFieldName="roadSideAssistance"
                label="Roadside Assistance" />
              <div className="padding-left">
                <span className="help-text">
                  In the event of vehicle breakdowns or emergencies, the add on will provide assistance and support services to policyholders.
                </span>
              </div>
            </div>}
            {formik.values.policyType !== "TP" && <div className="checkbox-row mb-3">
              <InputFieldCheckBox
                formik={formik} formikFieldName="engineProtector"
                label="Engine and Gearbox Protection" />
              <div className="padding-left">
                <span className="help-text">
                  The add-on provides protection for repair or replacement costs incurred due to damage to the insured vehicle's engine and gearbox.
                </span>
              </div>
            </div>}
            {formik.values.policyType !== "TP" && <div className="checkbox-row mb-3">
              <InputFieldCheckBox
                formik={formik} formikFieldName="consumablesCover"
                label="Consumables cover" />
              <div>
                <span className="help-text">
                  The add-on provides protection for the reimbursement of expenses related to consumable items, such as engine oil, coolant, and nuts and bolts, incurred during repairs.
                </span>
              </div>
            </div>}
            {formik.values.policyType !== "TP" && <div className="checkbox-row">
              <InputFieldCheckBox
                formik={formik} formikFieldName="invoiceCover"
                label="Return to Invoice" />
              <div className="padding-left">
                <span className="help-text">
                  In the event of a total loss or theft of the insured vehicle, the policyholder receives the original invoice value of the vehicle.
                </span>
              </div>
            </div>}
            {formik.values.policyType !== "TP" && <div className="checkbox-row">
              <InputFieldCheckBox
                formik={formik} formikFieldName="keyProtection"
                label="Key Protection" />
              <div className="padding-left">
                <span className="help-text">
                  The add-on provides coverage for the repair or replacement of lost, stolen, or damaged vehicle keys, including the associated costs of locksmith services
                </span>
              </div>
            </div>}
            {(formik.values.policyType === "OD-TP" || (formik.values.formtype === "car" && formik.values.policyType === "OD")) && <div className="checkbox-row accessories-wrap">
              <div className="accessories">
                <InputFieldCheckBox formik={formik} formikFieldName="accessories" label="Accessories" />
                <div className="padding-left">
                  <span className="help-text">
                    Additional accessories will not be a part of standard policy, protect your additional accessories under the accessories add on.
                  </span>
                </div>
              </div>
              {formik.values.accessories && (
                <div className="accessories-child">
                  {formik.values.policyType !== "TP" && <div className="checkbox-row mt-3">
                    <div className="checkbox-input">
                      <InputFieldCheckBox
                        formik={formik} formikFieldName="electricalAccessories"
                        label="Electrical" />
                      {formik.values.electricalAccessories && (
                        <div className="form-floating ">
                          <InputFieldDropdown
                            formikFieldName="electricalAccessoriesAmount"
                            label=""
                            optionsArray={amountArray}
                            formik={formik}
                          />
                        </div>)}
                    </div>
                    <div className="padding-left">
                      <span className="help-text">
                        A cover on electrical accessories fitted in your car. Most insurer provide a cover for your car accessories at an additional premium of 4% on its value.
                      </span>
                    </div>
                  </div>}
                  {formik.values.policyType !== "TP" && <div className="checkbox-row">
                    <div className="checkbox-input">
                      <InputFieldCheckBox
                        formik={formik} formikFieldName="nonElectricalAccessories"
                        label="Non-Electrical" />
                      {formik.values.nonElectricalAccessories && (
                        <div className="form-floating ">
                          <InputFieldDropdown
                            formikFieldName="nonElectricalAccessoriesAmount"
                            label=""
                            optionsArray={amountArray}
                            formik={formik}
                          />
                        </div>)}
                    </div>
                    <div className="padding-left">
                      <span className="help-text">
                        A cover on non-electrical accessories fitted in your car. Most insurer provide a cover for your car accessories at an additional premium of 4% on its value.
                      </span>
                    </div>
                  </div>}
                </div>
              )}
            </div>
            }
          </div>
          <div className="right-cover">
            {formik.values.policyType !== "OD" &&
              <div className="checkbox-row mb-3">
                <div className="checkbox-input">
                  <InputFieldCheckBox
                    formik={formik} formikFieldName="driverAccidentCover"
                    label="Driver Accident cover" />
                  {formik.values.driverAccidentCover && (
                    <div className="form-floating ">
                      <InputFieldDropdown
                        formikFieldName="driverAccidentCoverAmount"
                        label=""
                        optionsArray={amountArray}
                        formik={formik}
                      />
                    </div>)}
                </div>
                <div className="padding-left">
                  <span className="help-text">
                    In case of any unfortunate accident the add on will provides coverage for any bodily injury or death of driver up to the sum insured selected.
                  </span>
                </div>
              </div>}
            <div className="checkbox-row">
              <div className="checkbox-input">
                <InputFieldCheckBox
                  formik={formik} formikFieldName="lpgCngKit"
                  label="LPG-CNG Kit" />
                {formik.values.lpgCngKit && (
                  <div className="form-floating ">
                    <InputFieldDropdown
                      formikFieldName="lpgCngKitAmount"
                      label=""
                      optionsArray={amountArray}
                      formik={formik}
                    />
                  </div>)}
              </div>

              <div className="padding-left">
                <span className="help-text">
                  External fitted LPG-CNG kit will not be the part of your selected IDV. this add on will provide the coverage to your external fitted LPG-CNG Kit.
                </span>
              </div>
            </div>
            {formik.values.policyType !== "TP" && <div className="checkbox-row mb-3">
              <InputFieldCheckBox
                formik={formik} formikFieldName="ncbProtection"
                label="NCB Protection" />
              <div className="padding-left">
                <span className="help-text">
                  The add-on safeguards the earned discount on premiums by preventing its reduction even after making a certain number of claims.
                </span>
              </div>
            </div>}
            {formik.values.policyType !== "TP" && <div className="checkbox-row">
              <div className="checkbox-input">
                <InputFieldCheckBox
                  formik={formik} formikFieldName="transportHotelExpenses"
                  label="Emergency Transport and Hotel Expenses" />
                {formik.values.transportHotelExpenses && (
                  <div className="form-floating ">
                    <InputFieldDropdown
                      formikFieldName="transportHotelExpensesAmount"
                      label=""
                      optionsArray={[
                        { value: 1000, label: "1000" },
                        { value: 2000, label: "2000" },
                      ]}
                      formik={formik}
                    />
                  </div>)}
              </div>
              <div className="padding-left">
                <span className="help-text">
                  The add-on provides coverage for transportation and accommodation costs in case of a breakdown or accident
                </span>
              </div>
            </div>}
            {formik.values.policyType !== "TP" && <div className="checkbox-row mb-3">
              <InputFieldCheckBox
                formik={formik} formikFieldName="baggageCover"
                label="Loss of Baggage Cover" />
              <div className="padding-left">
                <span className="help-text">
                  In case of any unfortunate accident, the add on will provides
                  coverage for any bodily injury or death of driver up to the Sum
                  Insured selected
                </span>
              </div>
            </div>}
            {formik.values.policyType !== "TP" && <div className="checkbox-row mb-3">
              <div className="checkbox-input">
                <InputFieldCheckBox
                  formik={formik} formikFieldName="tyreProtection"
                  label="Tire Protection" />
                {formik.values.tyreProtection && (
                  <div className="form-floating">
                    <InputFieldText
                      formikFieldName="tyreProtectionAmount"
                      placeholder="Tire Details"
                      maxLength={100}
                      formik={formik} // Pass formik down to InputFieldText
                    />
                  </div>
                )}
              </div>
              <div className="padding-left">
                <span className="help-text">
                  The add-on provides coverage for repair or replacement costs of damaged tires.
                </span>
              </div>
            </div>}
            {formik.values.policyType !== "OD" && <div className="checkbox-row">
              <div className="checkbox-input">
                <InputFieldCheckBox formik={formik} formikFieldName="personalCoverFlag" label="Passenger Cover" />
                {formik.values.personalCoverFlag && (
                  <div className="form-floating ">
                    <InputFieldDropdown
                      formikFieldName="personalCover"
                      label=""
                      optionsArray={amountArray}
                      formik={formik}
                    />
                  </div>)}
              </div>

              <div>
                <span className="help-text">
                  In case of any unfortunate accident, the add on will provides
                  coverage for any bodily injury or death of passenger up to sum
                  insured selected
                </span>
              </div>
            </div>
            }
          </div>
        </div>
        <div className="text-center mt-4 footer-btn-wrap">
          <Button className="back-btn" onClick={() => { setriderStatus(false) }}>Cancel</Button>
          <Button className="primary-btn" onClick={() => { setriderStatus(false) }}>Save</Button>
        </div>
      </Form>
    </>
  );
  const bikePopForAdditionalCover = (
    <>
      <Form >
        {formik.values.policyType !== "TP" &&
          <div className="checkbox-row mb-3">
            <InputFieldCheckBox formik={formik} formikFieldName="zeroDep" label="Zero Depreciation" />
            <div>
              <span className="help-text">
                Also known as "nil depreciation" or "bumper-to-bumper" insurance, provides full coverage for repair or replacement costs without factoring the vehicle body part depreciation.
              </span>
            </div>
          </div>
        }
        {formik.values.policyType !== "OD" && <div className="checkbox-row">
          <InputFieldCheckBox formik={formik} formikFieldName="personalCoverFlag" label="Passenger Cover" />
          <div>
            {formik.values.personalCoverFlag && (
              <div className="form-floating ">
                <InputFieldDropdown
                  formikFieldName="personalCover"
                  label=""
                  optionsArray={[
                    { value: 50000, label: "50,000" },
                    { value: 100000, label: "1,00,000" },
                    { value: 150000, label: "1,50,000" },
                    { value: 200000, label: "2,00,000" },
                  ]}
                  formik={formik}
                />
              </div>)}
            <span className="help-text">
              In case of any unfortunate accident, the add on will provides
              coverage for any bodily injury or death of passenger up to sum
              insured selected
            </span>
          </div>
        </div>
        }
        <div className="text-center mt-4 footer-btn-wrap">
          <Button className="back-btn" onClick={() => { setriderStatus(false) }}>Cancel</Button>
          <Button className="primary-btn" onClick={() => { setriderStatus(false); setIsFormDirty(true) }}>Save</Button>
        </div>
      </Form>
    </>
  );
  const popIndividual = (
    <>
      <Form className="indiviual-form">
        <InputFieldRadio
          formikFieldName="vehicalRegType"
          optionsArray={[
            { value: "individual", label: "Individual", name: "Individual" },
            {
              value: "organization",
              label: "Organization",
              name: "Individual",
            },
          ]}
          formik={formik}
        />
        <div className="text-center mt-4 footer-btn-wrap">
          <Button className="back-btn" onClick={() => { setownedByPopup(false); formik.setFieldValue("vehicalRegType", ownedByPopuppreviousValue) }}>Cancel</Button>
          <Button className="primary-btn" onClick={() => { setownedByPopup(false) }}>Save</Button>
        </div>
      </Form>
    </>
  );

  const popForOd = (
    <>
      <Form>
        <div className="inner-form">
          <InputFieldText
            formikFieldName="tpPolicyStartDate"
            placeholder="TP Policy Start Date "
            formik={formik}
            type="date"
          />
          <InputFieldText
            formikFieldName="tpPolicyEndtDate"
            placeholder="TP Policy End Date "
            formik={formik}
            type="date"
          />
          {errorForOdPopup && <div style={{ color: "red" }}>
            {errorMessageForOdPopup}
          </div>
          }
          <div className="text-center footer-btn-wrap">
            <Button className="back-btn" onClick={() => { odPopupClose(1) }}>Cancel</Button>
            <Button className="primary-btn" onClick={() => { odPopupClose(2) }}>Save</Button>
          </div>
        </div>
      </Form>
    </>
  );
  const quotePremium = (
    <div>
      <div className="premium-container" ref={ref}>
        <div className="topSection">
          <div className="img-wrap">
            <img src={imgArrayForCard?.[formContext.singleQuotesData?.insuranceCompany]} alt=""
            />
          </div>
          <div className="premium-amount-wrap">
            <div className="premium-amount-box">
              <span className="fieldset">Idv</span>
              <h3>₹  {formContext.singleQuotesData?.insuredDeclareValue}</h3>
            </div>
          </div>
          <div className="premium-amount-wrap">
            <div className="premium-amount-box">
              <span className="fieldset">Premium</span>
              <h3>₹ {(Number(netPremiumForBrekupvalue?.premium)?.toFixed(0))}</h3>
            </div>
            <span className="help-text">Exclusive of GST</span>
          </div>
        </div>
        <p>{formContext.singleQuotesData?.insuranceCompany}</p>
        <div className="tab-section">
          <div className="tabs">
            <span className="tab-text">Premium Details</span>
          </div>
          <div className="tab-content">
            {netPremiumForBrekupvalue?.odpremium !== 0 && <div className="tab-row">
              <p>OD premium</p>
              <p>₹ {(Number(netPremiumForBrekupvalue?.odpremium)?.toFixed(0))}</p>
            </div>
            }
            {formContext.singleQuotesData?.tppremium !== 0 && <div className="tab-row">
              <p>TP premium</p>
              <p>₹ {(Number(formContext.singleQuotesData?.tppremium)?.toFixed(0))}</p>
            </div>
            }
            {formContext.singleQuotesData?.ridersList?.map(mapdata => {
              return <>
                {mapdata?.riderValue && <div className="tab-row" >
                  <p>{mapdata?.riderName}</p>
                  <p>₹ {(Number(mapdata?.riderValue)?.toFixed(0))}</p>
                </div>}
              </>
            })}

            {formContext.singleQuotesData?.discountList?.map(mapdataNcb => {
              return <>
                {mapdataNcb.type === "NCB Discount" && <div className="tab-row">
                  <p>{mapdataNcb?.type}</p>
                  <p> -₹ {(Number(mapdataNcb?.discountAmount)?.toFixed(0))}</p>
                </div>}
              </>
            })}

            <div className="tab-row borderTop ">
              <p className="font-weight-bold">Net premium</p>
              <p className="font-weight-bold">₹ {(Number(netPremiumForBrekupvalue?.premium)?.toFixed(0))}</p>
            </div>

            <div className="tab-row">
              <p>GST 18% </p>
              <p>₹ {(Number(formContext.singleQuotesData?.serviceTax)?.toFixed(0))}</p>
            </div>
            <div className="tab-row borderTop total-wrap">
              <p>Total Premium</p>
              <p>₹ {(Number(formContext.singleQuotesData?.grossPremium)?.toFixed(0))}</p>
            </div>
          </div>
        </div>

      </div >
      <div className="text-center mt-3">
        <button className="primary-btn" onClick={() => generatePDF(ref, { filename: 'PremiumBreakpoints.pdf' })}>Download PDF</button>
      </div>
    </div>
  );

  const popShareQuotes = (
    <div className="Demo__container share-quote-content">
      <div className="Demo__some-network social-icon" title="Email">
        <EmailShareButton
          url={shareUrl}
          subject={title}
          body="body"
          className="Demo__some-network__share-button"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>

      <div className="Demo__some-network " onClick={closeShareQuptes} title="Whatsapp">
        <WhatsappShareButton
          url={shareUrl}
          title={title}
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>

    </div>
  );

  return (
    <React.Fragment>
      <Container fluid className="get-quotes-wrap">
        <Row className="first-row">
          <Col sm={12} md={12}>
            <Form className="" onSubmit={formik.handleSubmit}>
              <Row>
                <Col md={3} sm={12}>
                  <div className="addlink">
                    {formContext.secondLoaderStatus && (
                      <span>{formContext.spinner}</span>
                    )}
                  </div>
                  <InputFieldTextRTO
                    isTextVisible={isTextVisible}
                    handleSpanClick={handleSpanClick}
                    formikFieldName="registeredRto"
                    placeholder="MH01AAXXXX"
                    formik={formik}
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
                  <ErrorMessage formik={formik} fieldValue="registeredRto" />
                </Col>
                <Col md={3} sm={12}>
                  <InputFieldText
                    formikFieldName="make"
                    placeholder="Make*"
                    formik={formik}
                    capitalize={true}
                    autoComplete="off"
                  />
                  <AutoSuggestFile filteredData={formContext.makeFilterData} formik={formik} formikFieldName="make" formContext={formContext} />
                  <ErrorMessage formik={formik} fieldValue="make" />
                </Col>
                <Col md={3} sm={12}>
                  <InputFieldText
                    formikFieldName="model"
                    placeholder="Model*"
                    formik={formik}
                    capitalize={true}
                    autoComplete="off"
                  />
                  <AutoSuggestFile filteredData={formContext.modelFilterData} formik={formik} formikFieldName="model" formContext={formContext} />
                  <ErrorMessage formik={formik} fieldValue="model" />
                </Col>

                <Col md={3} sm={12}>
                  <InputFieldText
                    formikFieldName="varient"
                    placeholder="Variant*"
                    formik={formik}
                    capitalize={true}
                    autoComplete="off"
                  />
                  <AutoSuggestFile filteredData={formContext.varientFilterData} formik={formik} formikFieldName="varient" formContext={formContext} />
                  <ErrorMessage formik={formik} fieldValue="varient" />
                </Col>
              </Row>
              <Row>
                <Col md={3} sm={12}>
                  {formContext.carbikeformikValues?.insuranceFor === "renew" ? <InputFieldText
                    formikFieldName="registrationYear"
                    placeholder={`Registration Year*`}
                    formik={formik}
                    type="date"
                  /> :
                    <InputFieldDropdown
                      formikFieldName="registrationYear"
                      label="Manufacturing Year*"
                      optionsArray={ManufacturingDateArray}
                      formik={formik}
                    />}
                  <ErrorMessage formik={formik} fieldValue="registrationYear" />
                </Col>
                {formContext.carbikeformikValues?.formtype === "car" && <Col md={3} sm={12}>
                  <InputFieldDropdown
                    formikFieldName="fuel"
                    label="Fuel"
                    optionsArray={[
                      { value: "petrol", label: "Petrol" },
                      { value: "diesel", label: "Diesel" },
                      { value: "lpg/cng", label: "LPG/CNG" },
                      { value: "electric", label: "Electric" },
                      { value: "cng", label: "CNG" },
                      { value: "hybrid", label: "Hybrid" },
                      { value: "lpg", label: "LPG" },
                      { value: "petrol\+cng", label: "Petrol+CNG" },
                      { value: "petrol\+lpg", label: "Petrol+LPG" },
                    ]}
                    formik={formik}
                  />
                  <ErrorMessage formik={formik} fieldValue="fuel" />
                </Col>}
                {formContext.carbikeformikValues?.insuranceFor === "renew" &&

                  <Col md={3} sm={12}>
                    <InputFieldText
                      type="date"
                      formikFieldName="expiryDate"
                      placeholder="Previous policy expiry date"
                      formik={formik}
                    />
                    <ErrorMessage formik={formik} fieldValue="expiryDate" />
                  </Col>
                }
                {formContext.carbikeformikValues?.insuranceFor === "renew" && <Col md={3} sm={12}>
                  <InputFieldDropdown
                    formikFieldName="insuranceClaim"
                    label="Claim in last 12 months"
                    optionsArray={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                    formik={formik}
                  />
                  <ErrorMessage formik={formik} fieldValue="insuranceClaim" />
                </Col>}
                {formik.values?.insuranceClaim === "false" && formContext.carbikeformikValues?.insuranceFor === "renew" && (
                  <Col md={3} sm={12}>
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
                      formik={formik}
                    />
                    <ErrorMessage formik={formik} fieldValue="noClaimBonus" />
                  </Col>
                )}
                <Col sm={12} className="policyWrap quotes-radio-group mb-3">
                  <div className="radio-container">
                    <div className="me-5">
                      <p className="heading">Policy type</p>
                      <InputFieldRadio
                        formikFieldName="policyType"
                        optionsArray={arrayForPolicyType}
                        formik={formik}
                      />
                      <ErrorMessage formik={formik} fieldValue="policyType" />
                    </div>
                    {formContext.carbikeformikValues?.insuranceFor === "renew" && formContext.carbikeformikValues?.formtype !== "car" &&
                      <div>
                        <p className="heading">Policy Terms</p>
                        <InputFieldRadio
                          formikFieldName="policyTerms"
                          optionsArray={[
                            {
                              value: "1",
                              label: "1 Year",
                            },
                            {
                              value: "2",
                              label: "2 Year",
                            },
                            {
                              value: "3",
                              label: "3 Year",
                            },
                          ]}
                          formik={formik}
                        />
                        <ErrorMessage
                          formik={formik}
                          fieldValue="policyTerms"
                        />
                      </div>
                    }
                  </div>
                  {isFormDirty && (
                    <div className="text-center mt-4 footer-btn-wrap">
                      <Button className="back-btn" onClick={handleCancel}>Cancel</Button>
                      <Button className="primary-btn" onClick={handleSave} disabled={loaderForQuotes}>{loaderForQuotes ? "Please wait" : "Save"}</Button>
                    </div>
                  )}
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row className="">
          <div className="second-row d-flex align-items-center flex-wrap justify-content-between bg-color">
            <div className="d-flex gap-md-4 gap-sm-3 gap-2 align-items-center flex-wrap">
              <div>
                <Button
                  onClick={() =>
                    setidvPopupStatus(true)
                  }
                  className="select-btn"
                >
                  IDV-Min IDV <SVG src={Arrow} alt="" className="down-arrow" />
                </Button>
              </div>
              {formContext.carbikeformikValues?.formtype === "car" &&
                <div>
                  <Button
                    onClick={() =>
                      setriderStatus(true)
                    }
                    className="select-btn"
                  >
                    Additional Covers
                    <SVG src={Arrow} alt="" className="down-arrow" />
                  </Button>

                </div>
              }
              {formContext.carbikeformikValues?.formtype === "bike" &&

                <div>
                  <Button
                    onClick={() =>
                      setriderStatus(true)
                    }
                    className="select-btn"
                  >
                    Additional Covers
                    <SVG src={Arrow} alt="" className="down-arrow" />
                  </Button>

                </div>
              }
              {formContext.carbikeformikValues?.formtype === "car" && <div>
                <Button
                  onClick={() => { setownedByPopup(true); setownedByPopuppreviousValue(formik.values.vehicalRegType) }}
                  className="select-btn"
                >
                  {formik?.values?.vehicalRegType === "individual" ? "Individual" : "Organization"}
                  <SVG src={Arrow} alt="" className="down-arrow" />
                </Button>
              </div>}

              {true && <div
                onClick={() =>
                  setpersonalAccCover(true)
                }
              >
                {formik.values.policyType !== "OD" && <InputFieldCheckBox formik={formik} formikFieldName="personalAccidentCover" label="Personal Accident Cover" />}

              </div>}
              <div className="d-flex">
                <Button className="share-quotes-btn">
                  {/* <Button className="share-quotes-btn" onClick={() => setshareQuotesPopup(true)}> */}
                  <SVG src={Share} alt="" className="share-icon" /> Share Quotes
                </Button>
                <div className="Demo__container share-quote-content">
                  <div className="Demo__some-network social-icon" title="Email">
                    <EmailShareButton
                      url={shareUrl}
                      subject={title}
                      body="body"
                      className="Demo__some-network__share-button"
                    >
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                  </div>

                  <div className="Demo__some-network " onClick={closeShareQuptes} title="Whatsapp">
                    <WhatsappShareButton
                      url={shareUrl}
                      title={title}
                      separator=":: "
                      className="Demo__some-network__share-button"
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </div>

                </div>
              </div>
            </div>
            <p className="mb-0 gst-text">All prices are exclusive of GST</p>
          </div>
        </Row>
        <Row className=" card-wrap">
          {quotesResultsArray?.filter((filterData) => (Number(filterData?.netPremium)) !== 0)?.map((data, index) => {
            // Calculate the average of the three ratings
            const rating = (((data?.insurerIndex) + (data?.claimIndex) + 4.0) / 3)?.toFixed(1);
            var premium = 0
            // for new india we get array for net premium and for idv so we need this logic
            if (typeof (data?.netPremium) === "object") {
              data?.netPremium?.forEach((foreachdata, index) => {
                premium = premium + foreachdata
              })
            }
            else {
              premium = data?.netPremium
            }

            return (
              <Card key={index}>
                <Card.Body>
                  <div className="card-top card-header">
                    <div className="logo-wrap">
                      <img
                        src={imgArrayForCard?.[data?.insuranceCompany]}
                        alt=""
                        className="logo"
                      />
                    </div>
                    <Button
                      variant="primary"
                      className="buy-btn"
                      onClick={() => { buyNow(data) }}
                    >
                      Buy Now
                    </Button>
                  </div>
                  <div className="offer-wrap">
                    {(Number(data?.insuredDeclareValue)) === (Number(idvValue?.betstValue)) && < SVG src={Best} alt="" className="best-icon" fill="#d4d4d4" />}
                    {(Number(data?.netPremium)) === (Number(idvValue?.netPremium)) && < SVG
                      src={Lowest}
                      alt=""
                      className="lowest-icon"
                      fill="#d4d4d4"
                    />}
                  </div>
                  <div className="card-miidle  card-details">
                    <div className="card-rating-wrap">
                      <div className="card_rating mb-0">
                        <span className="label-text">Rating</span>
                        <span className="label-text badge">{rating}</span>
                      </div>
                      <div className="star-icon-wrap">
                        {giveRating(rating)}
                      </div>
                    </div>
                    <div className="idv-wrap">
                      <p className="label-text">IDV</p>
                      <p className="idv-text">₹ {Math.floor(data?.insuredDeclareValue)}</p>
                    </div>
                    <div className="idv-wrap">
                      <p className="label-text">Premium</p>
                      <p className="premium-text">₹ {(Number(premium)?.toFixed(0))}
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="tooltip-tex">Click to view breakup</Tooltip>
                          }
                        >
                          <span onClick={() => { openQuotePopup(data, premium) }}><FaEye /></span>
                        </OverlayTrigger>
                      </p>
                    </div>
                  </div>
                  <div className="card-bottom rating d-flex gap-4">
                    <div className="premium">
                      <div className="star rating-star">
                        <SVG
                          src={Star}
                          alt=""
                          className="rating-star-icon"
                          fill="#d4d4d4"
                        />
                        <span className="rating-point">4.0</span>
                      </div>
                      <p className="premium-text">Premium</p>
                    </div>
                    <div className="premium">
                      <div className="star rating-star">
                        <SVG
                          src={Star}
                          alt=""
                          className="rating-star-icon"
                          fill="#d4d4d4"
                        />
                        <span className="rating-point">{(data?.insurerIndex)?.toFixed(1)}</span>
                      </div>
                      <p className="premium-text">Servicing</p>
                    </div>
                    <div className="premium">
                      <div className="star rating-star">
                        <SVG
                          src={Star}
                          alt=""
                          className="rating-star-icon"
                          fill="#d4d4d4"
                        />
                        <span className="rating-point">{(data?.claimIndex)?.toFixed(1)}</span>
                      </div>
                      <p className="premium-text">Claims</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )
          })}
          {/* {loaderForQuotes && <SkeletonCard />} */}
          {loaderForQuotes && formContext.createquotesresult?.map((data, index) => {
            return <>{index >= count ? <SkeletonCard /> : null}  </>

          })}

        </Row>
        {!formContext.loaderStatus && quotesResultsArray?.length === 0 && <PageNotFound message={"No product matches given criteria"} />}
        <button title="Back" onClick={() => backButtonPressed()} className="back-button">
          {" "}
          <SVG src={Arrow} alt="" className="back-arrow" />
        </button>
      </Container>
      <VerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        heading={headingForPopup}
      >
        {childForPopup}
      </VerticallyCenteredModal>
      {/* View breakup */}
      <VerticallyCenteredModal
        show={quotePremiumPopup}
        onHide={() => {
          QpPopupClose()
        }}
      >
        {quotePremium}
      </VerticallyCenteredModal>
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
      {/* popup for rider */}
      <VerticallyCenteredModal
        show={riderStatus}
        onHide={() => {
          setriderStatus(!riderStatus)
        }}
        heading="Select Additional Covers"
      >
        {(formContext.carbikeformikValues?.formtype === "car") ? popForAdditionalCover : bikePopForAdditionalCover}
      </VerticallyCenteredModal>
      {/* personal accident cover */}
      <VerticallyCenteredModal
        show={personalAccCover}
        onHide={() => {
          setpersonalAccCover(!personalAccCover)
        }}
        heading="Personal Accident(PA)Cover ?"
      >
        {popPersonalAccident}
      </VerticallyCenteredModal>

      {/* IDV value popup */}
      <VerticallyCenteredModal
        show={idvPopupStatus}
        onHide={() => {
          setidvPopupStatus(!idvPopupStatus)
          seterrorForOdPopup(false)
        }}
        heading="Select IDV"
      >
        {popForIdvMinIdv}
      </VerticallyCenteredModal>

      {/* popup for owned type */}
      <VerticallyCenteredModal
        show={ownedByPopup}
        onHide={() => {
          setownedByPopup(!ownedByPopup)
        }}
        heading="Vehicle registered in the name of"
      >
        {popIndividual}
      </VerticallyCenteredModal>
      {/* popup for login screen */}
      <VerticallyCenteredModal
        show={formContext?.loginPopupStatus}
        onHide={() => {
          setownedByPopup(formContext.setloginPopupStatus(false))
        }}
        heading="Login with mobile number"
      >
        <SignIn />
      </VerticallyCenteredModal>

      {/* popup for share quotes type */}
      <VerticallyCenteredModal
        show={shareQuotesPopup}
        onHide={() => {
          closeShareQuptes()
        }}
        heading="Share quotes"
      >
        {popShareQuotes}
      </VerticallyCenteredModal>
    </React.Fragment >
  );
}
