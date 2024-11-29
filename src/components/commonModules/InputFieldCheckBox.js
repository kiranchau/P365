import React from 'react';


const InputFieldCheckBox = ({ formikFieldName, formik, label }) => {
    return (

        <div className="checkbox-wrap">
            <input
                id="wp-comment-cookies-consent"
                name="wp-comment-cookies-consent"
                type="checkbox"
                value={true}
                {...formik?.getFieldProps(formikFieldName)}
                checked={formik?.values[formikFieldName]}
            />
            <label className='label-text'>{label}</label>
        </div>
    );
}



export default InputFieldCheckBox
