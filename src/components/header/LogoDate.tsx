import React from "react";
import {useAppSelector, useAppStore} from "../../store/store";
import {applicationSlice} from "../../store/slices/applicationSlice";
import {useAppData} from "../../api/applicationApi";


function LogoDate() {
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {appData} = useAppData({current_day: currentDay??''});


    return (
        <div
            className="nav-logo m-0 ms-2 p-0"
            style={{textAlign: "center", width: 'min-content'}}>
            <span style={{fontSize: '14pt'}}>{appData?.today?.day}</span>
            <hr className="m-0"/>
            <span>{appData?.today?.weekday}</span>
        </div>
    );
}

export default LogoDate;