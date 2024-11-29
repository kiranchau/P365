import axios from "axios"
import { convertDate, gateage } from "../components/commonModules/CommonCode"
export const rtoBaseUrl = process.env.REACT_APP_RTO_API_URL
export const rtoLoginUrl = `login`
export const projectBaseurl = process.env.REACT_APP_BASE_URL
export const getCitiesUrl = `/cxf/configmanager/config/getconfigdata`
export const createQote = `/cxf/authrestservices/integrate/invoke`
export const getRtodetails = '/cxf/authrestservices/integrate/invoke'
export const getpolicyName = '/cxf/Insuranceservice/request/integrate/invoke'
export const kycBaseurl = `/cxf/kycservice/request/integrate/invoke`
export const addressUrl = `https://api.postalpincode.in/pincode/`
export const mobileNumberurl = `/cxf/Otpservice/request/integrate/invoke`



// to login rto with username and password
export function rtoLogin() {
    const data = {
        username: process.env.REACT_APP_RTO_API_USERNAME,
        password: process.env.REACT_APP_RTO_API_PASSWORD,
    }
    return axios.post(rtoBaseUrl + rtoLoginUrl, data)
}
// to get data from rto about vechicle
export function rtoGetData(userId, id, searchParameter) {
    const data = {
        "task": "detailedSearch",
        "essentials": {
            "vehicleNumber": searchParameter,
            "signzyID": "AKYTSZY"
        }
    }
    const rtoLoginGetData = `${userId}/vehicleregistrations/?access_token=${id}`
    return axios.post(rtoBaseUrl + rtoLoginGetData, data)
}
// to get cities when popup appears eg mh-12pune
export function getCities(filterData, city) {

    const config = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Allow-Headers": "Origin, Content-Type",
            "Access-Control-Allow-Credentials": true
        }
    }
    return axios.get(projectBaseurl + getCitiesUrl + `?filter=${filterData}&q=${city}`)
}

// to create Quotes on bike  page
export function createQoteApi(values, idv = 0, prevQuoteId) {

    console.log("prevQuoteIdbike", prevQuoteId, "idv", idv)
    const planType = values?.insuranceFor === "new" ? "OD-TP-5" : values?.policyType + "-" + values?.policyTerms
    let PreviousPolicyExpiryDate
    if (values?.insuranceFor === "new") {
        PreviousPolicyExpiryDate = null
    } else {
        PreviousPolicyExpiryDate = values?.expiryDate ? convertDate(values?.expiryDate, 1) : values?.previousPolicy

    }
    let tpDates = {
        TPPolicyExpiryDate: values?.tpPolicyEndtDate ? convertDate(values?.tpPolicyEndtDate, 3) : null,
        TPPolicyStartDate: values?.tpPolicyStartDate ? convertDate(values?.tpPolicyStartDate, 3) : null,
        ODPolicyExpiryDate: "22/2/2028"
    }
    if (values?.insuranceFor === "new") {
        tpDates.TPPolicyExpiryDate = null
        tpDates.TPPolicyStartDate = null
        tpDates.ODPolicyExpiryDate = null
    }
    const data = {
        "header": {
            "messageId": "P365754",
            "source": "web",
            "deviceId": "ABCD12345",
            "browser": "Firefox V - 71",
            "transactionName": "getBikeQuote"
        },
        "body": {
            "quoteParam": {
                "ncb": Number(values?.noClaimBonus),
                "ownedBy": values.vehicalRegType ? values.vehicalRegType : "Individual",
                "policyType": values?.insuranceFor ? values?.insuranceFor : "renew",
                "planType": planType,
                "riders": values?.addOnCover ? values?.addOnCover : [],
                "firstName": values?.firstName,
                "lastName": values?.lastName,
                "email": values?.email,
                "phoneNumber": values?.phoneNumber,
                "vahanData": "demo"

            },
            "vehicleInfo": {
                "IDV": Number(idv),
                "RTOCode": values?.registeredRto?.slice(0, 4).toUpperCase(),
                "previousClaim": values?.insuranceClaim,
                "make": values?.make,
                "model": values?.model,
                "variant": values?.varient,
                "PreviousPolicyExpiryDate": PreviousPolicyExpiryDate,
                "dateOfRegistration": convertDate(values?.registrationYear, 1),
                "best_quote_id": idv > 0 ? prevQuoteId : "",
                "TPPolicyExpiryDate": tpDates.TPPolicyExpiryDate,
                "TPPolicyStartDate": tpDates.TPPolicyStartDate,
                "ODPolicyExpiryDate": tpDates.ODPolicyExpiryDate,
            },
            "campaign_id": "ce9a676c-af21-d810-7f96-5c98bf17d9f6"
        }
    }
    return axios.post(projectBaseurl + createQote, data)
}

