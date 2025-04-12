import React, {useEffect, useState} from 'react';
import style from "./Technic.module.css";
import {useNavigate, useParams} from "react-router";
import {
    TechnicsDto,
    useCreateTechnic,
    useDeleteTechnic,
    useFetchTechnicById,
    useFetchTechnicTypes,
    useUpdateTechnic
} from "../../../api/technicsApi";
import {useFetchDriverList, UsersDto} from "../../../api/usersApi";
import Loader from "../../loaders/Loader";
import {EUserPost} from "../../../assets/assets";


interface ITechnicState {
    id?: number;
    title?: string;
    type?: string;
    id_information?: string;
    description?: string;
    supervisor_technic: "mechanic" | "supply";
    isArchive: boolean;
    attached_driver?: number;
}

const technicInitState: ITechnicState = {
    id: undefined,
    title: undefined,
    type: undefined,
    id_information: undefined,
    description: undefined,
    supervisor_technic: "mechanic",
    isArchive: false,
    attached_driver: undefined,
}


export default function Technic() {
    const navigate = useNavigate();
    const {technicId} = useParams<{ technicId: string }>();
    const title = technicId ? "Изменить пользователя" : "Добавить пользователя";

    const createTechnic = useCreateTechnic();
    const updateTechnic = useUpdateTechnic(technicId);
    const deleteTechnic = useDeleteTechnic(technicId);

    const {technic: technicData, isLoading} = useFetchTechnicById(technicId);
    const [technic, setTechnic] = useState(technicInitState);

    function setTechnicType(technicType: string) {
        setTechnic({...technic, type: technicType});
    }

    function setAttachedDriver(attachedDriverId: string) {
        setTechnic({...technic, attached_driver: parseInt(attachedDriverId)});
    }
    function setSupervisor(supervisor: string) {
        if (supervisor === "mechanic" || supervisor === "supply") {
            setTechnic({...technic, supervisor_technic: supervisor});
        }else {
            setTechnic({...technic, supervisor_technic: "mechanic"});
        }
    }

    useEffect(() => {
        setTechnic(technicData ?? technicInitState);
    }, [technicData])


    if (!isLoading) {
        return (
            <div className={"card mx-auto " + style.Component}>
                <div><h3><u>{title}</u></h3></div>
                <form
                    method="post"
                    onSubmit={technicId ? updateTechnic.handleUpdate : createTechnic.handleCreate}
                >
                    <div className="m-2 me-2">
                        <label>Название техники*
                            <input
                                required={true}
                                className="form-control"
                                type="text"
                                name="title"
                                placeholder="Например: МАЗ 10т."
                                onChange={(e) => setTechnic({...technic, title: e.target.value})}
                                value={technic?.title}
                            />
                        </label>
                        <label>Тип техники*
                            <TechnicTypeSelect technicType={technic.type} setTechnicType={setTechnicType}/>
                        </label>
                    </div>
                    <div className="m-2">
                        <label>Прикрепленный водитель
                            <AttachedDriverSelect attachedDriverId={technic.attached_driver}
                                                  setAttachedDriver={setAttachedDriver}/>
                        </label>
                        <label className="ms-2">Руководитель
                            <SupervisorSelect supervisor={technic.supervisor_technic} setSupervisor={setSupervisor} />
                        </label>
                    </div>
                    <div className="m-2">
                        <label>Идентификационная информация*
                            <input
                                type="text"
                                required={true}
                                className="form-control"
                                name="id_information"
                                placeholder="Например: КА-7 1234"
                                value={technic?.id_information}
                                onChange={(e) => setTechnic({...technic, id_information: e.target.value})}
                            />
                        </label>
                    </div>
                    <div className="m-2">
                        <label className="w-100">Описание
                            <textarea
                                className="form-control"
                                name="description"
                                onChange={(e) => setTechnic({...technic, description: e.target.value})}
                                value={technic?.description}
                            ></textarea>
                        </label>
                    </div>
                    <div className="m-2 navbar">
                        {technicId &&
                            <span>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={deleteTechnic.handleDelete}
                                >Удалить</button>
                            </span>
                        }
                        <span>
                            <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => navigate("/technics")}
                            >Отмена</button>
                        </span>
                        <span>
                            <button
                                type="submit"
                                className="btn btn-sm btn-success"
                            >Сохранить</button>
                        </span>

                    </div>

                </form>
            </div>
        );
    } else {
        return <Loader/>
    }
};


interface TechnicTypeSelectProps {
    technicType: string | undefined,
    setTechnicType: (technicType: string) => void
}

function TechnicTypeSelect({technicType, setTechnicType}: TechnicTypeSelectProps) {
    const {technicTypes, isLoading} = useFetchTechnicTypes();

    return <select
        name="type"
        required={true}
        className="form-control"
        onChange={event => setTechnicType(event.target.value)}
    >
        <option value={undefined} selected={!technicType}></option>
        {!isLoading && technicTypes?.technic_types.map((techType: string, index: number) => <option
            key={index}
            value={techType}
            selected={technicType === techType}
        >{techType}</option>)
        }
    </select>
}

interface AttachedDriverSelectProps {
    attachedDriverId: number | undefined,
    setAttachedDriver: (attachedDriverId: string) => void
}

function AttachedDriverSelect({attachedDriverId, setAttachedDriver}: AttachedDriverSelectProps) {
    const {driverList, isLoading} = useFetchDriverList();

    return <select
        name="attached_driver"
        className="form-control"
        onChange={event => setAttachedDriver(event.target.value)}
    >
        <option value={undefined} selected={!attachedDriverId}></option>
        {!isLoading && driverList?.map((driver: UsersDto, index: number) => <option
            key={index}
            value={driver.id}
            selected={attachedDriverId === driver.id}
        >{driver.last_name} {driver.first_name}</option>)
        }
    </select>
}

interface SupervisorSelectProps {
    supervisor: string;
    setSupervisor: (supervisor: string) => void;
}

function SupervisorSelect({supervisor, setSupervisor}: SupervisorSelectProps) {
    const supervisors = [
        {title: "Механик", value: EUserPost.MECHANIC},
        {title: "Снабжение", value: EUserPost.SUPPLY}
    ]

    return <select
        name="supervisor_technic"
        className="form-control"
        onChange={event => setSupervisor(event.target.value)}
        defaultValue={EUserPost.MECHANIC}
    >

        {supervisors.map((visor, index: number) => <option
            key={index}
            value={visor.value}
            selected={supervisor === visor.value}
        >{visor.title}</option>)
        }
    </select>
}