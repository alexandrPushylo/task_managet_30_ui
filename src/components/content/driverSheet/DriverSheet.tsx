import React from 'react';
import style from "./DriverSheet.module.css";
import {DriverSheetDto, useFetchDriverSheet, useUpdateDriverSheet} from "../../../api/driverSheetApi";
import Loader from "../../loaders/Loader";
import {useFetchDriverList} from "../../../api/usersApi";
import {useAppData} from "../../../api/applicationApi";
import DatePaginator from "../../special/DatePaginator";
import {useAppSelector} from "../../../store/store";
import {applicationSlice} from "../../../store/slices/applicationSlice";

export default function DriverSheet() {
    const TITLE = "Табель: водители";
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {appData} = useAppData({enabled: true, current_day: currentDay});
    const {driverSheets, isLoading} = useFetchDriverSheet(currentDay);

    // if (isLoading) {return <Loader/>}
    const current_date = `${appData?.current_date.day} ${appData?.current_date.month_name}`

    return (<>
            <DatePaginator/>
            <div className={style.Component + " container"}>
                <div>
                    <p className={"m-0 fs-3"}><u>{TITLE}</u></p>
                    <p className={"m-0 ms-2"}>на {current_date}</p>
                </div>
                {driverSheets && <TableDriverSheet driverSheets={driverSheets} view_mode={appData?.view_mode}/>}
            </div>
        </>

    );
}

interface TableDriverSheetProps {
    driverSheets: DriverSheetDto[];
    view_mode?: string;
}

function TableDriverSheet({driverSheets, view_mode}: TableDriverSheetProps) {
    return <table className={"table"}
    >
        <thead>
        <tr>
            <th>Водитель</th>
            <th>Статус</th>
        </tr>
        </thead>
        <TBody driverSheets={driverSheets} view_mode={view_mode} />
    </table>
}

interface TBodyProps{
    driverSheets: DriverSheetDto[];
    view_mode?: string;
}
function TBody({driverSheets, view_mode}: TBodyProps) {
    const {driverList} = useFetchDriverList();


    return <tbody>
        {driverSheets.map((driverSheet, index) => {
            const driver = driverList?.find(i => i.id === driverSheet.driver)
            return <tr key={index}
                       className={driverSheet.status ? style.status_true : style.status_false}
            >
                <td>{driver?.last_name} {driver?.first_name}</td>
                <td className={"form-switch " + style.td_status}>
                    <CheckBoxStatus driverSheetId={driverSheet.id}
                                    status={driverSheet.status}
                                    view_mode={view_mode}/>
                </td>
            </tr>
        })}
    </tbody>
}

interface CheckBoxStatusProps{
    driverSheetId: number;
    status: boolean;
    view_mode?: string;
}
function CheckBoxStatus({status, driverSheetId, view_mode}:CheckBoxStatusProps) {
    const updateDriverSheet  = useUpdateDriverSheet(driverSheetId)
    return <input
        className={"form-check-input"}
        type="checkbox"
        role={"switch"}
        checked={status}
        disabled={view_mode==="view_mode_archive"}
        onChange={(e) => {updateDriverSheet.togglesStatus(status)}}
    />
}