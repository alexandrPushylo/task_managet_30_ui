import React, {CSSProperties} from 'react';
import {useNavigate} from "react-router";

const cssStyle: CSSProperties = {
    margin: "auto",
}
export default function ConstructionSiteArchivesFooter(){
    const navigate = useNavigate();
    return (
        <div style={cssStyle}>
            <button
                className="btn btn-sm btn-primary me-1"
                type="button"
                onClick={() => {
                    navigate("/construction_sites");
                }}
            >Список объектов
            </button>
        </div>
    );
}