// to create Quotes on bike and car page
export function createQoteApiCar(values, idv = 0, prevQuoteId) {
    console.log("prevQuoteIdcarrr", prevQuoteId)
    const planType = values?.insuranceFor === "new" ? "OD-TP-3" : values?.policyType
    let PreviousPolicyExpiryDate
    if (values?.insuranceFor === "new") {
        PreviousPolicyExpiryDate = null
    } else {
        PreviousPolicyExpiryDate = values?.expiryDate ? convertDate(values?.expiryDate, 1) : values?.previousPolicy

    }
    let tpDates = {
        TPPolicyExpiryDate: values?.tpPolicyEndtDate ? convertDate(values?.tpPolicyEndtDate, 3) : null,
        TPPolicyStartDate: values?.tpPolicyStartDate ? convertDate(values?.tpPolicyStartDate, 3) : null,
        ODPolicyExpiryDate: "22/2/2028"
    }
    if (values?.insuranceFor === "new") {
        tpDates.TPPolicyExpiryDate = null
        tpDates.TPPolicyStartDate = null
        tpDates.ODPolicyExpiryDate = null
    }

    const data = {
        "header": {
            "messageId": "",
            "source": "web",
            "deviceId": "web",
            "browser": "Chrome V - 120",
            "transactionName": "carQuote"
        },
        "body": {
            "vehicleInfo": {
                "IDV": Number(idv),
                "PreviousPolicyExpiryDate": PreviousPolicyExpiryDate,
                "RTOCode": values?.registeredRto?.slice(0, 4).toUpperCase(),
                "dateOfRegistration": convertDate(values?.registrationYear, 1),
                "idvOption": 1,
                "previousClaim": values?.insuranceClaim,
                "registrationPlace": values?.registeredRto,
                "make": values?.make,
                "model": values?.model,
                "variant": values?.varient,
                "fuel": values?.fuel,
                "cubicCapacity": "",
                "best_quote_id": idv > 0 ? prevQuoteId : "",
                "TPPolicyExpiryDate": tpDates.TPPolicyExpiryDate,
                "TPPolicyStartDate": tpDates.TPPolicyStartDate,
                "ODPolicyExpiryDate": tpDates.ODPolicyExpiryDate,
            },
            "quoteParam": {
                "ncb": Number(values?.noClaimBonus),
                "ownedBy": "Individual",
                "policyType": values?.insuranceFor ? values?.insuranceFor : "renew",
                "quoteType": "3",
                "riders": values?.addOnCover ? values?.addOnCover : [],
                "planType": planType,
                "occupationId": "1",
                "firstName": values?.firstName,
                "lastName": values?.lastName,
                "email": values?.email,
                "phoneNumber": values?.phoneNumber,
                "vahanData": "demo"
            },
            "requestSource": "web",
            "messageId": ""

        }
    }
    return axios.post(projectBaseurl + createQote, data)
}
// to get Quotes on Quotes page bike/car
export function getQoteApi(qname, messageId, QUOTE_ID, transactionName) {
    const data = {
        "header": {
            "messageId": "P365754",
            "source": "web",
            "deviceId": "ABCD12345",
            "browser": "Firefox V - 71",
            "transactionName": transactionName === "bike" ? "getBikeQuoteResult" : "getCarQuoteResult"
        },
        "body": {
            "qname": qname, "messageId": messageId, "QUOTE_ID": QUOTE_ID
        }
    }

    return axios.post(projectBaseurl + createQote, data)


}

