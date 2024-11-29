import React from 'react'
import { downloadPolicy } from "../../../API/authCurd"
import UseFormContext from "../../../../src/context/UseFormContext";
import { useHistory } from "react-router-dom";


export const PaymentSuccess = () => {
    const queryParams = new URLSearchParams(window.location.search)
    const formContext = UseFormContext();
    const history = useHistory();

    const valuesForPayload = {
        policyNo: queryParams.get("policyNo") ? queryParams.get("policyNo") : "",
        lastName: queryParams.get("LastName") ? queryParams.get("LastName") : "",
        email: queryParams.get("Email") ? queryParams.get("Email") : "",
    }

    // to download policy first step
    const apiCall = () => {
        if (localStorage.getItem("insuranceCompany") === "ICICI Lombard General Insurance Co. Ltd") {
            history.push("/myaccount/1")
        }
        downloadPolicy().then(data => {
            const jsonData = JSON.parse(data?.data)
            const arraylength = (jsonData?.data?.policyDetails.length)
            console.log("jsonData", jsonData)
            if (jsonData?.data?.policyDetails[arraylength - 1].DownloadLink) {
                downloadFile(jsonData?.data?.policyDetails[arraylength - 1].DownloadLink)
            }
            else {
                downloadFile(jsonData?.data?.policyDetails[arraylength - 1].downloadUrl)

            }
        })
            .catch(err => {
                console.log("err", err)
                formContext.notifyError("An error occurred while fetching data")
            })
    }
    // download policy second step
    const downloadFile = (url) => {
        const link = document.createElement("a")
        link.href = url
        link.download = "document";
        link.target = "_blank"
        document.body.appendChild(link)
        setTimeout(() => {
            link.click()
            document.body.removeChild(link)
        }, 500);
    }

    return (
        <div className='payment-success-wrap'>
            <h4>Payment Success</h4>
            <p>We thank you for choosing Policies365 for your insurance needs. You would receive a confirmation for the premium paid along with the policy copy attached in short while</p>
            <div className='details-wrap'>
                <p className='sub-head'>
                    The Policy details are as follow:
                </p>
                <div className='details'>
                    <div className='row-wrap'>
                        <p className='label-text'>Policy Certificate Number</p>
                        <span className='label-text'>:</span>
                        <p className='value-policy '>{valuesForPayload.policyNo} </p>
                    </div>

                </div>
                <hr className='bordertop' />
                <div className='bottom-info'>
                    <p className='label-text'>
                        In case of any queries or assistance,please call us on our Helpline:<a>(022) 68284343</a>
                    </p>
                    <p className='label-text'>
                        (Office hours 10:00 am to 7:00 pm) Or write to us @:<a>contact@policies365.com</a>
                    </p>
                </div>
            </div>
            <button className='goback-btn' onClick={apiCall}>Download Policy</button>

        </div>
    )
}