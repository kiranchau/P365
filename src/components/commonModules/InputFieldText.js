import React from "react";
import PropTypes from "prop-types";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import UseFormContext from "../../context/UseFormContext";

const InputFieldText = ({
  formikFieldName,
  placeholder,
  formik,
  showPopup,
  children,
  type,
  helpText,
  inputRef,
  capitalize,
  disabled,
  onlyNumber,
  autoComplete,
  maxlength
}) => {
  const formContext = UseFormContext();
  const handleBlur = () => {
    setTimeout(() => {
      formContext.clearFilter("")
    }, 400);
  }

  const handleChange = (e) => {
    let value = e.target.value;
    if (formikFieldName === "make" || formikFieldName === "varient" || formikFieldName === "model" || formikFieldName === "vehicalFinancierName") {
      formContext.handleFilter(value, formikFieldName, formik)
    }
    if (capitalize) {
      value = value.toUpperCase();
    }
    // Ensure the year is 4 digits
    if (type === "date") {
      const dateParts = value.split("-");
      const year = dateParts[0];
      if (year.length === 4) {
        formik.setFieldValue(formikFieldName, value);
      }
    } else if (onlyNumber) {
      // Allow only numeric values for phone number
      const numericValue = value.replace(/[^0-9]/g, '');
      formik.setFieldValue(formikFieldName, numericValue);
    } else {
      formik.setFieldValue(formikFieldName, value);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Prevent the default paste behavior

    const pastedValue = e.clipboardData.getData("text/plain");

    // Check if onlyNumber is enabled, and validate the pasted value
    if (onlyNumber) {
      const isValidNumber = /^[0-9]*$/.test(pastedValue);
      if (!isValidNumber) {
        return; // Don't proceed if the value is not a number
      }
    }

    // Set the field value with the pasted value
    formik.setFieldValue(formikFieldName, pastedValue);

    // Stop propagation to prevent further processing
    e.stopPropagation();
  };

  return (
    <FloatingLabel
      controlId="floatingPassword"
      label={placeholder}
    // className="mb-3"
    >
      <Form.Control
        type={type ? type : "text"}
        placeholder={placeholder}
        className="floating-input"
        {...formik.getFieldProps(formikFieldName)}
        onBlur={handleBlur}
        onClick={() => (showPopup ? showPopup() : null)}
        ref={inputRef}
        onChange={handleChange}
        onPaste={handlePaste}
        disabled={disabled}
        max="9999-12-31"
        autoComplete={autoComplete ? autoComplete : "true"}
        maxLength={onlyNumber ? maxlength ? maxlength : 10 : maxlength ? maxlength : 50}


      />
      {children}
      {helpText && <p className="mb-0 help-text">{helpText}</p>}
    </FloatingLabel>
  );
};

InputFieldText.propTypes = {
  input: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  capitalize: PropTypes.bool,
};

export default React.memo(InputFieldText);