// to get list of all rtos
export function getRtoInfo() {
    const data = {
        "header": {
            "messageId": "P365754",
            "source": "web",
            "deviceId": "ABCD12345",
            "browser": "Firefox V - 71",
            "transactionName": "getPopularRTO"
        },
        "body": { "popularRTOList": "Y", "requestSource": "web", "leadSource": { "utm_campaign": "" } }
    }
    return axios.post(projectBaseurl + getRtodetails, data)
}

// to get list of all riders
export function getRiderInfo() {
    const data = {
        "header": {
            "source": "web",
            "deviceId": "web",
            "browser": "Firefox V -74",
            "transactionName": "findAppConfig"
        },
        "body": {
            "searchValue": "Bike",
            "documentType": "Rider",
            "requestSource": "web",
            "leadSource": {
                "utm_campaign": ""
            }
        }
    }
    return axios.post(projectBaseurl + getRtodetails, data)
}

//to create lead for policy 
export function createLead(values, props) {
    const data = {
        "header": {
            "source": "web",
            "deviceId": "web",
            "browser": "Firefox V - 74",
            "transactionName": "createLead"
        },
        "body": {
            "quoteParam": {
                "insuranceType": 1,
                "ncb": 25,
                "owneredBy": "Individual",
                "personAge": 40,
                "policyType": "renew",
                "zone": "ZoneA",
                "customerpinCode": "",
                "customerCity": "",
                "customerState": "",
                "documentType": "QuoteRequest",
                "quoteType": 2,
                "policyExpiredAge": 0.0547945205479452,
                "userIdv": 0
            },
            "vehicleInfo": {
                "IDV": 0,
                "RTOCode": "MH01",
                "name": "Hero MotoCorp",
                "previousClaim": "false",
                "previousPolicyInvoiceCoverStatus": false,
                "previousPolicyZeroDepStatus": false,
                "regYear": "2015",
                "displayVehicle": "Hero MotoCorp Duet VX",
                "registrationPlace": "MH-01 Mumbai Tardeo",
                "variantId": "BikeVarientId-824",
                "PreviousPolicyExpiryDate": "31/3/2020",
                "previousPolicyExpired": "N",
                "city": "MUMBAI",
                "isCostal": "N",
                "isEarthQuakeArea": "Y",
                "state": "Maharashtra",
                "dateOfRegistration": "01/07/2015",
                "PreviousPolicyStartDate": "01/04/2019",
                "idvOption": 1
            },
            "QUOTE_ID": "BIKEQUOTE00141337",
            "UNIQUE_QUOTE_ID_ENCRYPTED": "hFN__gQby3bVZMqwqw1s2qwqwIaCZobim__70XS7",
            "contactInfo": {
                "messageId": "",
                "termsCondition": true,
                "firstName": "Kuldeep",
                "mobileNumber": "8578999999",
                "createLeadStatus": false
            },
            "requestSource": "web",
            "campaign_id": "316903a4-ff2e-a04d-8f16-5cbae50328ed",
            "leadSource": {
                "utm_campaign": ""
            }
        }
    }
    return axios.post(projectBaseurl + getRtodetails, data);
}

