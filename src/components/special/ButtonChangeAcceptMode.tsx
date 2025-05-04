import React from 'react';
import {useUpdateAppData} from "../../api/applicationApi";

interface Props {
    acceptMode?: boolean;
    currentDay?: string;
}
export default function ButtonChangeAcceptMode({acceptMode, currentDay}: Props): React.ReactElement {
    const {setAcceptMode} = useUpdateAppData(currentDay)
    return (
        acceptMode ?
            <button
                type="button"
                onClick={()=>setAcceptMode(acceptMode)}
                className="btn btn-sm btn-outline-danger"
            ><i className="fa-solid fa-lock"></i></button> :
            <button
                type="button"
                onClick={()=>setAcceptMode(acceptMode)}
                className="btn btn-sm btn-outline-success"
            ><i className="fa-solid fa-lock-open"></i></button>
    )

}
