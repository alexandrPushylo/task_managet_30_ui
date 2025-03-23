import React, {useEffect} from 'react';
import {useAppStore} from "../../../store/store";
import {applicationSlice} from "../../../store/slices/applicationSlice";


function ProfileItem() {
    const appStore = useAppStore();
    const currentUser = applicationSlice.selectors.selectCurrentUser(appStore.getState())

    return (
        <li>
            <span className="dropdown-item">
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                        alert('Profile')
                    }}
                ><span
                    className="ms-1 small fw-bolder text-decoration-underline"
                >{
                    currentUser&&(currentUser.last_name && currentUser.first_name)? currentUser.last_name +' '+ currentUser.first_name:
                        currentUser&&currentUser.username
                }</span></button>

                <button
                    className="btn ms-1 btn-sm btn-secondary"
                    onClick={() => {
                        alert('Settings')
                    }}
                ><span><i className="fa-solid fa-gear"></i></span></button>
            </span>
        </li>
    );
}

export default ProfileItem;