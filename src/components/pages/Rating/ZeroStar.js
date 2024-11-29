import React from 'react'
import Star from "../../../images/star.svg";
import SVG from "react-inlinesvg";

export const ZeroStar = (type) => {
    
    return (
        <SVG
            src={Star}
            alt=""
            width={"25px"}
            className="star-icon"
            fill={'#555'}
        />
    )
}