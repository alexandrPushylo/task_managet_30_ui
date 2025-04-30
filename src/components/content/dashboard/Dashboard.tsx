import React from 'react';
import DatePaginator from "../../special/DatePaginator";
import {useAppData, useCurrentUser} from "../../../api/applicationApi";
import AdminDashboard from "./AdminDashboard";
import {PostTitle} from "../../../assets/assets";
import Loader from "../../loaders/Loader";
import LabelArchive from "../../special/LabelArchive";
import {useAppSelector} from "../../../store/store";
import {applicationSlice} from "../../../store/slices/applicationSlice";
import LabelCurrentDay from "../../special/LabelCurrentDay";
import ButtonChangeAcceptMode from "../../special/ButtonChangeAcceptMode";
import ButtonViewProps from "../../special/ButtonViewProps";


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
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {appData} = useAppData({current_day: currentDay});
    const {currentUser, isLoading} = useCurrentUser();
    return <>
        {!isLoading ?
            <div className="container-fluid">
                <DatePaginator/>
                <div
                    style={{textAlign: "center"}}
                >
                    {appData?.view_mode === 'view_mode_archive' && <LabelArchive/>}
                    {appData && <LabelCurrentDay current_date={appData.current_date}/>}
                    {currentUser?.post==='administrator' && <ButtonChangeAcceptMode
                        acceptMode={appData?.accept_mode}
                        currentDay={currentDay}
                    />}
                    <ButtonViewProps />
                </div>

                {currentUser &&
                    getDashboard(currentUser.post)
                }
            </div> :
            <Loader/>
        }

    </>
}

export default Dashboard;