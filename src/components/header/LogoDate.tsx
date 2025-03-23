import React from "react";
import {useAppStore} from "../../store/store";
import {applicationSlice} from "../../store/slices/applicationSlice";


function LogoDate() {

    const appStore = useAppStore();
    const today = applicationSlice.selectors.selectToday(appStore.getState())
    const currentWeekday = applicationSlice.selectors.selectCurrentWeekday(appStore.getState())

    return (
        <div
            className="nav-logo m-0 ms-2 p-0"
            style={{textAlign: "center", width: 'min-content'}}>
            <span style={{fontSize: '14pt'}}>{today}</span>
            <hr className="m-0"/>
            <span>{currentWeekday}</span>
        </div>
    );
}

export default LogoDate;