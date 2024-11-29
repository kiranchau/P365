/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import UseMultistepForm from "../../MultipleForms/UseMultiStepForms";
import HealthFormPage1 from "../Health/HealthFormPage1";
import HealthFormPage2 from "../Health/HealthFormPage2";
import { useHistory } from "react-router-dom"
import { Button } from "react-bootstrap";
import * as Yup from "yup"
import { useFormik } from "formik"

function ContainerForHealth(props) {

  let history = useHistory()
  const initialData = {
    gender: "male",
    existanceIllness: "yes",
    hospitalLimit: "2lakh",
    pincode: "3",
    healthInsurefor: "",
    currentStepIndex: "0",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",

  };
  const validationSchema = Yup.object().shape({
    gender: Yup.string()
      .trim()
      .required("Gender Is Required")
      .test("not blank", "Select value", (value) => {
        return value !== ""
      }),

    existanceIllness: Yup.string()
      .trim()
      .required("Existance Illness Field Is Required")
      .test("not blank", "Select value", (value) => {
        return value !== ""
      }),

    hospitalLimit: Yup.string()
      .trim()
      .required("Hospital Limit Field Is Required")
      .test("not blank", "Select value", (value) => {
        return value !== ""
      }),

    pincode: Yup.string()
      .trim()
      .required("Pincode Is Required"),

    healthInsurefor: Yup.string()
      .trim()
      .required("Health Insurance Is Required"),

    currentStepIndex: Yup.string().required("Field is required"),
    firstName: Yup.string().when("currentStepIndex", {
      is: '1',
      then: () => Yup.string()
        .required(" FirstName Is Required")
    }),

    lastName: Yup.string().when("currentStepIndex", {
      is: '1',
      then: () => Yup.string()
        .required(" LastName Is Required")
    }),

    email: Yup.string().when("currentStepIndex", {
      is: '1',
      then: () => Yup.string()
        .required(" Email Is Required")
    }),

    phoneNumber: Yup.string().when("currentStepIndex", {
      is: '1',
      then: () => Yup.string()
        .required(" Phone Number Is Required")
    }),
  })

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setSubmitting(true)
      if (!isLastStep) return next();
      history.push({
        pathname: "/quotes",
        state: values,
      })

    },
  })

  // Destructuring variables from the custom hook UseMultistepForm
  const { currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    UseMultistepForm([
      <HealthFormPage1  {...props} formik={formik} />,
      <HealthFormPage2 {...props} formik={formik} />,
    ]);

  // Update the "currentStepIndex" field in Formik whenever the "currentStepIndex" state changes
  useEffect(() => {
    formik.setFieldValue("currentStepIndex", currentStepIndex)
  }, [currentStepIndex]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}
      >
        {step}
        <div>
          {!isFirstStep && (
            <Button onClick={back} className="mt-4 back-btn">
              Back
            </Button>
          )}
          <Button type="submit" className="mt-4 primary-btn">
            {isLastStep ? "Get Quotes" : "Next"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ContainerForHealth;