//to generate bike proposal after 7 forms 
export function generateBikeproposal(values, props, transactionName, singlerocord) {

    localStorage.setItem("insuranceCompany", singlerocord?.insuranceCompany)
    let registrationNumber = values?.registeredRto
    let dateOfBirth = convertDate(values?.kycNomineDob, 3)
    let vehicleLoanType = ""
    let financeInstitutionCode = values?.financierID
    let financeInstitution = values?.financierName
    let GSTIN = values.ownerGstin
    if (singlerocord?.insuranceCompany === "GO DIGIT General Insurance CO. LTD" && transactionName?.insuranceFor === "new" && transactionName?.formtype === "bike") {
        registrationNumber = ""
        console.log("registrationNumber", registrationNumber)
    }

    if (singlerocord?.insuranceCompany === "New India Assurance") {
        dateOfBirth = convertDate(values?.kycNomineDob, 1)
        vehicleLoanType = "Hypothecation"
    }
    if (singlerocord?.insuranceCompany === "Reliance General Insurance Co. Ltd" || singlerocord?.insuranceCompany === "GO DIGIT General Insurance CO. LTD") {
        vehicleLoanType = "Hypothecation"
    }
    if (values?.vehicalPurchaseLoan === "no") {
        vehicleLoanType = "NA"
    }
    if (values?.vehicalPurchaseLoan === "no" && singlerocord?.insuranceCompany === "ICICI Lombard General Insurance Co. Ltd") {
        vehicleLoanType = "NA"
        financeInstitution = "NA"
        financeInstitutionCode = "NA"
    }

    if (singlerocord?.insuranceCompany === "ICICI Lombard General Insurance Co. Ltd" && !GSTIN) {
        console.log("GSTIN2", GSTIN)

        GSTIN=undefined
    }
    localStorage.setItem("type", transactionName?.formtype)

    const data = {
        "header": {
            "transactionName": transactionName?.formtype === "bike" ? "submitBikeProposal" : "carProposal",
            "messageId": null,
            "deviceId": "ABCD12345"
        },
        "body": {
            "nominationDetails": {
                "nomPersonAge": gateage(values?.nomineDob),
                "nomFirstName": values?.nomineFirstName,
                "nomLastName": values?.nomineLastName,
                "nomDateOfBirth": convertDate(values?.nomineDob, 3),
                "nominationRelation": values?.nomineRelation,
                "nominationRelationId": 1
            },
            "vehicleDetails": {
                "purchasedLoan": values?.vehicalPurchaseLoan,
                "vehicleLoanType": vehicleLoanType,
                "financeInstitutionCode": financeInstitutionCode,
                "financeInstitution": financeInstitution,
                "engineNumber": values?.engineNumber,
                "isVehicleAddressSameAsCommun": values?.isRegisteredAddressSame,
                "registrationAddress": {
                    "regArea": values?.ownerAddress,
                    "regPincode": values?.ownerPincode,
                    "regCity": values?.ownerCity,
                    "regDisplayArea": values?.ownerAddress,
                    "regDistrict": values?.ownerLocation,
                    "regDisplayField": values?.ownerAddress,
                    "regState": values?.ownerState,
                    "regDoorNo": values?.ownerFlatNumber,

                },
                "chassisNumber": values?.chassisNumber,
                "registrationNumber": registrationNumber,
            },
            "proposerDetails": {
                "lastName": values?.ownerLastName,
                "gender": values?.kycNomineGender,
                "mobileNumber": values?.ownerPhoneNumber,
                "maritalStatus": values?.ownerMaritialStus,
                "dateOfBirth": dateOfBirth,
                "emailId": values?.ownerEmail,
                "panNumber": values?.kycNominePanNumber,
                "personAge": gateage(values?.kycNomineDob),
                "firstName": values?.ownerFirstName,
                "GSTIN": GSTIN,
                "communicationAddress": {
                    "comArea": values?.ownerAddress,
                    "comPincode": values?.ownerPincode,
                    "comCity": values?.ownerCity,
                    "comDisplayArea": values?.ownerAddress,
                    "comDistrict": values?.ownerLocation,
                    "comDisplayField": values?.ownerAddress,
                    "comState": values?.ownerState,
                    "comDoorNo": values?.ownerFlatNumber,
                },
                "salutation": values?.ownerPrefix,
                "ckycNo": values?.kycFailedData,

            },
            "source": "agency",
            "requestSource": "agency",
            "appointeeDetails": {},
            "insuranceDetails": {
                "policyNumber": values?.policyNumber,
                "insuranceType": props?.carbikeformikValues?.insuranceFor,
                "ncb": Number(props?.quotesPageFormikData?.noClaimBonus ? props?.quotesPageFormikData?.noClaimBonus : props?.carbikeformikValues?.noClaimBonus),
                "insurerName": values?.policyInsuranceId,
                "insurerId": singlerocord?.insuranceCompany === "New India Assurance" ? 25 : values?.policyInsuranceName,
                "prevPolicyType": "Comprehensive Policy",
                "TPPolicyNumber": values?.tpPolicyNumber,
                "TPPolicyInsurer": values?.tpPolicyInsuranceName,

            },
            "carrierId": props?.singleQuotesData?.carrierId,
            "productId": props?.singleQuotesData?.productId,
            "QUOTE_ID": props?.createquotesresult[0]?.QUOTE_ID ? props?.createquotesresult[0]?.QUOTE_ID : props.PolicyDates?.QUOTE_ID,
            "businessLineId": transactionName?.formtype === "bike" ? 2 : 3,
            "campaign_id": "97c0ef04-fcac-6b03-aa58-5c0512ad1884"
        }
    }
    return axios.post(projectBaseurl + getRtodetails, data);
}

