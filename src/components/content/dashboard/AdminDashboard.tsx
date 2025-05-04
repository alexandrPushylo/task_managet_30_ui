import React from 'react';
import {useFetchConstructionSites} from "../../../api/constructionSiteApi";
import ConstrSiteItem from "./ConstrSiteItem";
import {useFetchApplicationsToday} from "../../../api/applicationTodayApi";
import {useAppSelector} from "../../../store/store";
import {applicationSlice} from "../../../store/slices/applicationSlice";
import {useAppData, useCurrentUser} from "../../../api/applicationApi";
import {useFetchDriverList, useFetchForemanList} from "../../../api/usersApi";
import {useFetchApplicationTechnics} from "../../../api/applicationTechnicApi";
import {useFetchConflictIdList, useFetchPriorityIdList, useFetchTechnicSheet} from "../../../api/technicSheetApi";
import {useFetchDriverSheet} from "../../../api/driverSheetApi";
import {useFetchTechnics} from "../../../api/technicsApi";
import {useFetchApplicationMaterials} from "../../../api/applicationMaterialApi";
// @ts-ignore
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import {ColumnsCountBreakPoints} from "../../../assets/assets";


export default function AdminDashboard() {
    const {currentUser} = useCurrentUser();
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {constrSites} = useFetchConstructionSites();
    const {appsToday} = useFetchApplicationsToday(currentDay);
    const {appData} = useAppData({current_day: currentDay});
    const {appTechnics} = useFetchApplicationTechnics(currentDay)
    const {appMaterials} = useFetchApplicationMaterials(currentDay);
    const {technicSheets} = useFetchTechnicSheet(currentDay);
    const {driverSheets} = useFetchDriverSheet(currentDay);

    const {conflictIdList} = useFetchConflictIdList(currentDay);
    const {priorityIdList} = useFetchPriorityIdList(currentDay);

    const {technics} = useFetchTechnics();
    const {foremanList} = useFetchForemanList();
    const {driverList} = useFetchDriverList();

    return (
        <ResponsiveMasonry columnsCountBreakPoints = {ColumnsCountBreakPoints}>
            <Masonry>
                {constrSites?.map((CS_Item, index) => {
                    if (!CS_Item.isArchive && CS_Item.status) {
                        return <ConstrSiteItem
                            key={index}
                            currentUser={currentUser}
                            constrSiteItem={CS_Item}
                            appsToday={appsToday}
                            appData={appData}
                            foremanList={foremanList}
                            appTechnics={appTechnics}
                            appMaterials={appMaterials}
                            technics={technics}
                            technicSheets={technicSheets}
                            driverSheets={driverSheets}
                            driverList={driverList}
                            conflictIdList={conflictIdList}
                            priorityIdList={priorityIdList}
                        />
                    }
                })
                }
            </Masonry>
        </ResponsiveMasonry>
    )
}
