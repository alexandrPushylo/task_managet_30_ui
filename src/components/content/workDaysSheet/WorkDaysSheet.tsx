import React, {useEffect, useState} from 'react';
import {useFetchWorkDaysSheet, useUpdateWorkDay, WorkDaysSheetDto} from "../../../api/workDaySheetApi";
import style from "./WorkDays.module.css";
import {useAppData} from "../../../api/applicationApi";

export default function WorkDaysSheet() {
    const {workDays: workDaysData} = useFetchWorkDaysSheet();
    const {appData} = useAppData();

    const [workDays, setWorkDays] = useState<WorkDaysSheetDto[]>()

    useEffect(() => {
        setWorkDays(workDaysData)
    }, [workDaysData]);

    return (
        <div className={style.Component + " container"}>
            <div><h3><u>Рабочие дни</u></h3></div>
            <table className={"table align-items-center"}>
                <TableHead/>
                {workDays&&
                    <TableBody workDays={workDays} today={appData?.today}/>}
            </table>
        </div>
    );
}

function TableHead() {
    return <thead>
        <tr>
            <th>Дата</th>
            <th>День недель</th>
            <th>Статус</th>
        </tr>
    </thead>
}

interface TableBodyProps{
    workDays: WorkDaysSheetDto[];
    today?: string;
}
function TableBody({workDays, today}: TableBodyProps) {

    return <tbody>
    {workDays.map((workDay, index) => {
        const isCurrentDay = today===workDay.date;
        const isMoreToday = false//today>workDay.date;
        return <tr
            key={index}
            className={isCurrentDay ? style.current_day : ""}
        >
            <td>{workDay.date}</td>
            <td>{workDay.weekday}</td>
            <td className={"form-switch"}>
                <CheckBoxStatus workDayId={workDay.id} status={workDay.status} isMoreToday={isMoreToday}/>
            </td>
        </tr>
    })}
    </tbody>
}

interface CheckBoxStatusProps{
    workDayId: number;
    status: boolean;
    isMoreToday: boolean;
}
function CheckBoxStatus({status, isMoreToday, workDayId}:CheckBoxStatusProps) {
    const updateWorkDaysSheets = useUpdateWorkDay(workDayId);
    return <input
        className={"form-check-input m-1 p-0"}
        type="checkbox"
        role={"switch"}
        checked={status}
        disabled={isMoreToday}
        onChange={(e) => {updateWorkDaysSheets.togglesStatus(status)}}
    />
}