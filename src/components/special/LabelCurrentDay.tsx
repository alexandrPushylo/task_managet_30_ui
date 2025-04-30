import React from 'react';
import {ICurrentDate} from "../../api/applicationApi";

interface LabelCurrentDayProps {
    current_date: ICurrentDate
}
export default function LabelCurrentDay({current_date}: LabelCurrentDayProps) {
    return <div
        style={{textAlign: 'center'}}
        className="fs-5 mb-3"
    >
        <span className="fw-bolder">{current_date?.weekday}, </span>
        <span>{current_date?.day} {current_date?.month_name}</span>
    </div>

}
