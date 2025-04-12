import React, {CSSProperties} from 'react';
import {useNavigate} from "react-router";

const cssStyle: CSSProperties = {
    margin: "auto",
}

function UsersFooter() {
    const navigate = useNavigate();
    return (
        <div style={cssStyle}>
            <button
                className="btn btn-success"
                type="button"
                onClick={() => {
                    navigate("/user");
                }}
            >Добавить пользователя</button>
        </div>
    );
}

export default UsersFooter;