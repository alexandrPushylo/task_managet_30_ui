import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router";
import style from "./ConstructionSite.module.css";
import Loader from "../../loaders/Loader";
import {
    useCreateConstructionSite,
    useFetchConstructionSiteById,
    useUpdateConstructionSite
} from "../../../api/constructionSiteApi";
import {useFetchForemanList} from "../../../api/usersApi";


interface IConstructionSiteState {
    id?: number;
    address?: string;
    deleted_date?: string;
    status: boolean;
    isArchive: boolean;
    foreman?: number
}

const constructionSiteInitState: IConstructionSiteState = {
    id: undefined,
    address: undefined,
    deleted_date: undefined,
    status: true,
    isArchive: false,
    foreman: undefined,
}

export default function ConstructionSite() {
    const {constructionSiteId} = useParams<{ constructionSiteId: string }>();

    const createConstructionSite = useCreateConstructionSite();
    const updateConstructionSite = useUpdateConstructionSite(constructionSiteId);

    const {constrSite: constrSiteData, isLoading} = useFetchConstructionSiteById(constructionSiteId);

    const [constructionSite, setConstructionSite] = useState(constructionSiteInitState);

    function setAddress(address: string) {
        setConstructionSite({...constructionSite, address: address})
    }

    function setForeman(foremanId: string) {
        setConstructionSite({...constructionSite, foreman: parseInt(foremanId)})
    }

    useEffect(() => {
        setConstructionSite(constrSiteData ?? constructionSiteInitState);
    }, [constrSiteData])


    if (!isLoading) {
        return (
            <div className={style.Component + " translate-middle-x position-relative top-0 start-50 p-3 mt-5"}>
                <FormConstructionSite
                    constructionSite={constructionSite}
                    setForeman={setForeman}
                    setAddress={setAddress}
                    onSubmit={constructionSiteId ? updateConstructionSite.handleUpdate : createConstructionSite.handleCreate}
                />
            </div>
        );
    } else {
        return <Loader/>
    }

}

interface FormConstructionSiteProps {
    constructionSite: IConstructionSiteState,
    setForeman: (foremanId: string) => void,
    setAddress: (address: string) => void,
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

function FormConstructionSite({constructionSite, setForeman, setAddress, onSubmit}: FormConstructionSiteProps) {
    const navigate = useNavigate();

    return <form onSubmit={onSubmit}>
        <div>
            <label className={"w-100"}>
                <input
                    required={true}
                    className={"form-control"}
                    name={"address"}
                    value={constructionSite.address}
                    type="text"
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
        </div>
        <div className={"mt-2"}>
            <label className={"w-100"}>Прораб:
                <ForemanSelect foremanId={constructionSite.foreman} setForeman={setForeman}/>
            </label>
        </div>
        <div className={"mt-4 navbar"}>
            <span>
                <button
                    type="button"
                    onClick={() => navigate("/construction_sites")}
                    className={"btn btn-sm btn-primary"}
                >Отмена</button>
            </span>
            <span>
                <button
                    type="submit"
                    className={"btn btn-sm btn-success"}
                >Сохранить</button>
            </span>

        </div>
    </form>
}

interface ForemanSelectProps {
    foremanId?: number;
    setForeman: (foremanId: string) => void;
}

function ForemanSelect({foremanId, setForeman}: ForemanSelectProps) {
    const {foremanList} = useFetchForemanList();

    return <select
        name={"foreman"}
        className={"form-select"}
        defaultValue={foremanId}
        onChange={(e) => setForeman(e.target.value)}
    >
        <option value={undefined} selected={!!foremanId}></option>
        {foremanList?.map((foreman, index) => <option
            key={index}
            value={foreman.id}
            selected={foreman.id === foremanId}
        >{foreman.last_name} {foreman.first_name}</option>)
        }
    </select>
}
