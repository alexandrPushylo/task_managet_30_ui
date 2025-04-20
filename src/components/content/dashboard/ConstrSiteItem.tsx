import React from 'react';
import {ConstructionSiteDto} from "../../../api/constructionSiteApi";
import style from "./ConstrSiteItem.module.css";
import {AppTodayStatus} from "../../../assets/assets";
import {ApplicationTodayDto, useFetchApplicationsToday} from "../../../api/ApplicationTodayApi";
import {appDataDto} from "../../../api/applicationApi";
import {UsersDto} from "../../../api/usersApi";


const FONT_SIZE = '10pt';


function getBorderStyle(appStatus?: AppTodayStatus) {
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
function getStatusStyle(appStatus?: AppTodayStatus) {
    switch (appStatus) {
        case "absent":
            return <p className={"p-0 " + style.app_status}>Заявка отсутствует</p>;
        case "saved":
            return <p className={"p-0 text-warning " + style.app_status}>Заявка сохранена</p>;
        case "submitted":
            return <p className={"p-0 text-primary " + style.app_status}>Заявка подана</p>;
        case "approved":
            return <p className={"p-0 text-success " + style.app_status}>Заявка одобрена</p>;
        case "send":
            return <p className={"p-0 text-info fw-bold " + style.app_status}>Заявка отправлена</p>;
        default:
            return <p className={"p-0 " + style.app_status}>Заявка отсутствует</p>;
    }
}
function getForemanTitle(foreman?: UsersDto) {
    return <p className="card-title p-0 m-0 ms-2" style={{textAlign: 'center'}}>
        <span className="small m-0">Прораб:</span>&nbsp;
        <span className="fw-bolder">{foreman?.last_name}</span>&nbsp;
        <span className="fw-bolder">{foreman?.first_name}</span>
    </p>

}

interface CsItemProps {
    constrSiteItem: ConstructionSiteDto
    appsToday?: ApplicationTodayDto[]
    appData?: appDataDto
    foremanList?: UsersDto[]
}

export default function ConstrSiteItem({constrSiteItem, appsToday, appData, foremanList}: CsItemProps) {

    const appToday = appsToday?.find(item => item.construction_site === constrSiteItem.id)
    const foreman = foremanList?.find(item => item.id === constrSiteItem.foreman)


    return <div
        className={"bg-transparent " + style.Component}
    >
        <div
            className={"border border-3 " + style.item_border + ' ' + getBorderStyle(appToday?.status)}
        >
            <div className={"card m-1 " + style.if_not_appT}>
                <div className="card-header p-0">
                    {getStatusStyle(appToday?.status)}
                    <p
                        className="card-title fw-bolder p-0 m-0 text-uppercase"
                        style={{textAlign: "center", color: "black"}}
                    >{constrSiteItem?.address}</p>
                    <p className="m-0 ms-2" style={{textAlign: 'center'}}
                    >
                        <span className="fw-bolder">{appData?.current_date.weekday},</span>&nbsp;
                        <span>{appData?.current_date.day} {appData?.current_date.month_name}</span>
                    </p>
                    {constrSiteItem.foreman && getForemanTitle(foreman)}
                    <hr className="m-0"/>
                    {appToday?.description && <AppDescription description={appToday?.description} />}
                </div>
            </div>
        </div>
    </div>

}

//  ============================================================================

interface AppDescriptionProps{
    description?: string
}
function AppDescription({description}:AppDescriptionProps) {
    return <div
        className="mt-1"
    >
        <label className="w-100">
            <p className="fw-bolder small m-0" style={{textAlign:'center'}}>Примечание к объекту:</p>
            <textarea
                readOnly={true}
                className={"form-control border border-0 " + style.app_description}
                style={{fontSize: FONT_SIZE}}
            >{description}</textarea>
        </label>

    </div>
}