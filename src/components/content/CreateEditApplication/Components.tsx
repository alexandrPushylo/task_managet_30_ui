import React, {JSX, useEffect, useMemo, useState} from 'react';
import {useTextareaAutosize} from "../../../assets/services";
import {ConstructionSiteDto} from "../../../api/constructionSiteApi";
import {appDataDto} from "../../../api/applicationApi";
import {
    useDeleteApplicationsMaterial,
    useFetchApplicationMaterialBy_ATid,
    useUpdateApplicationsMaterial
} from "../../../api/applicationMaterialApi";
import {ApplicationTodayDto} from "../../../api/ApplicationTodayApi";
import {
    ApplicationTechnicDto, useDeleteApplicationsTechnic,
    useFetchApplicationTechnicBy_ATid,
    useUpdateApplicationsTechnic
} from "../../../api/applicationTechnicApi";
import {useAppSelector} from "../../../store/store";
import {applicationSlice} from "../../../store/slices/applicationSlice";
import {useFetchTechnics} from "../../../api/technicsApi";
import {
    TechnicSheetDto,
    useFetchTechnicSheet,
    useGetTechnicSheetWithTechTitle, useGetTechnicSheetWithTechTitleForAdd
} from "../../../api/technicSheetApi";
import {useFetchDriverList} from "../../../api/usersApi";
import {DriverSheetDto, useFetchDriverSheet} from "../../../api/driverSheetApi";
import {IDisplayComponent} from "./CreateApp";
import {ModalEditAppTechnic} from "./ModalEditAppTechnic";

export function AppTitle({title}: { title: string }) {
    return <div><h3><u>{title}</u></h3></div>
}

interface CardTitleProps {
    constrSite?: ConstructionSiteDto;
    appData?: appDataDto;
}

export function CardTitle({constrSite, appData}: CardTitleProps) {
    return <div className="card-header">
        <p className="m-0">
            <span className="small">Объект:</span>&nbsp;
            <span className="fw-bold">{(constrSite?.address)?.toUpperCase()}</span>
        </p>
        <p className="m-0">
            <span className="small">Дата:</span>&nbsp;
            <span className="fw-bold">{appData?.current_date.day} {appData?.current_date.month_name},</span>&nbsp;
            <span className="fw-bold">{appData?.current_date.weekday}</span>&nbsp;
        </p>
    </div>
}

//  ============================================================================
export function AppTodayDescription() {
    const prevAppDescription = '1';
    const [appDescription, setAppDescription] = useState<string>('');
    const [displayDescription, setDisplayDescription] = useState<boolean>(false);
    const [displayButtons, setDisplayButtons] = useState<boolean>(false);

    useTextareaAutosize();

    return <div className="card-header">
        {(appDescription || displayDescription) && <div className="row">
            <label><span className="small">Примечание к объекту:</span>
                <textarea
                    className="form-control"
                    value={appDescription}
                    onChange={(e) => setAppDescription(e.target.value)}
                    onInput={() => {
                        setDisplayDescription(true);
                        setDisplayButtons(true);
                    }}
                    onBlur={() => {
                        if (appDescription === prevAppDescription) {
                            setDisplayButtons(false);
                        }
                    }}
                ></textarea>
            </label>
        </div>}

        {(!appDescription && !displayDescription) && <div className="mt-1">
            <BtnAddDescription action={() => setDisplayDescription(true)}/>
        </div>}

        {displayButtons && <div className="mt-1 px-3 row"
                                style={{justifyContent: "space-between"}}
        >
            <BtnCancelDescription action={() => {
                setDisplayDescription(false);
                setDisplayButtons(false);
                setAppDescription(prevState => '');
            }}/>
            <BtnSaveDescription action={() => {
                alert('save: ' + appDescription);
                setDisplayButtons(false);
                setDisplayDescription(false);
            }}/>
        </div>}
    </div>
}

function BtnAddDescription({action}: { action: () => void }) {
    return <button className="btn btn-secondary"
                   type="button"
                   style={{float: 'right'}}
                   onClick={action}
    >Добавить примечание</button>
}

function BtnCancelDescription({action}: { action: () => void }) {
    return <button className="btn btn-outline-primary w-auto"
                   type="button"
                   onClick={action}
    >Отмена</button>
}

function BtnSaveDescription({action}: { action: () => void }) {
    return <button className="btn btn-success w-auto"
                   type="button"
                   onClick={action}
    >Добавить примечание</button>
}

//  ============================================================================
interface ApplicationTechnicsProps {
    appToday?: ApplicationTodayDto
}

