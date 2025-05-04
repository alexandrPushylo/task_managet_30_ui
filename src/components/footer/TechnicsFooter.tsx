import React, {CSSProperties} from 'react';
import {useNavigate} from "react-router";

const cssStyle: CSSProperties = {
    margin: "auto",
}

function TechnicsFooter() {
    const navigate = useNavigate();
    return (
        <div style={cssStyle}>
            <button
                className="btn btn-success"
                type="button"
                onClick={() => {
                    navigate("/technic");
                }}
            >Добавить технику</button>
        </div>
    );
}

export default TechnicsFooter;