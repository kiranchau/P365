import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";

const InputFieldTextRTO = ({
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
  isTextVisible,
  handleSpanClick
}) => {
  const handleChange = (e) => {
    let value = e.target.value;
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
    } else {
      formik.setFieldValue(formikFieldName, value);
    }
  };
  return (
    <>
      <Form.Group className="floating-input RTO-input-wrap" >
        <Form.Label>Registered at RTO

          {isTextVisible ? (
            <span className="citylink" onClick={handleSpanClick}>[I know my registration no.]</span>
          ) : (
            <span className="citylink" onClick={handleSpanClick}>[I don't know my registration no.]</span>
          )}
        </Form.Label>
        <Form.Control
          type={type ? type : "text"}
          placeholder={placeholder}
          className="floating-input"
          {...formik.getFieldProps(formikFieldName)}
          onClick={() => (showPopup ? showPopup() : null)}
          ref={inputRef}
          onChange={handleChange}
          disabled={disabled}
        />
      </Form.Group>
    </>
  );
};

InputFieldTextRTO.propTypes = {
  input: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  capitalize: PropTypes.bool,
};

export default React.memo(InputFieldTextRTO);
