import React from 'react';
import {ConstructionSiteDto} from "../../../api/constructionSiteApi";
import style from "./ConstrSiteItem.module.css";
import {AppTodayStatus} from "../../../assets/assets";
import {ApplicationTodayDto} from "../../../api/ApplicationTodayApi";
import {appDataDto, currentUserDto} from "../../../api/applicationApi";
import {UsersDto} from "../../../api/usersApi";
import {ApplicationTechnicDto} from "../../../api/applicationTechnicApi";
import {TechnicsDto} from "../../../api/technicsApi";
import {ConflictIdListDto, PriorityIdListDto, TechnicSheetDto} from "../../../api/technicSheetApi";
import {DriverSheetDto} from "../../../api/driverSheetApi";
import {ApplicationMaterialDto} from "../../../api/applicationMaterialApi";
import {useTextareaAutosize} from "../../../assets/services";
import {useNavigate} from "react-router";


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
    return <>
        <span className="small m-0">Прораб:</span>&nbsp;
        <span className="fw-bolder">{foreman?.last_name}</span>&nbsp;
        <span className="fw-bolder">{foreman?.first_name}</span>
    </>

}

function getTechnicTitle(appTechnic: ApplicationTechnicDto, techSheet?: TechnicSheetDto, technic?: TechnicsDto, conflictIdList?: ConflictIdListDto) {
    if (appTechnic.isChecked) {
        return <span className={style.AP_isChecked_title}><small>(<i
            className="fa-solid fa-check"></i>)</small> {technic?.title}</span>
    } else if (appTechnic.is_cancelled) {
        return <span className={style.AP_cancelled_title}><small>(<i
            className="fa-solid fa-xmark"></i>)</small> {technic?.title}</span>
    } else if (techSheet?.id && (conflictIdList?.conflict_technic_sheet.includes(techSheet.id))) {
        return <span className={style.AP_conflict_title}> {technic?.title}</span>
    } else if (!techSheet?.status) {
        return <span className={style.AP_not_work_title}> {technic?.title}</span>
    } else {
        return <span style={{color: "black"}}> {technic?.title}</span>
    }
}

function getDriverTitle(appTechnic: ApplicationTechnicDto, techSheet?: TechnicSheetDto, driver?: UsersDto, priorityIdList?: PriorityIdListDto) {
    if (appTechnic.isChecked) {
        return <span className={style.AP_isChecked_title}> ({driver?.last_name})</span>
    } else if (appTechnic.is_cancelled) {
        return <span className={style.AP_cancelled_title}> ({driver?.last_name})</span>
    } else if (techSheet?.id && (priorityIdList?.priority_id_list.includes(techSheet.id))) {
        return <span className={style.AP_priority_title}> ({driver?.last_name})</span>
    } else {
        return <span style={{color: "black"}}> ({driver?.last_name})</span>
    }
}


interface CsItemProps {
    currentUser?: currentUserDto;
    constrSiteItem: ConstructionSiteDto;
    appsToday?: ApplicationTodayDto[];
    appData?: appDataDto;
    foremanList?: UsersDto[];
    appTechnics?: ApplicationTechnicDto[];
    appMaterials?: ApplicationMaterialDto[];
    technics?: TechnicsDto[];
    technicSheets?: TechnicSheetDto[];
    driverSheets?: DriverSheetDto[];
    driverList?: UsersDto[];
    conflictIdList?: ConflictIdListDto;
    priorityIdList?: PriorityIdListDto;
}

