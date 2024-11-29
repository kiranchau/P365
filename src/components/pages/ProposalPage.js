import React, { useState, useRef } from "react";
import {
  Container, Row, Col, FloatingLabel, Form,
} from "react-bootstrap";
import ContainerForForm from "../MultipleForms/CountainerForForm"
import UseFormContext from "../../../src/context/UseFormContext";
import SVG from "react-inlinesvg";
import { useHistory } from "react-router-dom";
import Arrow from "../../images/down-arrow.svg";
import VerticallyCenteredModal from "../commonModules/Popups/VerticallyCenteredModal";
import reliance from "../../images/reliance.png";
import futureGenrali from "../../images/futureGenrali.png";
import ICICI from "../../images/ICICI-insurance.png"
import Godigit from "../../images/Godigit.png";
import NewIndia from "../../images/new-india.png"
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaEye } from "react-icons/fa";
// import { Document, Page } from 'react-to-pdf';
import generatePDF from 'react-to-pdf';



export default function ProposalPage() {
  const formContext = UseFormContext();
  const [quotePremiumPopup, setQuotePremiumPopup] = useState(false);
  const [netPremiumForBrekupvalue, setnetPremiumForBrekupvalue] = useState();
  let statDate = formContext?.PolicyDates?.policyDate?.policyStartDate
  statDate = statDate?.split("/")
  const value = statDate?.[2] + "-" + statDate?.[1] + "-" + statDate?.[0]
  let history = useHistory();
  const ref = useRef();

  const imgArrayForCard = {
    "Reliance General Insurance Co. Ltd": reliance,
    "New India Assurance": NewIndia,
    "Future Generali India Insurance Co. Ltd": futureGenrali,
    "GO DIGIT General Insurance CO. LTD": Godigit,
    "ICICI Lombard General Insurance Co. Ltd": ICICI,

  }
  const backButtonPressed = () => {
    formContext.setgetquotesApiFlag(false)
    history.push("/quotes/1");
  };
  const QpPopupClose = () => {
    setQuotePremiumPopup(false);
  };
  const openQuotePopup = (data) => {
    console.log("data", data)
    var premium = 0
    var odpremium = 0
    // for new india we get array for net premium and for idv so we need this logic
    if (typeof (data?.netPremium) === "object") {
      data?.netPremium?.forEach((foreachdata, index) => {
        premium = premium + foreachdata
      })
    }
    else {
      premium = data?.netPremium
    }

    if (typeof (data?.odpremium) === "object") {
      data?.odpremium?.forEach((foreachdata, index) => {
        odpremium = odpremium + foreachdata
      })
    }
    else {
      odpremium = data?.odpremium
    }
    setnetPremiumForBrekupvalue({ premium: premium, odpremium: odpremium })
    formContext.setsingleQuotesData(data);
    setQuotePremiumPopup(!quotePremiumPopup);
  };


  const quotePremium = (
    <div>
      <div className="premium-container" ref={ref}>
        <div className="topSection" >
          <div className="img-wrap">
            <img src={imgArrayForCard?.[formContext.singleQuotesData?.insuranceCompany]} alt=""
            />
          </div>
          <div className="premium-amount-wrap">
            <div className="premium-amount-box">
              <span className="fieldset">Idv</span>
              <h3>₹  {formContext.singleQuotesData?.insuredDeclareValue}</h3>
            </div>
          </div>
          <div className="premium-amount-wrap">
            <div className="premium-amount-box">
              <span className="fieldset">Premium</span>
              <h3>₹ {(Number(netPremiumForBrekupvalue?.premium)?.toFixed(0))}</h3>
            </div>
            <span className="help-text">Exclusive of GST</span>
          </div>
        </div>
        <p>{formContext.singleQuotesData?.insuranceCompany}</p>
        <div className="tab-section">
          <div className="tabs">
            <span className="tab-text">Premium Details</span>
          </div>
          <div className="tab-content">
            {netPremiumForBrekupvalue?.odpremium !== 0 && <div className="tab-row">
              <p>OD premium</p>
              <p>₹ {(Number(netPremiumForBrekupvalue?.odpremium)?.toFixed(0))}</p>
            </div>
            }
            {formContext.singleQuotesData?.tppremium !== 0 && <div className="tab-row">
              <p>TP premium</p>
              <p>₹ {(Number(formContext.singleQuotesData?.tppremium)?.toFixed(0))}</p>
            </div>
            }
            {formContext.singleQuotesData?.ridersList?.map(mapdata => {
              return <>
                {mapdata?.riderValue && <div className="tab-row" >
                  <p>{mapdata?.riderName}</p>
                  <p>₹ {(Number(mapdata?.riderValue)?.toFixed(0))}</p>
                </div>}
              </>
            })}

            {formContext.singleQuotesData?.discountList?.map(mapdataNcb => {
              return <>
                {mapdataNcb.type === "NCB Discount" && <div className="tab-row">
                  <p>{mapdataNcb?.type}</p>
                  <p> -₹ {(Number(mapdataNcb?.discountAmount)?.toFixed(0))}</p>
                </div>}
              </>
            })}

            <div className="tab-row borderTop ">
              <p className="font-weight-bold">Net premium</p>
              <p className="font-weight-bold">₹ {(Number(netPremiumForBrekupvalue?.premium)?.toFixed(0))}</p>
            </div>

            <div className="tab-row">
              <p>GST 18% </p>
              <p>₹ {(Number(formContext.singleQuotesData?.serviceTax)?.toFixed(0))}</p>
            </div>
            <div className="tab-row borderTop total-wrap">
              <p>Total Premium</p>
              <p>₹ {(Number(formContext.singleQuotesData?.grossPremium)?.toFixed(0))}</p>
            </div>
          </div>
        </div>
      </div >
      <div className="text-center mt-3">
        <button className="primary-btn " onClick={() => generatePDF(ref, { filename: 'PremiumBreakpoints.pdf' })}>Download PDF</button>
      </div>
    </div>
  );


  return (
    <React.Fragment>
      <div className="proposal-wrap">
        <Container fluid className="form-bg">
          <Row>
            <Col sm={12} md={4} className="p-left">
              <div className="leftside-form">
                <h3 className="title">Premium Amount ₹ {Number(formContext.singleQuotesData?.grossPremium)?.toFixed(0)}<p className="premium-text mb-0">
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-tex">Click to view breakup</Tooltip>
                    }
                  >
                    <span onClick={() => { openQuotePopup(formContext.singleQuotesData) }}><FaEye /></span>
                  </OverlayTrigger>
                </p>
                </h3>
                <p>(All prices are inclusive of GST)</p>

                <div>
                  <div className="sub-title">
                    <p className="sub-title_text">Coverage Details</p>
                  </div>
                  <div>
                    <FloatingLabel
                      controlId="floatingPassword"
                      label="Insured declare value(IDV)"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Insured declare value(IDV)"
                        className="floating-input"
                        value={formContext?.singleQuotesData?.insuredDeclareValue}
                        disabled
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingPassword"
                      label="Product"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Product"
                        className="floating-input"
                        value={formContext.singleQuotesData?.productType}
                        disabled
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingPassword"
                      label="Policy start date"
                      className="mb-3"
                    >
                      <Form.Control
                        type="date"
                        placeholder="Product"
                        className="floating-input"
                        disabled
                        value={value}
                      />
                    </FloatingLabel>

                  </div>
                </div>
                <div>
                  <div className="sub-title">
                    <p className="sub-title_text">Vehicle Details</p>
                  </div>
                  <div>
                    <FloatingLabel
                      controlId="floatingPassword"
                      label="Make and model"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Make and model"
                        className="floating-input"
                        value={formContext?.singleQuotesData?.carrierVariantDisplayName}
                        disabled
                      />
                    </FloatingLabel>
                  </div>
                  <button title="Back" onClick={() => backButtonPressed()} className="back-button">
                    {" "}
                    <SVG src={Arrow} alt="" className="back-arrow" />
                  </button>
                </div>
              </div>
            </Col>
            <Col sm={12} md={8} className="">
              <ContainerForForm vahanData={formContext.vahanData} singleQuotesData={formContext.singleQuotesData} carbikeformikValues={formContext.carbikeformikValues} createquotesresult={formContext.createquotesresult} quotesPageFormikData={formContext.quotesPageFormikData} PolicyDates ={ formContext.PolicyDates}/>
            </Col>
          </Row>
        </Container>
        {/* View breakup */}
        <VerticallyCenteredModal
          show={quotePremiumPopup}
          onHide={() => {
            QpPopupClose()
          }}
        >
          {quotePremium}
        </VerticallyCenteredModal>
      </div>
    </React.Fragment>
  );
}
