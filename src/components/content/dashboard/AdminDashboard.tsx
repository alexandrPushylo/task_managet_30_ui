import React from 'react';
import {useFetchConstructionSites} from "../../../api/constructionSiteApi";
import ConstrSiteItem from "./ConstrSiteItem";
import {useFetchApplicationsToday} from "../../../api/ApplicationTodayApi";
import {useAppSelector} from "../../../store/store";
import {applicationSlice} from "../../../store/slices/applicationSlice";
import {useAppData} from "../../../api/applicationApi";
import {useFetchForemanList} from "../../../api/usersApi";


export default function AdminDashboard() {
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {constrSites, isLoading} = useFetchConstructionSites();
    const {appsToday} = useFetchApplicationsToday(currentDay);
    const {appData} = useAppData({current_day: currentDay});
    const {foremanList} = useFetchForemanList();

    return (
        <div className="mt-3 mx-auto">
            {constrSites?.map((CS_Item, index) => {
                if (!CS_Item.isArchive && CS_Item.status){
                    return <ConstrSiteItem
                        key={index}
                        constrSiteItem={CS_Item}
                        appsToday={appsToday}
                        appData={appData}
                        foremanList={foremanList}
                    />
                }
            })
            }
        </div>
    );
}