//to get payment url 
export function paymentApi(values) {
    console.log("paymentApi", values)
    const data = {
        "header": {
            "messageId": "P365754",
            "source": "web",
            "deviceId": "ABCD12345",
            "browser": "Firefox V - 71",
            "transactionName": "paymentService"
        },

        "body": values
    }

    return axios.post(projectBaseurl + getRtodetails, data);
}


// to download policy
export function downloadPolicy(mobileNumber) {
    const data = {
        "header": {
            "messageId": "P365754",
            "source": "web",
            "deviceId": "ABCD12345",
            "browser": "Firefox V - 71",
            "transactionName": "transDataReader"
        },
        "body": {
            "docId": `PolicyDetails-${mobileNumber ? mobileNumber : localStorage.getItem("ownerPhoneNumber")}`,
            "requestSource": "web",
            "leadSource": {
                "utm_campaign": ""
            }
        }
    }
    return axios.post(projectBaseurl + getRtodetails, data)
}
export function kycVeryfy(values) {
    const data = {
        URL: "https://api.brobotinsurance.com/Verify_CKYC_Details",
        request: {
            "PAN": values.kycNominePanNumber,
            "DOB": convertDate(values.kycNomineDob, 3),
            "CKYC": "",
            "MOBILE": "",
            "PINCODE": "",
            "BIRTHYEAR": "",
            "ReturnURL": "test",
            "UNIQUEID": Math.floor(100000 + Math.random() * 900000),
            "CIN": "",
            "VOTERID": "",
            "DL_No ": "",
            "PASSPORT": "",
            "AADHAAR_NO": "",
            "FULLNAME": "",
            "GENDER": ""
        },
        headers: {
            "Subscription-Key": "9338b32e0ed447b68b257ccdc6cfb0bb",
            "Content-Type": "application/json"
        }
    }

    return axios.post(projectBaseurl + kycBaseurl, data,)
}


export function getFullAddress(pincode) {
    return axios.get(addressUrl + pincode)
}

export function getMakeModel(type) {
    const data = {
        "header": {
            "source": "web",
            "deviceId": "web",
            "browser": "Firefox V -74",
            "transactionName": "findAppConfig"
        },
        "body": {
            "searchValue": "",
            "documentType": type,
            "campaign_id": "316903a4-ff2e-a04d-8f16-5cbae50328ed",
            "requestSource": "web",
            "leadSource": {
                "utm_campaign": ""
            }
        }
    }


    return axios.post(projectBaseurl + getRtodetails, data)
}

