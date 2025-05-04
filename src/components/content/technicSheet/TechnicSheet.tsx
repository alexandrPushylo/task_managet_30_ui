import React from 'react';
import style from "./TechnicSheet.module.css";
import {DriverSheetDto, useFetchDriverSheet, useUpdateDriverSheet} from "../../../api/driverSheetApi";
import Loader from "../../loaders/Loader";
import {useFetchDriverList, UsersDto} from "../../../api/usersApi";
import {useAppData} from "../../../api/applicationApi";
import DatePaginator from "../../special/DatePaginator";
import {useAppSelector} from "../../../store/store";
import {applicationSlice} from "../../../store/slices/applicationSlice";
import {TechnicSheetDto, useFetchTechnicSheet, useUpdateTechnicSheet} from "../../../api/technicSheetApi";
import {TechnicsDto, useFetchTechnics} from "../../../api/technicsApi";

export default function TechnicSheet() {
    const TITLE = "Табель: Техника";
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {appData} = useAppData({enabled: true, current_day: currentDay});
    const {technicSheets, isLoading} = useFetchTechnicSheet(currentDay);
    const {driverSheets} = useFetchDriverSheet(currentDay)
    const {technics: technicList} = useFetchTechnics();
    const {driverList} = useFetchDriverList();

    // if (isLoading) {return <Loader/>}
    const current_date = `${appData?.current_date.day} ${appData?.current_date.month_name}`

    function getDriverSheetId(driverId: string | undefined){
        const drId = driverId ? parseInt(driverId) : undefined;
        const driver_sheet = driverSheets?.find(item => item.driver === drId);
        return String(driver_sheet?.id)
    }


    return (<>
            <DatePaginator/>
            <div className={style.Component + " container"}>
                <div>
                    <p className={"m-0 fs-3"}><u>{TITLE}</u></p>
                    <p className={"m-0 ms-2"}>на {current_date}</p>
                </div>

                {technicSheets &&
                    technicSheets.map((technicSheet: TechnicSheetDto, index: number) => {

                        return <TechnicSheetCard
                            key={index}
                            technicSheet={technicSheet}
                            driverSheets={driverSheets}
                            technicList={technicList}
                            driverList={driverList}
                            view_mode={appData?.view_mode}
                            getDriverSheetId={getDriverSheetId}
                        />
                    })
                }
            </div>
        </>

    );
}

interface TechnicSheetCardProps {
    technicSheet: TechnicSheetDto;
    driverSheets?: DriverSheetDto[];
    technicList?: TechnicsDto[];
    driverList?: UsersDto[];
    view_mode?: string;
    getDriverSheetId: (driverId: string | undefined) => string | undefined;
}

function TechnicSheetCard({technicSheet, technicList, driverList, getDriverSheetId, driverSheets, view_mode}: TechnicSheetCardProps) {

    const technic = technicList?.find(item => item.id === technicSheet.technic);
    const attachedDriver = driverList?.find((d) => d.id === technic?.attached_driver)
    const driverSheet = driverSheets?.find((ds) => ds.id === technicSheet.driver_sheet)
    const updateTechnicSheet = useUpdateTechnicSheet(technicSheet.id)
    const mainStyleClass = technicSheet.status ? style.status_active : style.status_inactive;

    return <div
        className={"card my-2 " + style.Card}
    >
        <div className={"card-header " + mainStyleClass}>
            <span className="fw-bolder">{technic?.title}</span>&nbsp;
            <span className="small">({attachedDriver?.last_name})</span>&nbsp;
            <span className="m-0 fw-bolder small" style={{float: "right"}}>[{technic?.id_information}]</span>
        </div>
        <div className="card-body p-1 row">
            <DriverSelect
                driverId={driverSheet?.driver}
                driverList={driverList}
                driverStatus={driverSheet?.status}
                setDriverSheet={updateTechnicSheet.setDriverSheet}
                getDriverSheetId={getDriverSheetId}
                view_mode={view_mode}
            />
            <SwitchStatus
                status={technicSheet?.status}
                togglesStatus={updateTechnicSheet.togglesStatus}
                view_mode={view_mode}
            />
        </div>
    </div>
}

interface DriverSelectProps{
    driverList?: UsersDto[];
    driverId?: number;
    driverStatus?: boolean;
    setDriverSheet: (driverSheetId: string | undefined) => void;
    getDriverSheetId: (driverId: string | undefined) => string | undefined;
    view_mode?: string;
}
function DriverSelect({driverList, driverId, setDriverSheet, getDriverSheetId, view_mode, driverStatus}: DriverSelectProps) {
    const styleStatusClass = driverStatus ? "border border-success" : "border border-danger"

    return <div className="col-auto ms-2">
        <select className={"form-control p-1" + styleStatusClass}
                disabled={view_mode==="view_mode_archive"}
                onChange={(e) => {
                    setDriverSheet(getDriverSheetId(e.target.value))
                }}
        >
            <option value={undefined} selected={!driverId}></option>
            {driverList?.map((driver: UsersDto, index: number) => {
                return <option
                    key={index}
                    value={driver.id}
                    selected={driver.id === driverId}
                >{driver.last_name} {driver.first_name}</option>
            })}

        </select>
    </div>
}

interface SwitchStatusProps{
    status: boolean
    togglesStatus: (status: boolean) => void
    view_mode?: string;
}
function SwitchStatus({status, togglesStatus, view_mode}: SwitchStatusProps) {
    return <div className="form-switch col" style={{textAlign: "right"}}>
        <input
            type="checkbox"
            role="switch"
            className="form-check-input m-2"
            checked={status}
            onChange={() => {togglesStatus(status)}}
            disabled={view_mode==="view_mode_archive"}
        />
    </div>
}