export default function ConstrSiteItem(
    {
        currentUser,
        constrSiteItem,
        appsToday,
        appData,
        foremanList,
        appTechnics,
        appMaterials,
        technics,
        technicSheets,
        driverSheets,
        driverList,
        conflictIdList,
        priorityIdList
    }: CsItemProps
) {

    const appToday = appsToday?.find(item => item.construction_site === constrSiteItem.id);
    const foreman = foremanList?.find(item => item.id === constrSiteItem.foreman);
    const appTechnic = appTechnics?.filter(item => item.application_today === appToday?.id);
    const appMaterial = appMaterials?.filter(item => item.application_today === appToday?.id);

    const appTodayStatusColor = appToday?.status && appToday?.status !== 'approved' ? {color: 'black'} : {};

    const FONT_SIZE = currentUser?.font_size + "pt";
    const isShowAbsentApp = currentUser?.is_show_absent_app;
    const isShowSavedApp = currentUser?.is_show_saved_app;

    useTextareaAutosize();

    if (!isShowAbsentApp && (appToday?.status === 'absent' || appToday?.status === undefined)) {
        return <></>
    }
    if (!isShowSavedApp && appToday?.status === 'saved') {
        return <></>
    }

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
                        style={{textAlign: "center", color: currentUser?.color_title}}
                    >{constrSiteItem?.address}</p>
                    <p className="m-0 ms-2" style={{textAlign: 'center', ...appTodayStatusColor}}
                    >
                        <span className="fw-bolder">{appData?.current_date?.weekday},</span>&nbsp;
                        <span>{appData?.current_date?.day} {appData?.current_date?.month_name}</span>
                    </p>
                    {constrSiteItem.foreman &&
                        <p
                            className="card-title p-0 m-0 ms-2"
                            style={{textAlign: 'center', ...appTodayStatusColor}}>
                            {getForemanTitle(foreman)}
                        </p>
                    }
                    <hr className="m-0"/>
                    {appToday?.description &&
                        <AppDescription description={appToday?.description} fontSize={FONT_SIZE}/>}

                    {appToday &&
                        <div className="card-text">
                            {(appTechnic && currentUser?.is_show_technic_app) &&
                                <div className="mt-1">
                                    {appTechnic.map((AT, index) => {
                                        const techSheet = technicSheets?.find(item => item.id === AT.technic_sheet);
                                        const driverSheet = driverSheets?.find(item => item.id === techSheet?.driver_sheet);
                                        const driver = driverList?.find(item => item.id === driverSheet?.driver);
                                        const technic = technics?.find(item => item.id === techSheet?.technic);
                                        return <AppTechnic
                                            appTechnic={AT}
                                            key={index}
                                            techSheet={techSheet}
                                            driverSheet={driverSheet}
                                            technic={technic}
                                            driver={driver}
                                            priorityIdList={priorityIdList}
                                            conflictIdList={conflictIdList}
                                            fontSize={FONT_SIZE}

                                        />
                                    })}
                                </div>
                            }
                            {(appMaterial && currentUser?.is_show_material_app) &&
                                appMaterial.map((AM, index) => {
                                    return <AppMaterial
                                        key={index}
                                        appMaterial={AM}
                                        fontSize={FONT_SIZE}
                                    />
                                })
                            }
                        </div>
                    }

                </div>

                {appData?.view_mode !== 'view_mode_archive' &&
                    <CardFooter
                        appToday={appToday}
                        constrSiteItem={constrSiteItem}
                        appData={appData}
                    />
                }

            </div>
        </div>
    </div>

}

//  ============================================================================

interface AppDescriptionProps {
    description?: string,
    fontSize?: string
}

function AppDescription({description, fontSize}: AppDescriptionProps) {
    return <div
        className="mt-1"
    >
        <label className="w-100">
            <p className="fw-bolder small m-0" style={{textAlign: 'center', color: "black"}}>Примечание к объекту:</p>
            <textarea
                readOnly={true}
                className={"form-control border border-0 " + style.app_description}
                style={{fontSize: fontSize}}
                value={description}
            ></textarea>
        </label>

    </div>
}

interface AppTechnicDescriptionProps {
    description?: string;
    is_cancelled: boolean;
    isChecked: boolean;
    fontSize?: string
}

function AppTechnicDescription({description, is_cancelled, isChecked, fontSize}: AppTechnicDescriptionProps) {
    const statusStyle = is_cancelled ? style.AP_cancelled_title : isChecked ? style.AP_isChecked_title : ""


    return <label
        className="m-0 p-0 row"
    >
        <textarea
            readOnly={true}
            className={"form-control border  " + style.app_description + ' ' + statusStyle}
            style={{fontSize: fontSize}}
            value={description}
        ></textarea>
    </label>
}

interface AppTechnicProps {
    appTechnic: ApplicationTechnicDto;
    techSheet?: TechnicSheetDto;
    driverSheet?: DriverSheetDto;
    technic?: TechnicsDto;
    driver?: UsersDto;
    conflictIdList?: ConflictIdListDto;
    priorityIdList?: PriorityIdListDto;
    fontSize?: string
}

