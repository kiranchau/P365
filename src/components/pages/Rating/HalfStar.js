import React from 'react'
import halfStar from "../../../images/Half-star.svg";
import SVG from "react-inlinesvg";

export const HalfStar = () => {
    return (
        <SVG
            src={halfStar}
            alt=""
            width={"25px"}
            className="star-icon"
            fill={"#f8b400"}
        />
    )
}