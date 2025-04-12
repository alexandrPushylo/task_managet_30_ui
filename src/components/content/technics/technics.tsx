import React from 'react';
import style from "./Technics.module.css";
import {useNavigate} from "react-router";
import {TechnicsDto, useFetchTechnics} from "../../../api/technicsApi";
import Loader from "../../loaders/Loader";
import {useFetchDriverList} from "../../../api/usersApi";

export default function Technics() {
    const navigate = useNavigate();
    const {technics, isLoading} = useFetchTechnics();


    if (!isLoading) {
        return (
            <div className={style.Component + " container-sm"}>
                <div className={style.Title}>
                    <span>Техника</span>
                </div>
                <div>
                    <table className={style.Table + " table table-hover"}>
                        <TableHead/>
                        {technics && <TableBody technicList={technics}/>}
                    </table>
                </div>
            </div>
        );
    } else {
        return <Loader/>
    }
}

function TableHead() {
    return (
        <thead>
        <tr>
            <th>№</th>
            <th>Название техники</th>
            <th className={style.for_technic_hide}>Описание</th>
            <th>Прикрепленный водитель</th>
        </tr>
        </thead>
    );
}

interface TableBodyProps {
    technicList: TechnicsDto[]
}

function TableBody({technicList}: TableBodyProps) {
    return (
        <tbody>
        {technicList.map((technic: TechnicsDto, index: number) => {
            return (!technic.isArchive &&
                <TableBodyRow
                    key={index}
                    counter={index + 1}
                    technic={technic}
                />)
        })}
        </tbody>
    );
}

interface TableBodyRowProps {
    counter: number,
    technic: TechnicsDto
}

function TableBodyRow({counter, technic}: TableBodyRowProps) {
    return (
        <tr onClick={() => navigate(`/technic/${technic.id}`)}>
            <td>{counter}</td>
            <td>
                <p className="m-0 fw-bolder">{technic.title}</p>
                <p className="m-0 fw-bolder small">[ {technic.id_information} ]</p>
            </td>
            <td className={style.for_technic_hide}>
                <p className="m-0 small">{technic.type}</p>
                <hr className="m-0"/>
                <p className="m-0 small">{technic.description}</p>
            </td>
            <AttachedDriverColumn attachedDriverId={technic.attached_driver}/>
        </tr>
    )
}

interface AttachedDriverColumnProps {
    attachedDriverId?: number
}

function AttachedDriverColumn({attachedDriverId}: AttachedDriverColumnProps) {
    const {driverList} = useFetchDriverList();
    const attachedDriver = driverList?.find(driver => driver.id === attachedDriverId);

    if (attachedDriver) {
        return (
            <td>
                <span>{attachedDriver?.last_name}</span>&nbsp;
                <span>{attachedDriver?.first_name?.[0]}.</span>
            </td>
        )
    } else {
        return <td></td>
    }
}