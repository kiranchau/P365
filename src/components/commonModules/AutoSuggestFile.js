import React from 'react'
const AutoSuggestFile = ({ formik, formikFieldName, filteredData, formContext }) => {

    const handleSelectedSearch = (value) => {
        formContext.handleFilter(value?.[formikFieldName], formikFieldName, formik)
        formik.setFieldValue(formikFieldName, value?.[formikFieldName])
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
                            <p>{value?.[formikFieldName]} </p>
                        </div>
                    );
                })}
            </div>
        )

    )
};
export default AutoSuggestFile;


