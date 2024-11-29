import React from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const InputFieldQuotes = ({
  formikFieldName,
  placeholder,
  formik,
  showPopup,
  type,
  onChange,
  value,
  helpText

}) => {

  return (
    <div>
      <FloatingLabel
        controlId="floatingPassword"
        label={placeholder}
        className="mb-3"
      >
        <Form.Control
          name={formikFieldName}
          type={type}
          placeholder={placeholder}
          className="floating-input"
          value={value}
          onChange={(e) => onChange(formikFieldName, e.target.value)}
        />
      </FloatingLabel>
      {helpText && <p className="mb-0 help-text">{helpText}</p>}
    </div>
  );
};
export default InputFieldQuotes;