export function vahanDataCounch(id) {
    const data = {
        "documentId": "BikeVarientId-" + id
    }
    return axios.post(projectBaseurl + kycBaseurl, data,)
}

// future kyc api to create token
export function getTokenForFutureApi() {
    return axios.post('https://fglpg001.futuregenerali.in/NLCKYC/API/CKYC/GenerateToken')
}
// future kyc api to get kyc details
export function getKycFutureApi(key, values) {
    const data = {
        URL: "https://fglpg001.futuregenerali.in/NLCKYC/API/CKYC/CreateCKYC",
        request: {
            req_id: key,
            customer_type: 'I',
            id_type: 'PAN',
            id_num: values?.kycNominePanNumber,
            full_name: values?.kycNomineFullName,
            gender: (values?.kycNomineGender.charAt(0)).toUpperCase(),
            dob: convertDate(values?.kycNomineDob, 3),
        },
    }
    return axios.post(projectBaseurl + kycBaseurl, data,)
}

// not in use can remove this
export function getKycNewIndiaApi(values, uid) {
    console.log("values", values)
    const data = {
        URL: "https://uatb2bug.newindia.co.in/B2B/initiateKycVerification",
        request: {
            "quoteNo": "",
            "policyHolCode": uid,
            "idNo": values?.kycNominePanNumber,
            "idType": "C",
            "dob": convertDate(values?.kycNomineDob, 1),
            "appid": "MODEL1",
            "kycSource": "KYC_MODEL1",
            "workFlowId": "NIA_Agent_Led",
            "redirectUrl": "",
            "userId": "USROB",
            "mobileNo": "",
            "pinCode": ""
        },
        headers: {
            'X-RapidAPI-Key': '7cd34721e3msh5ada1a494ce6a9bp17e6f0jsn9c366256e72d',
            'X-RapidAPI-Host': 'pincode.p.rapidapi.com',
            'Content-Type': 'application/json',
            'Authorization': 'Basic R2VuZXJpY1VzZXJLeWM6R2VuIzEyMzQ1'
        },
    }

    return axios.post(projectBaseurl + kycBaseurl, data)
}


// get state 
export function getState() {
    const data = {
        "documetType": "State",
    }
    return axios.post(projectBaseurl + kycBaseurl, data,)
}
// get state 
export function getCity(state) {
    const data = {
        "documetType": "State",
        "state": state
    }
    return axios.post(projectBaseurl + kycBaseurl, data,)
}

export function getPincodeData(values) {
    const data = {
        "header": {
            "source": "web",
            "deviceId": "web",
            "browser": "Firefox V -74",
            "transactionName": "findAppConfig"
        },
        "body": {
            "searchValue": values,
            "documentType": "Pincode",
            "requestSource": "web",
            "leadSource": {
                "utm_campaign": ""
            }
        }
    }

    return axios.post(projectBaseurl + getRtodetails, data);
}


export function loanFinancer() {
    const data = {
        "header": {
            "source": "web",
            "deviceId": "web",
            "browser": "Firefox V -74",
            "transactionName": "findAppConfig"
        },
        "body": {
            "searchValue": "",
            "documentType": "LoanFinancer",
            "campaign_id": "316903a4-ff2e-a04d-8f16-5cbae50328ed",
            "requestSource": "web",
            "leadSource": {
                "utm_campaign": ""
            }
        }
    }
    return axios.post(projectBaseurl + getRtodetails, data)
}

// to get list of all riders
export function getpolicyProviderName(name) {
    // const data = {
    //     "documentType": "InsuranceMapping",
    //     "insurerName": "",
    //     "InsurerCode": ""
    // }
    const imgArrayForCard = {
        "Reliance General Insurance Co. Ltd": 47,
        "New India Assurance": 25,
        "Future Generali India Insurance Co. Ltd": 37,
        "GO DIGIT General Insurance CO. LTD": 61,
        "ICICI Lombard General Insurance Co. Ltd": 29,

    }
    console.log("imgArrayForCard?.[name]", imgArrayForCard?.[name])
    const data = {
        "documentType": "Carrier",
        "selectedCarrier": imgArrayForCard?.[name]
    }
    return axios.post(projectBaseurl + getpolicyName, data)
}


