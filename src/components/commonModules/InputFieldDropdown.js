import React from 'react';

const InputFieldDropdown = ({ formikFieldName, optionsArray, formik, label, disabled, dropdownChange }) => {

    const onchnage = (value) => {
        formik.setFieldValue(formikFieldName, value)
        dropdownChange && dropdownChange(value,formikFieldName)
    }
    return (

        <div className="form-floating">
            <select id="idunique" className="form-select"
                disabled={disabled}
                {...formik.getFieldProps(formikFieldName)}
                onChange={(e) => (onchnage(e.target.value))}

            >
                {optionsArray?.map((data, index) => {
                    return (<option key={data.id || index} value={data.value}>{data.label}</option>
                    )
                })}
            </select>
            <label htmlFor="idunique select-label">{label}</label>
        </div>
    );
}

export default InputFieldDropdown