export function ApplicationTechnics({appToday}: ApplicationTechnicsProps) {
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {appTechnic} = useFetchApplicationTechnicBy_ATid(appToday?.id)
    const {technicSheets} = useFetchTechnicSheet(currentDay);
    const {driverSheets} = useFetchDriverSheet(currentDay)


    return <div
        className="p-0"
    >
        {appTechnic?.map((ATech, index) => {
            return <ApplicationTechnicItem
                key={index}
                appTechnicItem={ATech}
                technicSheets={technicSheets}
                driverSheets={driverSheets}
            />
        })}
    </div>
}

interface ApplicationTechnicItemProps {
    appTechnicItem: ApplicationTechnicDto;
    technicSheets?: TechnicSheetDto[];
    driverSheets?: DriverSheetDto[];
}

function ApplicationTechnicItem({appTechnicItem, technicSheets, driverSheets}: ApplicationTechnicItemProps) {
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {technics} = useFetchTechnics();
    const {tSWTechTitle} = useGetTechnicSheetWithTechTitle(currentDay)

    const {setTechnicSheet} = useUpdateApplicationsTechnic(appTechnicItem.id);

    const curTechnicSheetItem = technicSheets?.find(item => item.id === appTechnicItem.technic_sheet);
    const curTechnic = technics?.find(item => item.id === curTechnicSheetItem?.technic);
    const curDriverSheetItem = driverSheets?.find(item => item.id === curTechnicSheetItem?.driver_sheet);

    const [techTitle, setTechTitle] = useState<string>();

    useEffect(() => {
        setTechTitle(curTechnic?.title)
    }, [curTechnic?.title]);

    const curtSWTechTitleItem = useMemo(() => {
        return tSWTechTitle?.data.find(items => items.title === techTitle);
    }, [tSWTechTitle?.data, techTitle]);

    const curDS = useMemo(() => {
        return driverSheets?.filter(item => curtSWTechTitleItem?.driver_sheet_ids.includes(item.id));
    }, [curtSWTechTitleItem?.driver_sheet_ids, driverSheets]);


    function changeTechTitle(techTitle: string) {
        setTechTitle(techTitle);
        const tSWTT = tSWTechTitle?.data.find(items => items.title === techTitle);
        setTechnicSheet(tSWTT?.technic_sheet_ids[0]);

    }

    return <div className="mt-2 card border border-2" style={{boxShadow: '5px 5px 50px'}}>
        <div className="row m-0 p-1 card-header" style={{background: '#e8ebfa'}}>
            {curTechnic && <div className="col">
                <label className="col-auto p-0">
                    <SelectTechnicTitle //curTechnic={curTechnic}
                                        appTechnicItem={appTechnicItem}
                                        techTitle={techTitle}
                                        changeTechTitle={changeTechTitle}
                    />
                </label>
                <label>
                    <SelectTechDriver curDriverSheetItem={curDriverSheetItem}
                                      appTechnicItem={appTechnicItem}
                                      technicSheets={technicSheets}
                                      curDS={curDS}
                                      setTechnicSheet={setTechnicSheet}
                    />
                </label>
            </div>}
            <ButtonsControlEdit appTechnicItem={appTechnicItem}/>
            {/*<span className="small text-warning">На данный момент водитель отсутствует</span>*/}
        </div>
        <DescriptionAppTechnic appTechnicItem={appTechnicItem}/>
    </div>
}

interface SelectTechnicTitleProps {
    techTitle?: string
    changeTechTitle: (techTitle: string) => void;
    appTechnicItem: ApplicationTechnicDto;
}

function SelectTechnicTitle({appTechnicItem, techTitle, changeTechTitle}: SelectTechnicTitleProps) {
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {tSWTechTitle} = useGetTechnicSheetWithTechTitle(currentDay);

    return <select
        className="form-control p-1"
        disabled={appTechnicItem.isChecked || appTechnicItem.is_cancelled}
        defaultValue={techTitle}
        onChange={(e) => {
            changeTechTitle(e.target.value)
        }}
    >
        {tSWTechTitle?.data?.map((item, index) => {
            return <option key={index}
                           value={item.title}
                           selected={item.title === techTitle}
            >{item.title}</option>;
        })}
    </select>
}

interface SelectTechDriverProps {
    curDriverSheetItem?: DriverSheetDto;
    appTechnicItem: ApplicationTechnicDto;
    technicSheets?: TechnicSheetDto[];
    curDS?:DriverSheetDto[];
    setTechnicSheet:(technicSheetId: number | undefined) => void
}

