import React, { useEffect } from 'react'



export const FutureQuotesPayment = () => {
    const queryParams = new URLSearchParams(window.location.search)

    const valuesForPayload = {
        TransactionID: queryParams.get("TransactionID") ? queryParams.get("TransactionID") : "",
        PaymentOption: queryParams.get("PaymentOption") ? queryParams.get("PaymentOption") : "",
        ResponseURL: queryParams.get("ResponseURL"),
        ProposalNumber: queryParams.get("ProposalNumber"),
        PremiumAmount: queryParams.get("PremiumAmount"),
        UserIdentifier: queryParams.get("UserIdentifier"),
        UserId: queryParams.get("UserId"),
        FirstName: queryParams.get("FirstName"),
        LastName: queryParams.get("LastName"),
        Mobile: queryParams.get("Mobile"),
        Email: queryParams.get("Email"),
        CheckSum: queryParams.get("CheckSum"),
        paymentURL: queryParams.get("paymentURL"),
    }

    useEffect(() => {
        if (valuesForPayload.LastName) {
            const buttonId = document.getElementById("submitbutton")
            buttonId?.click()
        }
    }, [valuesForPayload.LastName]);
    return (
        <div className='payment-success-wrap'>
            <form name="form1" method="post" action={valuesForPayload?.paymentURL} id="form1">
                <input type="text" name='TransactionID' value={valuesForPayload?.TransactionID} />
                <input type="text" name='PaymentOption' value={valuesForPayload?.PaymentOption} />
                <input type="text" name='ResponseURL' value={valuesForPayload?.ResponseURL} />
                <input type="text" name='ProposalNumber' value={valuesForPayload?.ProposalNumber} />
                <input type="text" name='PremiumAmount' value={valuesForPayload?.PremiumAmount} />
                <input type="text" name='UserIdentifier' value={valuesForPayload?.UserIdentifier} />
                <input type="text" name='UserId' value={valuesForPayload?.UserId} />
                <input type="text" name='FirstName' value={valuesForPayload?.FirstName} />
                <input type="text" name='LastName' value={valuesForPayload?.LastName} />
                <input type="text" name='Mobile' value={valuesForPayload?.Mobile} />
                <input type="text" name='Email' value={valuesForPayload?.Email} />
                <input type="text" name='CheckSum' value={valuesForPayload?.CheckSum} />
                <input type="submit" id="submitbutton" value='Submit' />

                <div>
                    <h1>
                        Processing request contains insufficient data.
                    </h1>
                </div>
            </form>
        </div>
    )
}