import React, {CSSProperties} from 'react';
import {useNavigate} from "react-router";

const cssStyle: CSSProperties = {
    margin: "auto",
}
export default function CreateAppFooter(){
    const navigate = useNavigate();
    return (
        <div style={cssStyle}>
            <button
                className="btn btn-success"
                type="button"
                onClick={() => {
                    navigate(-1);
                }}
            >Отмена</button>
        </div>
    );
}
