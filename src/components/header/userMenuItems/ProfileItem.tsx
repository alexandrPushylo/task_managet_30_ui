import React from 'react';

function ProfileItem() {
    return (
        <li>
            <span className="dropdown-item">
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {alert('Profile')}}
                ><span
                    className="ms-1 small fw-bolder text-decoration-underline"
                >$Username</span></button>

                <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {alert('Settings')}}
                ><span><i className="fa-solid fa-gear"></i></span></button>
            </span>
        </li>
    );
}

export default ProfileItem;