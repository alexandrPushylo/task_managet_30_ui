import React, {useEffect, useMemo, useState} from 'react';
import {useTextareaAutosize} from "../../../assets/services";
import {useAppSelector} from "../../../store/store";
import {applicationSlice} from "../../../store/slices/applicationSlice";
import {useFetchDriverList} from "../../../api/usersApi";
import {
    TechnicSheetDto,
    TSWithTechTitle,
    TSWithTechTitleItem, useFetchTechnicSheet,
    useGetTechnicSheetWithTechTitleForAdd
} from "../../../api/technicSheetApi";
import {DriverSheetDto, useFetchDriverSheet} from "../../../api/driverSheetApi";
import {ApplicationTodayDto} from "../../../api/ApplicationTodayApi";
import {useCreateApplicationsTechnic} from "../../../api/applicationTechnicApi";

interface ModalEditAppTechnicProps {
    appToday?: ApplicationTodayDto;
}
export function ModalEditAppTechnic({appToday}:ModalEditAppTechnicProps) {
    const {handleCreate} = useCreateApplicationsTechnic();
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {tSWTechTitleForAdd} = useGetTechnicSheetWithTechTitleForAdd(currentDay);
    const {technicSheets} = useFetchTechnicSheet(currentDay);
    const {driverSheets} = useFetchDriverSheet(currentDay)

    const [TSDataItem, setTSDataItem] = useState<TSWithTechTitleItem>();
    const [techDriver, setTechDriver] = useState<string | undefined>();
    const [description, setDescription] = useState<string | undefined>();
    
    const curDS = useMemo(() => {
        return driverSheets?.filter(item => TSDataItem?.driver_sheet_ids.includes(item.id))
    },[TSDataItem?.driver_sheet_ids, driverSheets])
    const curTS = useMemo(() => {
        return technicSheets?.filter(item => TSDataItem?.technic_sheet_ids.includes(item.id))
    },[TSDataItem?.technic_sheet_ids, technicSheets])

    function getSomeTechSheetId() {

        if ((techDriver && curTS) && techDriver === 'any') {
            const freeTS = curTS.find(item => item.count_application === 0)
            if (freeTS) {
                return freeTS.id
            } else {
                const minTS = curTS.map((item, index) =>  [item.count_application, index])
                const FreeIndexTS = minTS.sort()[0][1] ?? 0;
                return curTS[FreeIndexTS].id
            }
        }
        if (!!techDriver) {
            return parseInt(techDriver)
        }
        return curTS && curTS[0].id
    }
    function createAppTechnic() {

        const data = {
            application_today: appToday?.id,
            technic_sheet: getSomeTechSheetId(),
            description: description,
        }
        handleCreate(data)
        setTSDataItem(undefined);
        setTechDriver(undefined);
        setDescription(undefined);
    }

    useTextareaAutosize();

    return <div className="modal fade"
             id="modalApplicationTechnic"
             data-bs-backdrop="static"
             data-bs-keyboard="false"
             tabIndex={-1}
             aria-labelledby="staticBackdropLabel"
             aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Добавить технику</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body m-0">
                    <div>
                        <div className="input-group row">

                            <label className="col-12">Название техники
                                <SelectTechTitle
                                    tSWTechTitleForAdd={tSWTechTitleForAdd}
                                    TSDataItem={TSDataItem}
                                    setTSDataItem={setTSDataItem}
                                />
                            </label>

                            {TSDataItem &&
                                <label className="mt-2 col-12">
                                    <span id="span_driver_name">Водитель</span>
                                    <SelectTechDriver
                                        curDS={curDS}
                                        curTS={curTS}
                                        setTechDriver={setTechDriver}
                                    />
                                </label>
                            }


                        </div>

                        {TSDataItem && <label className="row mt-2">
                            <textarea className="form-control"
                                      placeholder="Описания задания"
                                      value={description}
                                      onChange={e => setDescription(e.target.value)}
                            ></textarea>
                        </label>}

                    </div>
                </div>

                <div className="modal-footer" style={{justifyContent: "space-between"}}>
                    <button style={{textAlign: 'left'}}
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                    >Отмена
                    </button>
                    {TSDataItem &&
                        <button onClick={createAppTechnic}
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                    >Добавить</button>}
                </div>

            </div>
                </div>
        </div>

}


interface SelectTechTitleProps {
    tSWTechTitleForAdd?: TSWithTechTitle;
    TSDataItem?: TSWithTechTitleItem;
    setTSDataItem: React.Dispatch<React.SetStateAction<TSWithTechTitleItem | undefined>>;
}
function SelectTechTitle({TSDataItem, setTSDataItem, tSWTechTitleForAdd}:SelectTechTitleProps) {

    function setTSData(title: string){
        const TSItem = tSWTechTitleForAdd?.data.find(item => item.title===title);
        if (TSItem){
            setTSDataItem(TSItem)
        } else {
            setTSDataItem(undefined)
        }
    }

    return <select className="form-control"
                   defaultValue={TSDataItem?.title}
                   onChange={e => setTSData(e.target.value)}
    >
        <option value={undefined}>---</option>
        {tSWTechTitleForAdd?.data?.map((item, index) => {
            return <option
                key={index}
                value={item.title}
                style={item.is_exists_free ? {color: 'black'} : {color: 'red'}}
                selected={TSDataItem === item}
            >{item.title} {!item.is_exists_free && "(Занято)"}</option>;
        })}
    </select>
}

interface SelectTechDriverProps {
    curDS?: DriverSheetDto[];
    curTS?: TechnicSheetDto[];
    // techDriver: number;
    setTechDriver: React.Dispatch<React.SetStateAction<string | undefined>>;
}
function SelectTechDriver({setTechDriver, curDS, curTS}:SelectTechDriverProps){
    const {driverList} = useFetchDriverList();

    useEffect(() => {
        if(curTS && curTS?.length > 1){setTechDriver('any')}
        if(curTS && curTS?.length === 1){setTechDriver(String(curTS[0].id))}
    }, [curTS, setTechDriver]);

    return <select className="form-control"
                   onChange={e => setTechDriver(e.target.value)}
    >
        <option value={'any'} selected={curTS && curTS?.length > 1}>--Любой--</option>
        {curTS?.map((TS, index) => {
            const cDS = curDS?.find(item => item.id === TS.driver_sheet)
            const cDriver = driverList?.find(item => item.id === cDS?.driver)
            return <option
                key={index}
                value={TS.id}
                selected={curTS && curTS?.length===1}
                style={TS.count_application===0 ? {color: 'green'} : {color: 'red'}}
            >{cDriver?.last_name} {TS.count_application > 0 && '(Занят)'}</option>
        })}
    </select>
}