function SelectTechDriver({
                              curDriverSheetItem,
                              appTechnicItem,
                              technicSheets,
                              curDS,
                              setTechnicSheet
                          }: SelectTechDriverProps) {
    const {driverList} = useFetchDriverList();
    const [curTSId, setCurTSId] = useState<number>()

    function updateTechnicSheet(driverSheetId: number) {
        const curTS = technicSheets?.find(item => item.driver_sheet === driverSheetId);
        setTechnicSheet(curTS?.id);
    }

    useEffect(() => {
        setCurTSId(curDriverSheetItem?.driver)
    }, [curDriverSheetItem?.driver]);

    if (curTSId){
        return <select
        className="form-control p-1"
        disabled={appTechnicItem.isChecked || appTechnicItem.is_cancelled}
        // defaultValue={curTSId}
        onChange={(e) => {
            setCurTSId(curDriverSheetItem?.driver);
            updateTechnicSheet(parseInt(e.target.value));
        }}
    >{curDS?.map((driverSheet, index) => {
        const curDriver = driverList?.find(item => item.id === driverSheet.driver)
        const curTS = technicSheets?.find(item => item.driver_sheet === driverSheet.id);

        return <option key={index}
                       value={driverSheet.id}
                       selected={driverSheet.id === curDriverSheetItem?.id}
                       style={(curTS && curTS.count_application===0) ? !driverSheet?.status ? {color:'black'}: {color:'green'} :{color:'red'}}
        >{driverSheet?.status ? curDriver?.last_name : 'Не назначен'} {(driverSheet?.status && curTS && curTS.count_application>0) && '(Занят)'}</option>
    })}
        </select>
    } else {
        return <></>
    }

}

interface ButtonsControlEditProps {
    appTechnicItem: ApplicationTechnicDto;
}

function ButtonsControlEdit({appTechnicItem}: ButtonsControlEditProps) {
    const {acceptApp, rejectApp} = useUpdateApplicationsTechnic(appTechnicItem.id);
    const {handleDelete} = useDeleteApplicationsTechnic(appTechnicItem.id);

    return <div className="col-auto"
    >
        <div className="dropdown" style={{marginTop: '0.1rem'}}>
            <button className="btn btn-sm btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
            ><i className="fa-solid fa-ellipsis"></i></button>
            <ul className="dropdown-menu dropdown-menu-end">

                {(appTechnicItem.is_cancelled && !appTechnicItem.isChecked) && <li>
                    <button className="dropdown-item fw-bolder text-success"
                            type="button"
                            onClick={() => acceptApp(appTechnicItem.description, appTechnicItem?.technic_sheet)}
                    >Принять заявку
                    </button>
                </li>}

                {(!appTechnicItem.is_cancelled) && <li>
                    <button className="dropdown-item fw-bolder text-primary"
                            type="button"
                            onClick={() => rejectApp(appTechnicItem.description, appTechnicItem?.technic_sheet)}
                    >Отменить заявку
                    </button>
                </li>}

                <li>
                    <hr className="dropdown-divider"/>
                </li>

                <li>
                    <button className="dropdown-item fw-bolder text-danger"
                            type="button"
                            onClick={handleDelete}
                    >Удалить заявку
                    </button>
                </li>

            </ul>
        </div>
    </div>
}

interface DescriptionAppTechnicProps {
    appTechnicItem: ApplicationTechnicDto;
}

function DescriptionAppTechnic({appTechnicItem}: DescriptionAppTechnicProps) {
    const {setDescription: updateDesc} = useUpdateApplicationsTechnic(appTechnicItem.id);
    useTextareaAutosize();
    const [description, setDescription] = useState<string>('')
    const borderStyle = appTechnicItem.isChecked ? " border border-1 border-success " : appTechnicItem.is_cancelled ? " border border-1 border-danger " : ""

    useEffect(() => {
        setDescription(appTechnicItem.description ?? '')
    }, [appTechnicItem.description]);

    return <div className="row">
        <label><textarea className={"form-control " + borderStyle}
                         disabled={appTechnicItem.is_cancelled || appTechnicItem.isChecked}
                         style={{width: '100%'}}
                         value={description}
                         onChange={(e) => setDescription(e.target.value)}
                         onBlur={() => {
                             (appTechnicItem.description !== description) && updateDesc(description)
                         }}
        ></textarea></label>
    </div>
}

//  ============================================================================
//  ============================================================================
interface ApplicationMaterialsProps {
    appToday?: ApplicationTodayDto;
    displayAM: boolean;
    setDisplayAM: (status:boolean)=>void
    setDisplayBAT: (status:boolean)=>void
    setDisplayBAM: (status:boolean)=>void
}

