import React, {useEffect, useState} from "react";

function LogoDate() {
    const [logoDate, setLogoDate] = useState({
        date: 0,
        weekday: ''
    })
    useEffect(()=>{
        setLogoDate({date : 15, weekday : 'Monday'})
    },[]);

    return (
        <div
            className="nav-logo m-0 ms-2 p-0"
            style={{textAlign: "center", width: 'min-content'}}>
            <span style={{fontSize: '14pt'}}>{logoDate.date}</span>
            <hr className="m-0"/>
            <span>{logoDate.weekday}</span>
        </div>
    );
}

export default LogoDate;