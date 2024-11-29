/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import UseMultistepForm from "../../MultipleForms/UseMultiStepForms";
import CarFormVehicleDetails from "../Cars/CarFormVehicleDetails";
import CarFormPersonDetails from "../Cars/CarFormPersonDetails";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import * as api from "../../../API/authCurd"
import UseFormContext from "../../../../src/context/UseFormContext";
import { yearValidation, expDateValidation } from "../../commonModules/CommonCode";

function ContainerForCar(props) {
  const formContext = UseFormContext();
  const valuesForExpDate = expDateValidation()
  let history = useHistory();
  const { id } = useParams();
  const initialData = {
    insuranceFor: "",
    registeredRto: "",
    make: "",
    model: "",
    varient: "",
    fuel: "petrol",
    registrationYear: "",
    previousPolicy: valuesForExpDate?.todayConvertedValue,
    insuranceClaim: "false",
    tpPolicyStartDate: "",
    tpPolicyEndtDate: "",
    noClaimBonus: "25",
    policyType: "",
    currentStepIndex: "0",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    formtype: "car",
    isvehNumberMissing: formContext.isvehNumberMissing,
    addOnCover: [{
      "riderName": "Personal Accident cover",
      "riderId": 11
    }, {
      "riderId": 35,
      "riderName": "LPG-CNG Kit",
      "riderAmount": 10000
    }],

  };

  const validationSchema = Yup.object().shape({
    insuranceFor: Yup.string()
      .trim()
      .required("Insurance Field Is Required")
      .test("not blank", "Select value", (value) => {
        return value !== "";
      }),

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

    fuel: Yup.string()
      .trim()
      .required("Fuel Field is required")
      .test("not blank", "Select value", (value) => {
        return value !== "";
      }),

    registrationYear: Yup.string()
      .trim()
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

    previousPolicy: Yup.string()
      .trim()
      .required("Previous Policy Is Required")
      .test("not blank", "Select value", (value) => {
        return value !== "";
      }),
    insuranceClaim: Yup.string()
      .trim()
      .required("Insurance Claim Field Is Required")
      .test("not blank", "Select value", (value) => {
        return value !== "";
      }),

    noClaimBonus: Yup.string().when("insuranceClaim", {
      is: "false",
      then: () => Yup.string().required("Field Is Required"),
    }),

    currentStepIndex: Yup.string().required("Field Is Required"),
    policyType: Yup.string()
      .trim()
      .required("Policy Type Field Is Required"),

    firstName: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string().required(" First Name Is Required")
        .matches(/^[a-zA-Z\s]+$/, 'Only alphabets are allowed'),
    }),

    lastName: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string().required(" Last Name Is Required")
        .matches(/^[a-zA-Z\s]+$/, 'Only alphabets are allowed'),
    }),

    email: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string().required(" Email Is Required")
        .email("Wrong email format")
        .max(50, "Maximum 50 characters allowed"),
    }),

    phoneNumber: Yup.string().when("currentStepIndex", {
      is: "1",
      then: () => Yup.string().required(" Phone Number Is Required")
        .matches(/^[0-9\b]+$/, "Invalid Phone number !")
        .min(10, "Minimum 10 digit required")
        .max(10, "Maximum 10 digit required"),
    }),
  });

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setSubmitting(true);
      if (!isLastStep) return next();
      formContext.setsecondLoaderStatus(true);
      api.createQoteApiCar(values).then(data => { console.log("qotes create", data); redirectMethod(values, data) }).catch(err => { console.log("error", err); formContext.notifyError("An error occurred while fetching data") })
        .finally(() => {
          // Set loader back to false
          formContext.setsecondLoaderStatus(false);
        });
    },
  });

  const redirectMethod = (values, data) => {
    const JsonDataForCreateQuotes = JSON.parse(data.data);
    formContext.setPolicyDates(JsonDataForCreateQuotes)
    sessionStorage.setItem("quoteId", JsonDataForCreateQuotes?.QUOTE_ID)
    console.log("qotes create", JsonDataForCreateQuotes.data)
    formContext.setcreatequotesresult(JsonDataForCreateQuotes.data)
    formContext.setroutingPath("/car/1")
    formContext.setcarbikeformikValues(values)
    history.push({
      pathname: "/quotes",
      state: { values: values, apiResopnse: JsonDataForCreateQuotes.data, prePage: "car" },
    });
  }

  // Function to clear the input field value using Formik's setFieldValue
  // @param {string} value - The name of the Formik field to clear
  const clearIcon = (value) => {
    formik.setFieldValue(value, "");
  };

  // Destructuring variables from the custom hook UseMultistepForm
  const { currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    UseMultistepForm([
      <CarFormVehicleDetails {...props} formik={formik} clearIcon={clearIcon} />,
      <CarFormPersonDetails {...props} formik={formik} />,
    ]);
  //  to add n remove addon
  useEffect(() => {
    let uniqueData = formik.values.addOnCover?.filter(filterData => filterData?.riderId !== 11)

    if (formik.values.policyType === "OD") {
      formik.setFieldValue("addOnCover", uniqueData)
    } else {
      uniqueData.push({
        "riderName": "Personal Accident cover",
        "riderId": 11
      })

      formik.setFieldValue("addOnCover", uniqueData)
    }
  }, [formik.values.policyType]);

  useEffect(() => {
    let uniqueData = formik.values.addOnCover?.filter(filterData => filterData?.riderId !== 35)
    const value1 = "petrol\+lpg"
    const value2 = "petrol\+cng"


    if (formik.values.fuel !==value1 && formik.values.fuel !==value2) {
      formik.setFieldValue("addOnCover", uniqueData)
    } else {
      uniqueData.push({
        "riderId": 35,
        "riderName": "LPG-CNG Kit",
        "riderAmount": 10000
      })

      formik.setFieldValue("addOnCover", uniqueData)
    }
  }, [formik.values.fuel]);
  // when back button pressed on quotes page 

  useEffect(() => {
    if (id && formContext.carbikeformikValues) {
      formik.setValues({
        // ...formik.initialValues,
        ...formContext.carbikeformikValues
      });
    }
  }, []);
  // Update the "currentStepIndex" field in Formik whenever the "currentStepIndex" state changes
  useEffect(() => {
    formik.setFieldValue("currentStepIndex", currentStepIndex);
  }, [currentStepIndex]);
  useEffect(() => {
    if (formik.values.insuranceClaim) {
      formik.setFieldValue("noClaimBonus", "0")
    } else {
      formik.setFieldValue("noClaimBonus", "25")
    }
  }, [formik.values.insuranceClaim]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        {step}
        <div>
          {!isFirstStep && !formContext.secondLoaderStatus && (
            <Button onClick={back} className="mt-4 back-btn">
              Back
            </Button>
          )}
          <Button type="submit" className="mt-4 primary-btn" disabled={formContext.secondLoaderStatus}>
            {isLastStep ? (
              <>
                {formContext.secondLoaderStatus ? (
                  <>
                    {formContext.spinner}
                  </>
                ) : (
                  "Get Quotes"
                )}
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ContainerForCar;
