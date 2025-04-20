import React from 'react';
import {ConstructionSiteDto} from "../../../api/constructionSiteApi";
import style from "./ConstrSiteItem.module.css";
import {AppTodayStatus} from "../../../assets/assets";


function getBorderStyle(appStatus: AppTodayStatus) {
    switch (appStatus) {
        case "absent":
            return "";
        case "saved":
            return "border-warning";
        case "submitted":
            return "border-primary";
        case "approved":
            return "border-success";
        case "send":
            return "";
        default:
            return "";
    }
}

interface CsItemProps {
    constrSiteItem: ConstructionSiteDto
}

export default function ConstrSiteItem({constrSiteItem}: CsItemProps) {
    return <div
        className={"bg-transparent " + style.Component}
    >
        <div
            className={"border border-3 " + style.item_border + ' ' + getBorderStyle("absent")}
        >

        </div>
    </div>

}
