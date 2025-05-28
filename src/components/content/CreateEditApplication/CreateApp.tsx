import React, {useState} from 'react';
import style from './CEApplication.module.css';
import {
    AppTitle,
    CardTitle,
    AppTodayDescription,
    ApplicationTechnics,
    ApplicationMaterials,
    ButtonAddApp

} from './Components';
import {useParams} from "react-router";
import {useFetchConstructionSiteById} from "../../../api/constructionSiteApi";
import {useAppSelector} from "../../../store/store";
import {applicationSlice} from "../../../store/slices/applicationSlice";
import {useAppData} from "../../../api/applicationApi";
import {useFetchApplicationsTodayById, useGetOrCreateApplicationsTodayByCW} from "../../../api/ApplicationTodayApi";


export interface IDisplayComponent {
    appTech?: boolean;
    appMat?: boolean;
    btnAddTech?: boolean;
    btnAddMat?: boolean;
}

export default function CreateApp() {
    const {constrSiteId} = useParams<{ constrSiteId: string }>()
    const {appTodayId} = useParams<{ appTodayId: string }>()

    const [displayAT, setDisplayAT] = useState(true);
    const [displayAM, setDisplayAM] = useState(false);
    const [displayBAT, setDisplayBAT] = useState(true);
    const [displayBAM, setDisplayBAM] = useState(true);

    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {appData} = useAppData({current_day: currentDay});

    const {appToday: AppTodayFromCreate} = useGetOrCreateApplicationsTodayByCW({
        construction_site_id: constrSiteId,
        workday_id: appData?.current_date.id
    });
    const {appToday: AppTodayFromEdit} = useFetchApplicationsTodayById(appTodayId);
    const appToday = AppTodayFromCreate ?? AppTodayFromEdit;
    const {constrSite} = useFetchConstructionSiteById(appToday?.construction_site)
    const appTitle = AppTodayFromCreate ? 'Создать заявку' : 'Изменить заявку'

    return (
        <div className={style.Component + " container-sm"}>
            <AppTitle title={appTitle}/>
            <div className="card">
                <CardTitle
                    constrSite={constrSite}
                    appData={appData}
                />
                <AppTodayDescription/>
            </div>

            {displayAT && <ApplicationTechnics appToday={appToday}/>}
            <ApplicationMaterials appToday={appToday}
                                  displayAM={displayAM}
                                  setDisplayAM={setDisplayAM}
                                  setDisplayBAT={setDisplayBAT}
                                  setDisplayBAM={setDisplayBAM}
            />

            <ButtonAddApp isChangeableMaterial={true}
                          displayBAT={displayBAT}
                          displayBAM={displayBAM}
                          setDisplayAM={setDisplayAM}
                          setDisplayBAT={setDisplayBAT}
                          setDisplayBAM={setDisplayBAM}
                          appToday={appToday}
            />
        </div>
    );
}
