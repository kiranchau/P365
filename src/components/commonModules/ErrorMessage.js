import React from 'react'
const ErrorMessage = ({ formik, fieldValue  }) => {
    const inputTouched = formik.touched[fieldValue];
    const inputError = formik.errors[fieldValue];
  
    return inputTouched && inputError ? (
                                <div className="fv-plugins-message-container">
                                    <div  className="fv-help-block">{formik.errors[fieldValue]}</div>
                                </div>
                            ) : null;
  };
   export default ErrorMessage;


