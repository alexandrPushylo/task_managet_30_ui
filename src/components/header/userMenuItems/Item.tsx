import React from 'react';

interface IProps {
    onClick?: () => void;
    name: string
}

function MenuItem(props: IProps) {
    return (
        <li>
            <span
                className="dropdown-item btn"
                onClick={props.onClick}
            >{props.name}
            </span>
        </li>
    );
}

export default MenuItem;