// to get list of all riders
export function shareQuotes(quotesID = "BIKEQUOTE00175904") {
    const data =
    {
        "header": {
            "transactionName": "quoteDataReader",
            "messageId": "",
            "deviceId": "ABCD12345"
        },
        "body": {
            "docId": quotesID

        }
    }
    return axios.post(projectBaseurl + getRtodetails, data)
}

export function mobileNumber(action, number, enteredOTP) {
    const data = {
        "action": action,
        "mobileNumber": number,
        "enteredOTP": action === "sendOTP" ? null : enteredOTP,
    }
    return axios.post(projectBaseurl + mobileNumberurl, data)
}


export function downloadPolicyDoc(mobileNumber, pKey) {
    const data = {
        "header": {
            "transactionName": "policyDocDownloadService",
            "messageId": "",
            "deviceId": "ABCD12345"
        },
        "body": {
            "mobile": localStorage.getItem("ownerPhoneNumber"),
            "pKey": pKey
        }
    }
    return axios.post(projectBaseurl + getRtodetails, data)
}

// to generate token for icici kyc
export function iciciKycToken() {
    const data = {
        request: {
            "client_id": "NavneetIns",
            "client_secret": "prvkPbG6Hv8XXvcUusUq6udV",
            "grant_type": "password",
            "password": "QKLbFFtLF9RbAR9",
            "scope": "esb-kyc",
            "username": "NavneetIns"
        },
        headers: {
            "CamelHttpMethod": "POST",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        URL: "https://ilesbsanity.insurancearticlez.com/cerberus/connect/token"
    }

    return axios.post(projectBaseurl + kycBaseurl, data,)
}

// to generate token for icici kyc
export function iciciKycVerify(token, values) {
    const data = {
        request: {
            "certificate_type": "PAN",
            "correlationId": "UUID",
            "pan_details": {
                "dob": convertDate(values?.kycNomineDob, 3),
                "pan": values?.kycNominePanNumber
            },
            "pep_flag": false
        },
        URL: "https://ilesbsanity.insurancearticlez.com/ilservices/customer/v1/kyc/initiate",
        carrierId: 29,
        headers: {
            "Authorization": "Bearer " + token,
            "CamelHttpMethod": "POST",
            "Content-Type": "application/json"
        }
    }

    return axios.post(projectBaseurl + kycBaseurl, data,)
}


export function iciciKycDocSubmit(token, email, icicidoc) {
    let formData = new FormData();
    formData.append('mobile_number', localStorage.getItem("ownerPhoneNumber"));
    formData.append('email', email);
    formData.append('is_poa_poi_same', false);
    formData.append('poi[0].certificate_type', icicidoc?.poitype);
    formData.append('poi[0].document', icicidoc?.poiFile);
    formData.append('poa[0].certificate', icicidoc?.poatype);
    formData.append('poa[0].document', icicidoc?.poaFile);
    formData.append('CorrelationId', "fda0df66-beaf-4365-9197-1bf4f7cec720");
    formData.append('customer_type', "I");

    console.log("formdata", formData)
    console.log("email", email)
    console.log("icicidoc", icicidoc)


    const data = {
        request: formData,
        URL: "https://ilesbsanity.insurancearticlez.com/ilservices/customer/v1/kyc/ovd",
        headers: {
            "Authorization": "Bearer " + token,
            "CamelHttpMethod": "POST",
            "Content-Type": "application/json"
        }
    }
    const config = {
        headers: { "Authorization": "Bearer " + token, }
    }
    // return axios.post(projectBaseurl + kycBaseurl, data,)
    return axios.post('https://ilesbsanity.insurancearticlez.com/ilservices/customer/v1/kyc/ovd', formData, config)

}