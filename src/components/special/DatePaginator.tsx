import React, {useEffect} from 'react';
import {appDataDto, useAppData, useGetWorkDays, WorkDaysDto} from "../../api/applicationApi";
import {AppDispatch, useAppDispatch, useAppSelector} from "../../store/store";
import {applicationSlice, getPrevOrNextCurrentDay} from "../../store/slices/applicationSlice";

export default function DatePaginator() {
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const {appData} = useAppData();
    const {workDays} = useGetWorkDays();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(applicationSlice.actions.setCurrentDay(appData?.current_date.date))
    }, [appData?.current_date.date, dispatch]);

    function getPrevDay(currentDay?: string) {
        dispatch(getPrevOrNextCurrentDay({current_day: currentDay??'', side: "prev"}));
    }
    function getNextDay(currentDay?: string) {
        dispatch(getPrevOrNextCurrentDay({current_day: currentDay??'', side: "next"}));
    }


    return (
        <div className="container-fluid">
            <div className="mt-1 position-relative translate-middle-x start-50 top-0">
                <p className="mb-1" style={{textAlign: "center"}}>
                    <label>
                        <input className="form-control text-center p-1"
                               type="date"
                               name="current_day"
                               value={currentDay??''}
                               onChange={(e) => {
                                   dispatch(applicationSlice.actions.setCurrentDay(e.target.value));
                               }}
                        />
                    </label>
                </p>
                <nav className="d-flex justify-content-center"
                     aria-label="Page navigation"
                >
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link fw-bold text-dark me-2 ps-4 pe-4"
                                    onClick={() => getPrevDay(currentDay)}
                            ><i className="fa-solid fa-angles-left"></i></button>
                        </li>

                        <ItemPaginator appData={appData}
                                       current_day={currentDay}
                                       workDays={workDays}
                                       dispatch={dispatch}/>

                        <li className="page-item">
                            <button className="page-link fw-bold text-dark ms-2 ps-4 pe-4"
                                    onClick={() => getNextDay(currentDay)}
                            ><i className="fa-solid fa-angles-right"></i></button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

interface ItemPaginatorProps {
    appData?: appDataDto;
    current_day?: string;
    dispatch: AppDispatch;
    workDays?: WorkDaysDto[];
}

function ItemPaginator({appData, current_day, dispatch, workDays}: ItemPaginatorProps) {

    return <>
        {workDays && workDays.map((workDay, index) => {
            const classStatus = workDay.status ? " text-success " : " text-danger ";
            const classToday = appData?.today.date === workDay.date ? " fw-bold text-dark " : "";
            const classCurrentDay = current_day === workDay.date ? " border border-2 border-success " : "";

            return <li className="page-item ms-1 me-1" key={index}>
                <button
                    className={"page-link p-1 m-0 " + classStatus + classToday + classCurrentDay}
                    style={{textAlign: "center", borderRadius: "10%"}}
                    onClick={() => dispatch(applicationSlice.actions.setCurrentDay(workDay.date))}
                >
                    <span>{workDay.day}</span>
                    <br/>
                    <span>{workDay.weekday}</span>
                </button>
            </li>
        })
        }
    </>
}