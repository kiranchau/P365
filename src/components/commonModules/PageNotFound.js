import React from 'react'
import NotFound from "../../images/notfound.svg"
import { useHistory } from "react-router-dom";

export const PageNotFound = (props) => {
  const message = props.message;
  let history = useHistory();

  return (
    <div className='page-not-found'>
      <img src={NotFound} alt="" width={100} />
      <h4>{message}</h4>
      <p className=''></p>
      <button className='primary-btn' onClick={() => history.push('/')}>Go Back</button>
    </div>
  )
}
