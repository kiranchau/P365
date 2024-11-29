import React, { Component, useEffect } from 'react'
import { useHistory, useParams } from "react-router-dom";

export const PaymentFailed = () => {
    let history = useHistory();
    // we are reusing this Component to reload page
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            sessionStorage.clear()
            // window.open(`https://uat1.policies365.com/quotes?quoteID=${id}`, '_self')
            history.push(`/quotes?quoteID=${id}`)
        }
    }, [id]);

    return (
        <div>{!id && <>
            <h4>Payment Failed</h4>
            <button className='primary-btn' onClick={() => history.push('/')}>Go Back</button>
        </>}

        </div>
    )
}