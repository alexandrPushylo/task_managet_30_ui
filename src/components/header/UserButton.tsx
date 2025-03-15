import React, {useEffect, useState} from 'react';
import {EUserPost, IMenuItem} from "../../assets/assets";
import {getUserMenuItems} from "../../assets/services";
import ProfileItem from "./userMenuItems/ProfileItem";
import Item from "./userMenuItems/Item";


function UserButton() {
    const [userPost, setUserPost] = useState<EUserPost>(EUserPost.EMPLOYEE);
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);

    useEffect(() => {
        setUserPost(EUserPost.ADMINISTRATOR);
    }, [])

    useEffect(() => {
        setMenuItems(getUserMenuItems(userPost))
    }, [userPost]);


    return (
        <div>
            <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            ><b><i className="fa-solid fa-list"></i></b></button>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu">
                <ProfileItem/>
                {
                    menuItems.map((item) => {
                        return (
                            <>
                                {item.afterSeparated && <li>
                                    <hr className="m-0"/>
                                </li>}
                                <Item name={item.name} onClick={item.onClick}/>
                            </>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default UserButton;