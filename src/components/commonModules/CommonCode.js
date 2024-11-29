

// to chnage formik visibilility to hide error
export const formikFieldVisibility = (fields, formik) => {

    fields?.map(data => {
        return formik?.setFieldTouched(data, false)
    })
}

export const convertDate = (incomingDate, type) => {
    let splitDate
    let newDate
    if (type === 1) {
        splitDate = incomingDate?.split("-")
        newDate = splitDate?.[2] + "/" + splitDate?.[1] + "/" + splitDate?.[0]
    }
    else if (type === 2) {
        splitDate = incomingDate?.split("/")
        newDate = splitDate?.[2] + "-" + splitDate?.[1] + "-" + splitDate?.[0]
    }
    else if (type === 3) {
        splitDate = incomingDate?.split("-")
        newDate = splitDate?.[2] + "-" + splitDate?.[1] + "-" + splitDate?.[0]
    }
    else if (type === 4) {
        splitDate = incomingDate?.split("/")
        newDate = splitDate?.[0] + "-" + splitDate?.[1] + "-" + splitDate?.[2]
    }
       return newDate
}

export const gateage = (incomingDate) => {
    return Math.floor((new Date() - new Date(incomingDate).getTime()) / 3.15576e+10)

}
// only accept number for mobile no
export const numCheck = (e, id) => {
    const characters = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', ')', '(', '-', '=', '_', '+',
        '>', '<', '?', '/', ':', ';', '|', '\\', ']', '}', '[', '{', "'", '"', ' '
    ];
    // eslint-disable-next-line eqeqeq

    if (e.key == ".") e.preventDefault();
    if (characters.includes(e.key)) e.preventDefault();
}

//validation for car, bike, quote, praposal pages for date of birth and date of registration 
export const yearValidation = (value, years) => {
    const currentDate = new Date();
    const inputDate = new Date(value);
    const differenceInYears = currentDate.getFullYear() - inputDate.getFullYear();

    return differenceInYears <= years;
};

//  for exp-date validation on bike and car pages
export const expDateValidation = () => {
    var today = new Date();
    var priorDate = new Date(new Date().setDate(today.getDate() - 90));
    var priorDatePlus = new Date(new Date().setDate(today.getDate() - 91));
    var priorDateSub = new Date(new Date().setDate(today.getDate() - 89));

    const priorDateConvertedValue = DateConvertFunction(priorDate, 13)
    const priorDatePlusConvertedValue = DateConvertFunction(priorDatePlus, 13)
    const priorDateSubConvertedValue = DateConvertFunction(priorDateSub, 13)
    const todayConvertedValue = DateConvertFunction(today, 13)
    let optionsArray = [
        { value: DateConvertFunction(priorDatePlus, 13), label: `Expired on or before ${DateConvertFunction(priorDate, 14)} ` },
        { value: DateConvertFunction(priorDateSub, 13), label: `Expired after ${DateConvertFunction(priorDate, 14)}` },
        // { value: "notexpired", label: "Not yet expired" },]
        { value: todayConvertedValue, label: "Not yet expired" },]


    return { priorDate, priorDatePlus, priorDateSub, today, optionsArray, todayConvertedValue }

    // return { priorDateConvertedValue, priorDatePlusConvertedValue, priorDateSubConvertedValue, optionsArray }
}

// convert date function
export function DateConvertFunction(data, type) {

    const convertedDate = new Date(data)
    let dayWithPrefix = ("0" + convertedDate.getDate()).slice(-2)
    let monthWithPrefix = ("0" + (convertedDate.getMonth() + 1)).slice(-2)
    let yearFull = convertedDate.getFullYear()
    const monthlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthlistFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // time
    let hours =
        convertedDate.getHours() > 12
            ? convertedDate.getHours() - 12
            : convertedDate.getHours()
    let am_pm = convertedDate.getHours() >= 12 ? "PM" : "AM"
    let minutes =
        convertedDate.getMinutes() < 10
            ? "0" + convertedDate.getMinutes()
            : convertedDate.getMinutes()

    let hrs = hours === 0 ? 12 : hours
    let time = hrs + ":" + minutes + " " + am_pm

    if (type === 1) {
        return time
    }
    if (type === 2) {
        return dayWithPrefix + "-" + monthWithPrefix + "-" + yearFull
    }
    if (type === 3) {
        return dayWithPrefix + "-" + monthWithPrefix + "-" + yearFull + "  |" + time
    }
    if (type === 4) {
        return monthlist[convertedDate.getMonth()] + " " + dayWithPrefix + ", " + yearFull
    }
    if (type === 5) {
        return monthlist[convertedDate.getMonth()] + " " + dayWithPrefix + ", " + yearFull + "  |" + time
    }
    if (type === 6) {
        return weekday[convertedDate.getDay()] + ", " + dayWithPrefix + " " + monthlist[convertedDate.getMonth()] + " " + yearFull + ", " + time
    }
    if (type === 7) {
        return dayWithPrefix + " " + monthlist[convertedDate.getMonth()]
    }
    if (type === 8) {
        let hrs = hours === 0 ? 12 : hours
        let conv_time = hrs + ":" + minutes + " " + am_pm
        return monthlist[convertedDate.getMonth()] + " " + dayWithPrefix + ", " + yearFull + "  |" + conv_time
    }
    if (type === 9) {
        let hrs = hours === 0 ? 12 : hours
        let seconds = ("0" + convertedDate.getSeconds()).slice(-2)

        return dayWithPrefix + "/" + monthlist[convertedDate.getMonth()] + "/" + yearFull + " " + ("0" + hrs).slice(-2) + ":" + minutes + ":" + seconds + " " + am_pm
    }
    if (type === 10) {
        return convertedDate
    }
    if (type === 11) {

        let incomingdate = data.split("-")
        const monthNameFull = monthlistFull[Number(incomingdate[1]) - 1]
        let dayname = incomingdate[2]
        let yearnmae = incomingdate[0]
        let formatedate = monthNameFull + " " + dayname + "," + yearnmae
        let dateToshow = new Date(formatedate);
        return monthlist[dateToshow.getMonth()] + " " + dateToshow.getDate() + ", " + dateToshow.getFullYear()
    }
    if (type === 12) {
        return yearFull + "-" + monthWithPrefix + "-" + dayWithPrefix
    }
    if (type === 13) {
        return dayWithPrefix + "/" + monthWithPrefix + "/" + yearFull
    }
    if (type === 14) {
        return dayWithPrefix + "-" + monthlist[convertedDate.getMonth()] + "-" + yearFull
    }

}


