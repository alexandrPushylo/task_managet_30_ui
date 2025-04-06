import React, {useEffect, useState} from 'react';
import {EUserPost, IMenuItem} from "../../assets/assets";
import {getEUserPost, getUserMenuItems} from "../../assets/services";
import ProfileItem from "./userMenuItems/ProfileItem";
import Item from "./userMenuItems/Item";
import {useAppSelector} from "../../store/store";
import {applicationSlice} from "../../store/slices/applicationSlice";


function UserButton() {

    const currentUser = useAppSelector(state=>applicationSlice.selectors.selectCurrentUser(state));

    const userPost = getEUserPost(currentUser ? currentUser.post : EUserPost.EMPLOYEE);
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);

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
                    menuItems.map((item, index) => {
                        return (
                            <div key={index}>
                                {item.afterSeparated && <li>
                                    <hr className="m-0"/>
                                </li>}
                                <Item name={item.name} href={item.href} action={item.action}/>
                            </div>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default UserButton;