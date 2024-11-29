import React from "react";
import SVG from "react-inlinesvg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import info from "../../images/info.svg";

const InputFieldRadio = ({
  formikFieldName,
  optionsArray,
  formik,
}) => {
  return (
    <div className=" radio-group">
      {optionsArray?.map((data, index) => {
        return (
          <label
            className="d-flex gap-2 align-items-center"
            key={data?.id || index}
          >
            <input
              type="radio"
              className="input-radio checked"
              name={data?.value}
              checked={formik?.values[formikFieldName] === data?.value}
              {...formik?.getFieldProps(formikFieldName)}
              value={data?.value}
            />
            <span className="radio-label">{data?.label}</span>
            <img src={data?.icon} alt=""></img>
            {data?.OverlayTriggerValue && (
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-tex">{data?.OverlayTriggerValue}</Tooltip>
                }
              >
                <span className="info-icon-wrap">
                  <SVG className="infoicon" src={info}></SVG>
                </span>
              </OverlayTrigger>
            )}
          </label>
        );
      })}
    </div>
  );
};

export default InputFieldRadio;
