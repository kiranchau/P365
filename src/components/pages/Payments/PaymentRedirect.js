import React from 'react'
import UseFormContext from "../../../context/UseFormContext";

export const PaymentRedirect = () => {
    const formContext = UseFormContext();
    let hrefType = window.location.href
    let sliceLength = 44
    console.log("hrefType.....", hrefType)
    let baseUrl
    if (localStorage.getItem("type") === "bike") {
        baseUrl = process.env.REACT_APP_BASE_URL + "/cxf/paymentresponse/service/success/reliance/bike?"
    }
    else {
        baseUrl = process.env.REACT_APP_BASE_URL + "/cxf/paymentresponse/service/success/reliance/car?"
    }



    const hrefType2 = hrefType?.replaceAll("|", ",")?.slice(0, -1)
    if (process.env.REACT_APP_BASE_URL === "https://uat-mservices.policies365.com") {
        sliceLength = 45
    }

    console.log("hrefType2........", hrefType2)
    console.log("url", baseUrl + hrefType2?.slice(sliceLength))
    window.open(baseUrl + hrefType2?.slice(sliceLength), "_self")

    return (
        <div className='bg-image payment-redirect-wrap'>
            <div className='payment-redirect-page'>
                <h4>Please Wait…… </h4>
                <p>Your payment is in process. Do not close the window or go back.</p>
                <div className="addlink">
                    {(
                        <span>{formContext.spinner}</span>
                    )}
                </div>
            </div>
        </div>

    )
}