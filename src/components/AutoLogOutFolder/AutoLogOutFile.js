import React from "react";
import { useHistory } from "react-router-dom";
import IdleTimer from "react-idle-timer";
import UseFormContext from "../../context/UseFormContext";


const AutoLogOut = () => {
    const history = useHistory();
    const formContext = UseFormContext();
    const onActive = () => {
    };
    // when IDLE time starts
    const onIdle = () => {
        localStorage.clear()
        sessionStorage.clear()
        formContext.seterrorPopUp(true)
        history.push('/')

    };

    return (
        <>
            {/* to find out IDLE TIME of system */}
            <IdleTimer
                onActive={onActive}
                onIdle={onIdle}
                debounce={250}
                timeout={1800000} // 20 mins=1200000 
            />
        </>
    );
}
export default AutoLogOut;