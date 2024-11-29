/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { createContext, useState, useEffect } from "react";
import * as api from "../API/authCurd";
import search from "../../src/images/search.svg";
import Accordion from "react-bootstrap/Accordion";
import { cities } from "../mockDataFolder/MockData";
import Form from "react-bootstrap/Form";
import SVG from "react-inlinesvg";
import toast from 'react-hot-toast';
import Spinner from 'react-bootstrap/Spinner';
import { carsJson } from "../mockDataFolder/CarJson";
import { makeModelVarient, financierNames } from "../mockDataFolder/MockData";
const FormContext = createContext({});

export const FormProvider = ({ children }) => {
    const [rtoData, setrtoData] = useState({
        rtoUserId: "",
        rtoId: "",

    });
    const [isActive, setIsActive] = useState(false);
    const [city, setCity] = useState([]);
    const uniqueTypes = [...new Set(cities?.map((item) => item.type))];
    const [cityNamePopUp, setcityNamePopUp] = useState();
    const [searchCity, setSearchCity] = useState([]);
    const [selectedRto, setselectedRto] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [loaderStatus, setloaderStatus] = useState(false);
    const [secondLoaderStatus, setsecondLoaderStatus] = useState(false);
    const spinner = (<Spinner animation="border" variant="danger" />)
    const [vahanData, setvahanData] = useState();
    const [singleQuotesData, setsingleQuotesData] = useState(); //  when user click on buy now option on quotes page
    const [carbikeformikValues, setcarbikeformikValues] = useState();// this will store car and bike forms  formik values
    const [createquotesresult, setcreatequotesresult] = useState([]);// to store the res of createquotes api 
    const [quotesPageFormikData, setquotesPageFormikData] = useState();// to store formik values of quotes page form
    const [kycApiRes, setkycApiRes] = useState();// to save kyc response on propsal page
    const [PolicyDates, setPolicyDates] = useState();// to save kyc response on propsal page
    const [quotesList, setquotesList] = useState([]);
    const [isvehNumberMissing, setisvehNumberMissing] = useState(true);
    const [godigitpayment, setgodigitpayment] = useState();
    const [errorPopUp, seterrorPopUp] = useState(false);
    const [routingPath, setroutingPath] = useState("/");
    const [getquotesApiFlag, setgetquotesApiFlag] = useState(true);
    const [makeNModel, setmakeNModel] = useState([]);
    const [mockdataAutosuggest, setmockdataAutosuggest] = useState(makeModelVarient);
    const [makeFilterData, setmakeFilterData] = useState([]);
    const [modelFilterData, setmodelFilterData] = useState([]);
    const [modelFilterDataBackup, setmodelFilterDataBackup] = useState([]);
    const [varientFilterData, setvarientFilterData] = useState([]);
    const [varientFilterDataBackup, setvarientFilterDataBackup] = useState([]);
    const [financierNamesArray, setfinancierNamesArray] = useState([]);
    const [carrierName, setcarrierName] = useState();
    const [pages, setPages] = useState('');
    const [listOfFiniance, setlistOfFiniance] = useState([]);
    const [loginPopupStatus, setloginPopupStatus] = useState(false);

    useEffect(() => {
        if (!rtoData?.rtoUserId) setLoginData()
    }, []);
   
    useEffect(() => {
        if (!modalShow) {
            setcityNamePopUp(""); // Reset the search input
            setsecondLoaderStatus(false); // Reset the second loader status
            setIsActive(false); // Reset the active accordion item
        }
    }, [modalShow]);

    // Fetches RTO login data using the 'rtoLogin' API call.
    const setLoginData = () => {
        api.rtoLogin().then(data => { setrtoData(data.data) }).catch(err => { })
    }

    // Update the state for RTO data by merging the previous state with the new key-value pair
    const handleRtoData = (name, value) => {
        setrtoData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    // Toggles the active state based on the provided 'type'.
    // Updates the active state using the provided 'type' parameter and triggers a search with the new type.
    function getData(type) {
        // Check if the click target is the accordion header
        if (window.event && window.event.target.classList.contains("accordion-button")) {
            setIsActive(isActive === type ? null : type);
            searchCityMethod(type, true);
        }
    }

    // Calculates the estimated height of a dynamic grid row based on the number of items in the 'city' array.
    const calculateRowHeight = () => {
        // Adjust this multiplier based on your design and content
        const rowHeight = 50; // Set your default row height
        const dataLength = Math.ceil(city.length / 3);
        return (dataLength * rowHeight) + 40;
    };

    // Searches for cities based on the provided value and updates state variables accordingly.
    // Parameters: - value: The search input value.
    //             - type: Boolean flag indicating whether to set the entire city data or just the search results.
    const searchCityMethod = (value, type) => {
        if (value?.trim()?.length > 0) {
            if (type) {
                setloaderStatus(true);  // Show spinner for the 'if' condition
            } else {
                setsecondLoaderStatus(true); // Show spinner for the 'else' condition
            }
            api.getCities("RTODetails", value)
                .then(item => {
                    const searchCityData = JSON.parse(item.data);
                    if (!searchCityData.data) {
                        notifyError(searchCityData.message)
                    }
                    if (type) {
                        setCity(searchCityData.data);
                    } else {
                        setSearchCity(searchCityData.data);
                    }
                }).catch(err => {
                    console.log("err", err); notifyError("An error occurred while fetching data");
                    setloaderStatus(false);
                    setsecondLoaderStatus(false);
                })
                .finally(() => {
                    setloaderStatus(false);
                    setsecondLoaderStatus(false);
                })
        } else {
            // error message
        }

    }

    const popupForRto = (
        <>
            <div className="search-box">

                <Form.Control
                    type="text"
                    placeholder="Search"
                    className=" mr-sm-2"
                    value={cityNamePopUp}
                    onChange={(e) => { setcityNamePopUp(e.target.value) }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            searchCityMethod(cityNamePopUp);
                        }
                    }}
                />
                {!secondLoaderStatus && (
                    <SVG className="search-icon" src={search} alt="" width={"25px"} onClick={() => searchCityMethod(cityNamePopUp)} />
                )}
                {secondLoaderStatus && spinner}
            </div>

            <>
                <div className="accordian-row seraching-list">
                    {searchCity?.map((cityItem) => (
                        <div className="accordian-column" key={cityItem.id}>
                            <a className="link-text" onClick={() => { setselectedRto(cityItem.display.replace('-', '').slice(0, 4).toUpperCase()); setModalShow(!modalShow) }}>{cityItem.display}</a>
                        </div>
                    ))}
                </div>
            </>
            <div className="sub-head">Popular Cities{loaderStatus && spinner}</div>
            <Accordion defaultActiveKey="">
                {uniqueTypes?.map((item, index) => (
                    <React.Fragment key={item}>
                        <Accordion.Item key={item} eventKey={index} onClick={() => getData(item)} className={isActive === item ? 'row-height' : 'height'} style={{ height: isActive === item ? calculateRowHeight() : '40px' }}>
                            <Accordion.Header>{item}</Accordion.Header>
                            {isActive === item && (
                                <Accordion.Body className="">
                                    <div className="accordian-row ">
                                        {city?.map((cityItem, index) => (
                                            <div className="accordian-column" key={index}>
                                                <a className="link-text" onClick={() => { setselectedRto(cityItem.display.replace('-', '').slice(0, 4).toUpperCase()); setModalShow(!modalShow) }}>{cityItem.display}</a>
                                            </div>
                                        ))}
                                    </div>
                                </Accordion.Body>
                            )}
                        </Accordion.Item>
                    </React.Fragment>
                ))}
            </Accordion>
        </>
    );
    const popupForTimeout = (
        <>
            <div>
                <br>
                </br>
            </div>

        </>
    );
    // notification part
    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);




    // to fetch make and model
    const makeModelApi = (type) => {
        setmockdataAutosuggest(type === "BikeVariants" ? makeModelVarient : carsJson)

        // api.getMakeModel(type).then((response) => { setapiData(JSON.parse(response.data)?.data) }).catch()

    }

    const setapiData = (apidata) => {
        // setmockdataAutosuggest(apidata)
        // console.log("apidata",apidata)
        setmakeNModel(apidata?.map(data => {
            return { make: data.make, model: data.model, varient: data.variant }
        }))
    }

    const clearFilter = () => {
        setmakeFilterData([]);
        setmodelFilterData([])
        setvarientFilterData([])
        setfinancierNamesArray([])
    }

    const handleFilter2 = (searchWord, filterdOn, formik) => {
        let newFilter
        let duplicateRemovedArray
        if (filterdOn === "make") {
            duplicateRemovedArray = makeNModel?.filter((value) => {
                return value[filterdOn]?.toLowerCase().includes(searchWord.toLowerCase());
            });
            newFilter = duplicateRemovedArray.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.make.toLowerCase() === value.make.toLowerCase()
                ))
            )
            formik.setFieldValue("model", "");
            formik.setFieldValue("varient", "");
        } else if (filterdOn === "model") {
            duplicateRemovedArray = makeNModel?.filter((value) => {
                return (value[filterdOn]?.toLowerCase().includes(searchWord.toLowerCase()) && value.make?.toLowerCase() === (formik.values.make.toLowerCase()));
            });

            newFilter = duplicateRemovedArray.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.model.toLowerCase() === value.model.toLowerCase()
                ))
            )
            formik.setFieldValue("varient", "");
        }
        else if (filterdOn === "varient") {
            duplicateRemovedArray = makeNModel?.filter((value) => {
                return (value[filterdOn]?.toLowerCase().includes(searchWord.toLowerCase()) && value.model?.toLowerCase() === (formik.values.model.toLowerCase()));
            });
            newFilter = duplicateRemovedArray.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.varient.toLowerCase() === value.varient.toLowerCase()
                ))
            )
        }
        else if (filterdOn === "vehicalFinancierName") {
            if (searchWord?.trim().length > 2) {
                duplicateRemovedArray = financierNames?.filter((value) => {
                    return (value.label?.toLowerCase().includes(searchWord.toLowerCase()));
                });
                newFilter = duplicateRemovedArray.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.label.toLowerCase() === value.label.toLowerCase()
                    ))
                )
            } else {
                newFilter = []
            }
        }
        if (searchWord === "") {
            setmakeFilterData([]);
            setmodelFilterData([])
            setvarientFilterData([])
            setfinancierNamesArray([])
        } else {
            if (filterdOn === "make") {
                setmakeFilterData(newFilter);
            }
            else if (filterdOn === "model") {
                setmodelFilterData(newFilter)
            }
            else if (filterdOn === "varient") {
                setvarientFilterData(newFilter)
            }
            else if (filterdOn === "vehicalFinancierName") {
                setfinancierNamesArray(newFilter)
            }
        }
    };




    const handleFilter = (searchWord, filterdOn, formik) => {

        if (filterdOn === "make") {
            if (searchWord?.trim().length > 1) {
                const filteredArray = mockdataAutosuggest?.filter((value) => {
                    return value[filterdOn]?.toLowerCase().includes(searchWord.toLowerCase());
                })
                const filteredArrayExactMatch = mockdataAutosuggest?.filter((value) => {
                    return value[filterdOn]?.toLowerCase() === (searchWord.toLowerCase());
                })
                setmakeFilterData(filteredArray)
                filteredArrayExactMatch?.map((value) => {
                    setmodelFilterDataBackup(prev => { return [...prev, ...value.models] })
                    return true
                });
            }
            else {
                setmodelFilterDataBackup([])
                setmakeFilterData([])
            }
            formik.setFieldValue("model", "");
            formik.setFieldValue("varient", "");
        }


        else if (filterdOn === "model") {
            if (searchWord?.trim().length > 1) {
                setvarientFilterDataBackup([])
                const filteredArray = modelFilterDataBackup?.filter((value) => {
                    return (value[filterdOn]?.toLowerCase().includes(searchWord.toLowerCase()));
                });

                const uniqueRecord = filteredArray?.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.model.toLocaleLowerCase() === value.model.toLocaleLowerCase()
                    ))
                )
                setmodelFilterData(uniqueRecord)
                const filteredArrayExactMatch = modelFilterDataBackup?.filter((value) => {
                    return value[filterdOn]?.toLowerCase() === (searchWord.toLowerCase());
                })

                console.log("filteredArrayExactMatch", filteredArrayExactMatch)
                filteredArrayExactMatch?.map((value) => {
                    setvarientFilterDataBackup(prev => { return [...prev, ...value?.variants] })
                    return value
                });
            } else {
                setmodelFilterData([])
                setvarientFilterDataBackup([])
            }
            formik.setFieldValue("varient", "");
        }
        else if (filterdOn === "varient") {
            const filteredArray = varientFilterDataBackup?.filter((value) => {
                return (value.toLowerCase().includes(searchWord.toLowerCase()));
            });

            const uniqueRecord = filteredArray?.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.toLocaleLowerCase() === value.toLocaleLowerCase()
                ))
            )

            setvarientFilterData(uniqueRecord.map(mapData => { return { varient: mapData } }))

        }
        else if (filterdOn === "vehicalFinancierName") {
            if (searchWord?.trim().length > 2) {

                const duplicateRemovedArray = listOfFiniance?.filter((value) => {
                    return (value?.financierName?.toLowerCase().includes(searchWord.toLowerCase()));
                });

                console.log("duplicateRemovedArray",duplicateRemovedArray)
                // const duplicateRemovedArray = financierNames?.filter((value) => {
                //     return (value?.label?.toLowerCase().includes(searchWord.toLowerCase()));
                // });
                // console.log("duplicateRemovedArray", duplicateRemovedArray)

                const newFilter = duplicateRemovedArray?.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t?.financierName?.toLowerCase() === value?.financierName?.toLowerCase()
                    ))
                )
                // console.log("newFilter", newFilter)

                setfinancierNamesArray(newFilter)
            } else {
                setfinancierNamesArray([])
            }
        }
        if (searchWord === "") {
            setmakeFilterData([]);
            setmodelFilterData([])
            setvarientFilterData([])
            setfinancierNamesArray([])

        }
    };
    const setFinanceArray = (data) => {

    }

    const commonNotifyDetails = {
        rtoData,
        handleRtoData,
        setLoginData,
        popupForRto,
        selectedRto,
        setselectedRto,
        setModalShow,
        modalShow,
        notifySuccess,
        notifyError,
        loaderStatus,
        setloaderStatus,
        secondLoaderStatus,
        setsecondLoaderStatus,
        spinner,
        setvahanData,
        vahanData,
        setsingleQuotesData,
        singleQuotesData,
        setcarbikeformikValues,
        carbikeformikValues,
        createquotesresult,
        setcreatequotesresult,
        setquotesPageFormikData,
        quotesPageFormikData,
        setkycApiRes,
        kycApiRes,
        PolicyDates,
        setPolicyDates,
        setisvehNumberMissing,
        isvehNumberMissing,
        godigitpayment,
        setgodigitpayment,
        popupForTimeout,
        errorPopUp,
        seterrorPopUp,
        setroutingPath,
        routingPath,
        setquotesList,
        quotesList,
        setgetquotesApiFlag,
        getquotesApiFlag,
        makeFilterData,
        modelFilterData,
        varientFilterData,
        handleFilter,
        clearFilter,
        makeModelApi,
        financierNamesArray,
        setcarrierName,
        carrierName,
        setFinanceArray,
        setlistOfFiniance,
        listOfFiniance,
        setPages,
        pages,
        setloginPopupStatus,
        loginPopupStatus
    };


    // notification part end
    return (
        <FormContext.Provider value={commonNotifyDetails}>
            {children}
        </FormContext.Provider>
    )
}

export default FormContext 