import React from 'react'
const AutoSuggestFilePropsal = ({ formik, formikFieldName, filteredData, formContext }) => {

    const handleSelectedSearch = (value) => {
        formik.setFieldValue(formikFieldName, value?.financierName)
        setTimeout(() => {
            formContext.clearFilter("")

        }, 200);
    }
    return (
        filteredData?.length !== 0 && (
            <div className="dataResult">
                {filteredData?.slice(0, 10).map((value, index) => {
                    return (
                        <div key={index} className="dataItem" onClick={() => handleSelectedSearch(value)}>
                            <p>{value.financierName} </p>
                        </div>
                    );
                })}
            </div>
        )

    )
};
export default AutoSuggestFilePropsal;