export function ApplicationMaterials({appToday, displayAM, setDisplayAM, setDisplayBAT, setDisplayBAM}: ApplicationMaterialsProps) {
    const {appMaterial: appMaterialRaw} = useFetchApplicationMaterialBy_ATid(appToday?.id);
    const appMaterial = (appMaterialRaw && appMaterialRaw.length > 0) ? appMaterialRaw[0] : undefined;
    const isChangeableMaterial = true;
    const [description, setDescription] = useState(appMaterial?.description)
    const [showButton, toggleButton] = useState(false);

    const {setDescription: updateDescription} = useUpdateApplicationsMaterial(appMaterial?.id);
    const {deleteAppMaterial} = useDeleteApplicationsMaterial(appMaterial?.id)

    useEffect(() => {
        setDescription(appMaterial?.description)
    }, [appMaterial?.description]);

    useTextareaAutosize();

    function resetChangeDescription() {
        setDescription(appMaterial?.description)
        toggleButton(false);
    }
    function blurAM() {
        if (description === appMaterial?.description){
            toggleButton(false);
        }
        if (!description) {
            setDisplayAM(false)
        }
        setDisplayBAT(true)
        setDisplayBAM(true)
    }
    function saveDescription() {
        toggleButton(false);
        if (description){
            updateDescription(description);
        }
    }

    const showAMStatus = !!(appMaterial || displayAM)
    const showAM = showAMStatus ? {display: 'block'} : {display: 'none'};

    useEffect(() => {
        const textareaAppMaterial = document.getElementById("textarea_app_material");
        (showAMStatus && textareaAppMaterial) && textareaAppMaterial.focus();
    }, [showAMStatus]);

    return <div className="card shadow-lg mt-4"
                style={showAM}
                // style={{display: 'block'}}
        >
            {!isChangeableMaterial &&
                <span style={{textAlign: 'center', backgroundColor: "rgba(233,236,132,0.47)"}}>Прием заявок на материалы приостановлен</span>}

            <div className="card-header p-1">
                <span className="fw-bolder ms-2">Список материалов:</span>
            </div>
            <div className="card-body p-0">
                <textarea className="form-control"
                          id="textarea_app_material"
                          readOnly={!isChangeableMaterial}
                          disabled={!isChangeableMaterial}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          onBlur={blurAM}
                          onClick={()=>toggleButton(true)}
                ></textarea>
            </div>
            {showButton &&
                <div className="m-1 p-1 row"
                     style={{justifyContent: "space-between"}}
                >
                    <button type="button"
                            className="btn btn-outline-primary w-auto"
                            onClick={resetChangeDescription}
                    >Отмена</button>
                    {(!!description) ?
                        <button type="button"
                                className="btn btn-success w-auto"
                                onClick={saveDescription}
                        >Сохранить изменения</button> :

                        <button type="button"
                                className="btn btn-danger w-auto"
                                onClick={deleteAppMaterial}
                        >Удалить</button>
                    }
                </div>
            }
        </div>




}

//  ============================================================================
interface ButtonAddAppProps {
    isChangeableMaterial: boolean;
    displayBAT: boolean;
    displayBAM: boolean;
    setDisplayAM: (status:boolean)=>void
    setDisplayBAT: (status:boolean)=>void
    setDisplayBAM: (status:boolean)=>void
    appToday?: ApplicationTodayDto;
}
export function ButtonAddApp({isChangeableMaterial, displayBAT, displayBAM, setDisplayAM, setDisplayBAT, setDisplayBAM, appToday}: ButtonAddAppProps): JSX.Element {
    function addAppMater() {
        setDisplayAM(true);
        const textareaAppMaterial = document.getElementById("textarea_app_material");
        textareaAppMaterial && textareaAppMaterial.focus();
        setDisplayBAT(false);
        setDisplayBAM(false);
    }

    return <div>
        <div
        className="container position-fixed translate-middle-x bottom-0 start-50"
        style={{marginBottom: '4rem', width:'max-content'}}
    >
        <div className="btn-group" style={{boxShadow: '2px 2px 10px 2px'}}>
            {displayBAT && <button type="button"
                     className="btn btn-primary"
                     data-bs-toggle="modal"
                     data-bs-target="#modalApplicationTechnic"
            ><span className="fw-bolder"><i className="fa-solid fa-plus"></i> ТЕХНИКА</span></button>}
            {(isChangeableMaterial && displayBAM) &&
                <button type="button"
                     className="btn btn-primary"
                        onClick={addAppMater}
            ><span className="fw-bolder"><i className="fa-solid fa-plus"></i> МАТЕРИАЛЫ</span></button>}
        </div>



        </div>
        <ModalEditAppTechnic appToday={appToday} />
        </div>

}

//  ============================================================================