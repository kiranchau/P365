import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
    return (
        <div className='footer-container'>
            <div className='link-text-container'>
                <Link to="/car">Car Insurance</Link>
                <Link to="/bike">Bike Insurance</Link>
                <Link to="/">Term Insurance</Link>
                <Link to="/health">Health Insurance</Link>
                <Link to="/">Claims</Link>
            </div>
            <div className='middle-section'>
                <div className='column'>
                    <p className='label'>IRDAI Broker Licence</p>
                    <p className='value'>Code No. CB/446/09/2021</p>
                </div>
                <div className='column'>
                    <p className='label'>Sales Assistant</p>
                    <a href=' tel:022-62526252' className='value'>022-62526252</a>
                </div>
                <div className='column'>
                    <p className='label'>Mail Us</p>
                    <a href="mailto: contact@policies365.com" className='value'>contact@policies365.com</a>
                </div>
            </div>

            <div className='bottom-section'>
                <div>
                    <div className='company-address'>
                        <p className='company-name'>Navnit Insurance Broking Private Limited</p>
                        <p className='companyaddress'>172, Solitaire Corporate Park, Building No. 1, 7th Floor, Andheri-Ghatkopar Link Road, Andheri (East), Mumbai, 400093, Maharashtra, India Product information is authentic and solely based on the information received from the insurer.</p>
                    </div>
                    <div className='copyright-wrap'>
                        <p className='copyright'>
                            © Copyright 2019 Policies365. All rights reserved worldwide.
                        </p>
                        <div className='bottom-link'>
                            <a href=''> Connect Us I Privacy Policy |</a>
                            <a href=''> Terms & Conditions |</a>
                            <a href=''> Privacy Policy </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
