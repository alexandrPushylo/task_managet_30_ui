import React, {useEffect, useState} from 'react';
import {EBtnColorClass, EHeaderButtonContext} from "../../assets/assets";
import {NavLink} from "react-router";


function HeaderButton() {
    const [btnContent, setBtnContent] = useState<EHeaderButtonContext>(EHeaderButtonContext.goToMain);
    const [btnColor, setBtnColor] = useState<EBtnColorClass>(EBtnColorClass.goToMain);


    useEffect(() => {
        setBtnContent(EHeaderButtonContext.goToMain)
    },[])

    useEffect(() => {
        switch (btnContent){
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
            <NavLink to="/dashboard/"
                className={'btn '+ btnColor}
            >{btnContent}</NavLink>
        </div>
    );
}

export default HeaderButton;