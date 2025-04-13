import React, {JSX} from 'react';
import style from "./ConstructionSites.module.css";
import {useNavigate} from "react-router";
import Loader from "../../loaders/Loader";
import {
    ConstructionSiteDto, useDeleteConstructionSite,
    useFetchConstructionSites,
    useUpdateConstructionSite
} from "../../../api/constructionSiteApi";
import {useFetchForemanList} from "../../../api/usersApi";


interface ConstructionSitesProps {
    isArchivePage?: boolean;
}

export default function ConstructionSites({isArchivePage}: ConstructionSitesProps): JSX.Element {
    const {constrSites, isLoading} = useFetchConstructionSites();

    if (!isLoading) {
        return (
            <div className={style.Component + " container-fluid position-relative translate-middle-x start-50"}>
                <div className={style.Title}>
                    {!isArchivePage ?
                        <span>Строительные объекты</span> :
                        <span>Архив объектов</span>
                    }
                </div>

                <div className="row align-items-center">
                    {constrSites &&
                        constrSites.map((constrSiteItem, index) => {
                            if (!isArchivePage) {
                                return !constrSiteItem.isArchive &&
                                    <ConstructionSiteItem
                                        key={index}
                                        constrSiteItem={constrSiteItem}
                                        isArchivePage={isArchivePage}
                                    />
                            } else {
                                return constrSiteItem.isArchive &&
                                    <ConstructionSiteItem
                                        key={index}
                                        constrSiteItem={constrSiteItem}
                                        isArchivePage={isArchivePage}
                                    />
                            }
                        })
                    }
                </div>


            </div>
        );
    } else {
        return <Loader/>
    }
}

interface ConstructionSiteItemProps {
    constrSiteItem: ConstructionSiteDto;
    isArchivePage?: boolean;
}

function ConstructionSiteItem({constrSiteItem, isArchivePage}: ConstructionSiteItemProps) {
    const {toggleDisplay, handleRestore} = useUpdateConstructionSite(constrSiteItem.id)
    const deleteConstructionSite = useDeleteConstructionSite(constrSiteItem.id)
    const navigate = useNavigate();

    return <div className={style.ConstructionSiteContainer}>
        <div className={style.ConstructionSiteItem + " card m-2 shadow-lg"}>
            <div className="card-body p-1">
                <div className="card-header p-1">
                    <span className={"fw-bolder"}>{constrSiteItem.address}</span>

                    {isArchivePage && <>
                        <br/>
                        <span className={"form-text small"}>Дата удаления: </span>
                        <span>{constrSiteItem.deleted_date}</span>
                    </>
                    }

                    <hr className={"m-0"}/>
                    {constrSiteItem.foreman &&
                        <ForemanItem foremanId={constrSiteItem.foreman}/>
                    }
                </div>

                {constrSiteItem.status ?
                    <hr className={style.showed_item}/> :
                    <hr className={style.hidden_item}/>
                }

                <div className={"navbar m-1"}>
                    <span>
                        <button
                            className={isArchivePage ? "btn btn-sm btn-outline-success" : "btn btn-sm btn-outline-danger"}
                            onClick={isArchivePage ? handleRestore : deleteConstructionSite.handleDelete}
                        >{isArchivePage ? "Восстановить" : "Удалить"}</button>
                    </span>


                    {!isArchivePage &&
                        <span>
                            <button
                                onClick={() => navigate(`/construction_site/${constrSiteItem.id}`)}
                                className={"btn btn-sm btn-outline-primary"}
                            >Изменить</button>
                        </span>
                    }
                    {!isArchivePage &&
                        <span>
                            <button
                                onClick={() => toggleDisplay(!constrSiteItem.status)}
                                className={constrSiteItem.status ? "btn btn-sm btn-outline-danger" : "btn btn-sm btn-outline-success"}
                            >{constrSiteItem.status ? "Скрыть" : "Отобразить"}</button>
                        </span>
                    }

                </div>

            </div>
        </div>

    </div>
}

interface ForemanItemProps {
    foremanId: number;
}

function ForemanItem({foremanId}: ForemanItemProps) {
    const {foremanList} = useFetchForemanList();
    const foreman = foremanList && foremanList.find((foreman) => foreman.id === foremanId);
    return <>
    <span className={"form-text small"}>Прораб:</span>&nbsp;
        <span>{foreman?.last_name}</span>&nbsp;
        <span>{foreman?.first_name}</span>
    </>
}
