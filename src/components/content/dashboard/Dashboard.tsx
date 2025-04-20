import React from 'react';
import DatePaginator from "../../special/DatePaginator";
import {useCurrentUser} from "../../../api/applicationApi";
import AdminDashboard from "./AdminDashboard";
import {PostTitle} from "../../../assets/assets";
import Loader from "../../loaders/Loader";


function getDashboard(post: PostTitle) {
    switch (post) {
        case "administrator":
            return <AdminDashboard/>;
        case "foreman":
            return <div>Foreman</div>;
        case "master":
            return <div>Master</div>;
        case "driver":
            return <div>Driver</div>;
        case "mechanic":
            return <div>Mechanic</div>;
        case "supply":
            return <div>Supply</div>;
        case "employee":
            return <div>Employee</div>;
        default:
            return <div>Def Dashboard</div>;
    }
}

function Dashboard() {
    const {currentUser, isLoading} = useCurrentUser();
    return <>
        {!isLoading ?
            <div className="container-fluid">
                <DatePaginator/>
                {currentUser &&
                    getDashboard(currentUser.post)
                }
            </div> :
            <Loader/>
        }

    </>
}

export default Dashboard;