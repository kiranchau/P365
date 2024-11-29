import React from 'react'
import "../style/skeleton-card.scss"
export const SkeletonCard = () => {
  return (
    <div className='p-0'>
        <div className="skeleton-container card">
        <div className="skeleton-row px-3 pt-3">
            <div className="box loading-animation"></div>
            <div className="box loading-animation"></div>
        </div>
 
       <div className='middle-container bg-color pb-3 px-3 pt-4 boxShadow'>
       <div className="skeleton-column">
            <div className="line line3 loading-animation"></div>
            <div className="line line4 loading-animation"></div>
        </div>
        <div className="skeleton-column">
            <div className="line line3 loading-animation"></div>
            <div className="line line4 loading-animation"></div>
        </div>
        <div className="skeleton-column">
            <div className="line line3 loading-animation"></div>
            <div className="line line4 loading-animation"></div>
        </div>
       </div>
       <div className='middle-container  px-3 pb-3 pt-3'>
       <div className="skeleton-column">
            <div className="line line4 loading-animation"></div>
        </div>
      
       </div>
    </div>
    </div>
  )
}