//  for exp-date validation on bike and car pages

export const dateCompare = (start, end, regDate, type) => {
    const registrationDate = new Date(regDate);
    const startDate = new Date(start);
    const currentDate = new Date()
    const endDate = new Date(end);
    const properDates = (startDate < endDate)
    const dateValid = (start && end)
    const dateshouldGreaterThanReg = startDate >= registrationDate
    const validRegYear = regDate
    const isFutureDate = currentDate < startDate
    const policyEndAge = registrationDate > endDate
    const isvalidEndDate=currentDate<endDate
    var ageDifMs = endDate - startDate
    var ageDate = new Date(ageDifMs)
    const policyStartAge = Math.abs(ageDate.getUTCFullYear() - 1970) < (type === "bike" ? 5 : 3)
    return { properDates, dateValid, isFutureDate, policyStartAge, policyEndAge, dateshouldGreaterThanReg, validRegYear,isvalidEndDate }
}


export const sortDropdownOptions = (options) => {
    const sortedOptions = options?.sort((a, b) => { return a.insurerName - b?.insurerName });
    // Remove the "Please select" label from the sorted options
    const filteredOptions = sortedOptions?.filter(option => option.insurerName !== "Please select");
    const destructureArray = filteredOptions?.map(resp => {
        return { value: resp?.insurerId, label: resp?.insurerName }
    })

    // Add the "Please select" label back at the beginning
    if (destructureArray) {
        return [{ value: "", label: "Please select" }, ...destructureArray];
    } else {
        return [{ value: "", label: "Please select" }];

     }
};

export const getYearDropdown = (toatlYearBack = 1,) => {
    const currentDate = (new Date())
    const year = currentDate.getFullYear() - toatlYearBack;
    let day = ("0" + (currentDate.getDate())).slice(-2)
    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2)
    const years = Array.from(new Array(toatlYearBack + 1), (val, index) => index + year);
    const nestaedData = years?.map((data) => {
        return { value: data + "-" + month + "-" + day, label: data }
    })
    nestaedData.reverse().unshift({ data: "", label: "Please select" })
    return nestaedData

}


export const bikeFormikIntialData = {
    insuranceFor: "renew",
    registeredRto: "",
    make: "",
    model: "",
    varient: "",
    registrationYear: "",
    fuel: "petrol",
    previousPolicy: expDateValidation()?.todayConvertedValue,
    insuranceClaim: "false",
    tpPolicyStartDate: "",
    tpPolicyEndtDate: "",
    noClaimBonus: "0",
    currentStepIndex: "0",
    policyType: "",
    policyTerms: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    isvehNumberMissing: true,
    isTextVisible: "",
    formtype: "bike",
    addOnCover: [],

};

export const initialDataQuotesPage = {
    registeredRto: "",
    make: "",
    model: "",
    varient: "",
    registrationYear: "",
    fuel: "petrol",
    expiryDate: "",
    insuranceClaim: "",
    noClaimBonus: "",
    policyType: "",
    policyTerms: "",
    idv: "",
    vehicalRegType: "individual",
    zeroDep: "",
    personalCover: 50000,
    personalCoverFlag: "",
    personalAccidentCover: false,

    driverAccidentCover: "",
    driverAccidentCoverAmount: 10000,
    lpgCngKit: "",
    lpgCngKitAmount: "",
    accessories: "",
    electricalAccessories: "",
    electricalAccessoriesAmount: "",
    nonElectricalAccessories: "",
    nonElectricalAccessoriesAmount: "",
    roadSideAssistance: "",


    ncbProtection: "",
    engineProtector: "",
    tyreProtection: "",
    tyreDetails: "",
    tyreProtectionAmount: "",
    keyProtection: "",
    consumablesCover: "",
    baggageCover: "",
    invoiceCover: "",
    transportHotelExpenses: "",
    transportHotelExpensesAmount: "",
    addOnCover: [],
    tpPolicyStartDate: "",
    tpPolicyEndtDate: "",
    insuranceFor: "",
    isvehNumberMissing: true,
    idvSelectedValue: "",
    formtype: ""
};