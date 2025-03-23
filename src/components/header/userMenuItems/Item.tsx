import React, {useContext} from 'react';
import {useNavigate} from "react-router";
// import {TMContext} from "../../../TaskManager";

interface IProps {
    name: string
    href: string
    action?:()=>{}
}


function MenuItem({name, href, action}: IProps) {

    // // @ts-ignore
    // const tt = useContext(TMContext)
    // console.log(action)

    const navigate = useNavigate();

    function onAction(){
        if (action){
            action()
            navigate("/")
        }
        else {
            navigate(href)
        }
    }


    return (
        <li>
            <span
                className="dropdown-item btn"
                onClick={onAction}
            >{name}
            </span>
        </li>
    );
}

export default MenuItem;