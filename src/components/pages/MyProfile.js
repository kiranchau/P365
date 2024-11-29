import React, { useEffect, useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import Progress from "../../images/progress.jpg";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import Godigit from "../../images/Godigit.png";
import * as api from "../../API/authCurd"
import futureGenrali from "../../images/futureGenrali.png";
import ICICI from "../../images/ICICI-insurance.png";
import reliance from "../../images/reliance.png";
import NewIndia from "../../images/new-india.png";
import UseFormContext from "../../context/UseFormContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { PageNotFound } from "../commonModules/PageNotFound";
import { useParams } from "react-router-dom";

var CryptoJS = require("crypto-js");

export const MyProfile = () => {
  const { id } = useParams();


  const formContext = UseFormContext();
  const [toggle, setToggle] = useState(1);
  const [policyDetailsData, setPolicyDetailsData] = useState([]);
  // const [mobileData, setMobileData] = useState("");
  const imgArrayForCard = {
    "Reliance General Insurance Co. Ltd": reliance,
    "New India Assurance": NewIndia,
    "Future Generali India Insurance Co. Ltd": futureGenrali,
    "GO DIGIT General Insurance CO. LTD": Godigit,
    "ICICI Lombard General Insurance Co. Ltd": ICICI,
  };
  let history = useHistory();
  /**
   * Updates the toggle state for a specific element identified by its 'id'.
   * @param {string} id - The unique identifier of the element to toggle.
   */

  useEffect(() => {
    getPoliciesList()
  }, [history])

  useEffect(() => {
    if (id) {
      document.getElementById("Prosposal").click()
    }
  }, [id]);

  const getPoliciesList = () => {
    const userLogin = sessionStorage.getItem('userLoggin');
    if (userLogin) {
      var bytes = CryptoJS.AES.decrypt(userLogin, 'dynamipass');
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      formContext.setloaderStatus(true);
      api.downloadPolicy(decryptedData)
        .then((data) => {
          console.log("jsonData", JSON.parse(data?.data));

          if (data.data) {
            const jsonData = JSON.parse(data?.data);
            setPolicyDetailsData(jsonData?.data?.policyDetails.reverse());
            formContext.setloaderStatus(false);
          }
        })
        .catch((err) => {
          setPolicyDetailsData([]);
          formContext.setloaderStatus(false);
          console.log("err", err);
        });
    } else {
      formContext.setPages("Myprofile");
      history.push("/signin")
    }
  }

  function updateToggle(id) {
    setToggle(id);
    if (id === 6) {
      sessionStorage.clear()
      history.push("/")
    } else if (id === 5) {
      getPoliciesList()
    }

  }

  const downloadFile = (carrierId, mobile, secretKey, url) => {
    if (carrierId === 29) {
      api.downloadPolicyDoc(mobile, secretKey)
        .then((data) => {
          console.log("jsonData@@@@", JSON.parse(data?.data));

          if (data.data) {
            const jsonData = JSON.parse(data?.data);
            window.open(jsonData?.data?.DownloadLink);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = "document";
      link.target = "_blank";
      document.body.appendChild(link);
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
      }, 500);
    }
  };

  function mobileTextPass(mobileNumber) {
    formContext.setloaderStatus(true);
    api.downloadPolicy(mobileNumber)
      .then((data) => {
        const jsonData = JSON.parse(data?.data);
        setPolicyDetailsData(jsonData?.data?.policyDetails);
        formContext.setloaderStatus(false);
      })
      .catch((err) => {
        setPolicyDetailsData([]);
        formContext.setloaderStatus(false);
        console.log("err", err);
      });
    // setMobileData('');
  }

  return (
    <div className="container-fluid mt-3">
      <div className="tab-wrap">
        <div className="tabs">
          <button
            className={toggle === 1 ? "active" : ""}
            onClick={() => updateToggle(1)}
          >
            My Profile{" "}
          </button>
          <button
            className={toggle === 2 ? "active" : ""}
            onClick={() => updateToggle(2)}
          >
            Risk and Insurance Profile{" "}
          </button>
          <button
            className={toggle === 3 ? "active" : ""}
            onClick={() => updateToggle(3)}
          >
            My Quotes{" "}
          </button>
          <button
            className={toggle === 4 ? "active" : ""}
            onClick={() => updateToggle(4)}
          >
            My Prosposal{" "}
          </button>
          <button
            className={toggle === 5 ? "active" : ""}
            onClick={() => updateToggle(5)}
            id="Prosposal"
          >
            My Policies{" "}
          </button>
          <button
            className={toggle === 6 ? "active" : ""}
            onClick={() => updateToggle(6)}
          >
            Log Out{" "}
          </button>
        </div>
        <div className="content-wrap">
          <div
            className={
              toggle === 1 ? "showConten" : "content my-profile-content"
            }
          >
            <div className="person-name-wrap">
              <IoPersonCircleOutline
                style={{ width: "100px", height: "100px" }}
              />
              <p className="person-name">Kuldeep Patil</p>
            </div>
            <div className="personal-info-wrap">
              <div className="personal-info">
                <label className="label">Full Name</label>
                <p className="value">Kuldeep Patil</p>
              </div>
              <div className="personal-info">
                <label className="label">Email Address</label>
                <p className="value">kuldeeppatil@gmail.com</p>
              </div>
              <div className="personal-info">
                <label className="label">Address</label>
                <p className="value">Pune</p>
              </div>
              <div className="personal-info">
                <label className="label">Mobile Number</label>
                <p className="value">9090909000</p>
              </div>
              <div className="personal-info">
                <label className="label">Gender</label>
                <p className="value">Male</p>
              </div>
              <div className="personal-info">
                <label className="label">Marital status</label>
                <p className="value">Single</p>
              </div>
            </div>
          </div>
          <div
            className={
              toggle === 2 ? "showConten" : "content insurance-profile"
            }
          >
            <img src={Progress} width={"40%"} />
          </div>
          <div className={toggle === 3 ? "showConten" : "content my-quotes"}>
            <div>
              <img src={Progress} width={"40%"} />
            </div>
          </div>
          <div className={toggle === 4 ? "showConten" : "content"}>
            <p>
              Similar to the Nav component, you can force the contents of your
              Tabs to extend the full available width. To proportionately fill
              the space use fill. Notice that the Tabs is the entire width but
              each Tab item is a different size.
            </p>
          </div>
          <div className={toggle === 5 ? "showConten my-policies" : "content "}>
            <div className="policies">
              <Table className="policy-details-wrap">
                <thead>
                  <tr>
                    <th></th>
                    <th>Purchased on</th>
                    <th>insured Name</th>
                    <th>Policy Purchased for</th>
                    <th>Policy Number</th>
                    <th>Policy Start Date</th>
                    <th>Policy End Date</th>
                    <th></th>
                  </tr>
                </thead>
                {policyDetailsData == undefined
                  ? formContext.loaderStatus && formContext.spinner ||
                  <tr>
                    <td colSpan={7}>
                      <PageNotFound message={"No data found"} />
                    </td>
                  </tr>
                  : policyDetailsData?.map((details) => {
                    return (
                      <tbody>
                        <tr>
                          <td>
                            <div className="policy-image">
                              <img
                                src={imgArrayForCard?.[details?.insurerName]}
                                alt=""
                                className="logo"
                              />
                            </div>
                          </td>
                          <td>{details?.policyIssueDate}</td>
                          <td>{details?.Name}</td>
                          <td>NA</td>
                          <td>{details?.policyNo}</td>
                          <td>{details?.policyStartDate}</td>
                          <td>{details?.policyExpiryDate}</td>
                          <td>
                            <Button
                              className="primary-btn"
                              onClick={() => {
                                downloadFile(details?.carrierId, details?.mobile, details?.secretKey, details?.DownloadLink);
                              }}
                            >
                              Download
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
