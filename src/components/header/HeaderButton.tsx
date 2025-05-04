import React, {useEffect, useState} from 'react';
import {EBtnColorClass, EHeaderButtonContext} from "../../assets/assets";
import {NavLink} from "react-router";
import {useFetchConflictIdList} from "../../api/technicSheetApi";
import {useAppSelector} from "../../store/store";
import {applicationSlice} from "../../store/slices/applicationSlice";
import {useFetchStatusListAppToday} from "../../api/applicationTodayApi";
import {useAppData, useCurrentUser} from "../../api/applicationApi";


export default function HeaderButton() {
    const {currentUser} = useCurrentUser();

    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {appData} = useAppData({current_day: currentDay});

    const {conflictIdList} = useFetchConflictIdList(currentDay);
    const {statusList} = useFetchStatusListAppToday(currentDay);

    
    const post = currentUser?.post ?? 'employee';
    

    const isExistsConflicts = conflictIdList && conflictIdList.conflict_technic_sheet.length > 0;
    // const isExistsAbsent = statusList && statusList.status_list_application_today.absent.length > 0;
    const isExistsSaved = statusList && statusList.status_list_application_today.saved.length > 0;
    const isExistsSubmitted = statusList && statusList.status_list_application_today.submitted.length > 0;
    const isExistsApproved = statusList && statusList.status_list_application_today.approved.length > 0;
    const isExistsSend = statusList && statusList.status_list_application_today.send.length > 0;


    const [btnContent, setBtnContent] = useState<EHeaderButtonContext>(EHeaderButtonContext.goToMain);
    const [btnColor, setBtnColor] = useState<EBtnColorClass>(EBtnColorClass.goToMain);

    useEffect(() => {
        if (!appData?.view_mode && appData?.view_mode !== 'view_mode_archive') {
            if (isExistsConflicts && post === 'administrator') setBtnContent(EHeaderButtonContext.existConflicts);
            else if (isExistsSaved && !appData?.accept_mode && "foreman master supply".includes(post)) setBtnContent(EHeaderButtonContext.submitAll);
            else if (isExistsSubmitted && post === 'administrator') setBtnContent(EHeaderButtonContext.approveAll);
            else if (isExistsApproved && post === 'administrator') setBtnContent(EHeaderButtonContext.sendAll);
            else if (isExistsSend && post === 'administrator') setBtnContent(EHeaderButtonContext.reSendAll);
        } else setBtnContent(EHeaderButtonContext.goToMain);
    }, [appData?.accept_mode, appData?.view_mode, isExistsApproved, isExistsConflicts, isExistsSaved, isExistsSend, isExistsSubmitted, post]);



    useEffect(() => {
        switch (btnContent) {
            case EHeaderButtonContext.goToMain:
                setBtnColor(EBtnColorClass.goToMain)
                return;
            case EHeaderButtonContext.existConflicts:
                setBtnColor(EBtnColorClass.existConflicts)
                return;
            case EHeaderButtonContext.submitAll:
                setBtnColor(EBtnColorClass.submitAll)
                return;
            case EHeaderButtonContext.approveAll:
                setBtnColor(EBtnColorClass.approveAll)
                return;
            case EHeaderButtonContext.sendAll:
                setBtnColor(EBtnColorClass.sendAll)
                return;
            case EHeaderButtonContext.reSendAll:
                setBtnColor(EBtnColorClass.reSendAll)
                return;
            default:
                setBtnColor(EBtnColorClass.goToMain);
                return;
        }
    }, [btnContent]);


    return (
        <div>
            <NavLink to="/dashboard"
                     className={'btn ' + btnColor}
            >{btnContent}</NavLink>
        </div>
    );
}