function AppTechnic({
                        appTechnic,
                        techSheet,
                        driverSheet,
                        technic,
                        driver,
                        conflictIdList,
                        priorityIdList,
                        fontSize
                    }: AppTechnicProps) {
    return <div
        className="mt-2"
        style={{backgroundColor: "#e7eefa", textAlign: 'center'}}
    >
        {getTechnicTitle(appTechnic, techSheet, technic, conflictIdList)}
        {driverSheet?.status ?
            <span
                onClick={() => alert(`go to ${driver?.id}`)}
            >{getDriverTitle(appTechnic, techSheet, driver, priorityIdList)}
                <span style={{color: "black"}}> [{appTechnic.priority}/{techSheet?.count_application}]</span>
            </span> :
            <span className={style.AP_empty_title}>(Не назначен)</span>
        }
        {appTechnic.description && <AppTechnicDescription
            description={appTechnic.description}
            is_cancelled={appTechnic.is_cancelled}
            isChecked={appTechnic.isChecked}
            fontSize={fontSize}
        />}
    </div>
}

interface AppMaterialProps {
    appMaterial: ApplicationMaterialDto
    fontSize?: string
}

function AppMaterial({appMaterial, fontSize}: AppMaterialProps) {
    const appStatusStyle = appMaterial.isChecked ? {fontSize: 'small', color: "green"} : {
        fontSize: 'small',
        color: "red"
    }
    const appStatusTitle = appMaterial.isChecked ? "Подтверждено" : "Не подтверждено"
    const appStatusBorder = appMaterial.isChecked ? " border-success " : "border-danger"
    return <div className="m-0 p-1">
        <span
            className="small fw-bold"
            style={{color: 'black'}}
        >Список материалов: </span>
        <span style={appStatusStyle}>{appStatusTitle}</span>
        <textarea
            className={"form-control border border-1 " + style.app_description + ' ' + appStatusBorder}
            readOnly={true}
            value={appMaterial.description}
            style={{fontSize: fontSize}}
        ></textarea>
    </div>
}

//  ============================================================================

interface CardFooterProps {
    appToday?: ApplicationTodayDto;
    appData?: appDataDto;
    constrSiteItem?: ConstructionSiteDto;
}
function CardFooter({appToday, appData, constrSiteItem}: CardFooterProps) {
    return <div
    >
        <hr className="m-0 p-0"/>
        <div className="card-body p-0">
            <div className="my-2 px-2" style={{textAlign: "center"}}>
                {appToday ? <div>
                    {appToday.status === 'saved' ?
                        <p className="m-0 fw-bolder text-warning">Ожидание подачи заявки</p> :
                        <div>
                            <BtnDelete appTodayId={appToday.id}/>
                            <BtnEdit appTodayId={appToday.id}/>
                        </div>
                    }
                    {appToday.status === 'submitted' && <BtnApprove appTodayId={appToday.id}/>}
                    {appToday.status === 'approved' && <BtnSend appTodayId={appToday.id}/>}
                </div>:
                    <div className="row m-0 p-0"><BtnCreate constrSiteId={constrSiteItem?.id} appData={appData}/></div>

                }

            </div>
        </div>
    </div>
}

interface BtnProps {
    appTodayId?: number;
    appData?: appDataDto;
    constrSiteId?: number;
}
function BtnDelete({appTodayId}: BtnProps) {
    const navigate = useNavigate();
    return <button
        type="button"
        className="btn btn-outline-danger mx-1"
        onClick={() => alert(`delete ${appTodayId}`)}
    ><i className="fa-solid fa-trash"></i></button>
}
function BtnEdit({appTodayId,constrSiteId}: BtnProps) {
    const navigate = useNavigate();
    return <button
        type="button"
        className="btn btn-outline-primary px-5 mx-1"
        // onClick={() => alert(`edit ${appTodayId}`)}
        onClick={()=>navigate(`/create_app/${constrSiteId}`)}
    ><i className="fa-regular fa-pen-to-square"></i></button>
}
function BtnCreate({constrSiteId, appData}: BtnProps) {
    const navigate = useNavigate();
    return <button
        type="button"
        className="btn btn-outline-primary"
        onClick={()=>navigate(`/create_app/${constrSiteId}`)}
    ><i className="fa-solid fa-plus"></i></button>
}
function BtnApprove({appTodayId}: BtnProps) {
    const navigate = useNavigate();
    return <button
        type="button"
        className="btn btn-outline-success px-5 mx-1"
        onClick={() => alert(`approveStatus ${appTodayId}`)}
    ><i className="fa-solid fa-check"></i></button>
}
function BtnSend({appTodayId}: BtnProps) {
    const navigate = useNavigate();
    return <button
        type="button"
        className="btn btn-outline-info px-5 mx-1"
        onClick={() => alert(`sendStatus ${appTodayId}`)}
    ><i className="fa-solid fa-paper-plane"></i></button>
}

