import React, {useEffect, useState} from 'react';
import style from './CEApplication.module.css';
import {
    AppTitle,
    CardTitle,
    AppTodayDescription,
    ApplicationTechnics, ApplicationMaterials,

} from './Components';
import {useParams} from "react-router";
import {useFetchConstructionSiteById} from "../../../api/constructionSiteApi";
import {useAppSelector} from "../../../store/store";
import {applicationSlice} from "../../../store/slices/applicationSlice";
import {useAppData} from "../../../api/applicationApi";
import {
    IApplicationToday,
    useCreateApplicationsToday,
    useFetchApplicationsTodayById, useGetOrCreateApplicationsTodayByCW
} from "../../../api/ApplicationTodayApi";

export default function CreateApp() {
    const {constrSiteId} = useParams<{ constrSiteId: string }>()
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {appData} = useAppData({current_day: currentDay});
    const isAppNotExists = !!(constrSiteId && appData?.current_date.id)

    const {appToday} = useGetOrCreateApplicationsTodayByCW({
        construction_site_id: constrSiteId,
        workday_id: appData?.current_date.id
    });

    const {constrSite} = useFetchConstructionSiteById(appToday?.construction_site)




    return (
        <div className={style.Component + " container-sm"}>
            <AppTitle title={"Создать заявку"}/>
            <div className="card">
                <CardTitle
                    constrSite={constrSite}
                    appData={appData}
                />
                <AppTodayDescription/>
            </div>

            <ApplicationTechnics appToday={appToday}/>
            <ApplicationMaterials appToday={appToday}/>


        </div>
    );
}
