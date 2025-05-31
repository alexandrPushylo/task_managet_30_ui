import {useDeleteApplicationsToday} from "../../../api/ApplicationTodayApi";


interface ModalDeleteAppTodayProps {
    appTodayId?: number;
}
export default function ModalDeleteAppToday({appTodayId}:ModalDeleteAppTodayProps) {
    const {handleDelete} = useDeleteApplicationsToday(appTodayId);


    return <div className="modal fade"
             id={"delete_app" + appTodayId}
             data-bs-backdrop="static"
             data-bs-keyboard="false"
             tabIndex={-1}
             aria-labelledby="staticBackdropLabel"
             aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Удалить заявку</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                    <div className="modal-body m-0">
                        <p style={{textAlign: 'center'}}>Вы уверены, что хотите удалить данную заявку</p>
                    </div>

                    <div className="modal-footer" style={{justifyContent: "space-between"}}>
                        <button style={{textAlign: 'left'}}
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                    >Отмена
                    </button>

                    {appTodayId &&
                        <button onClick={handleDelete}
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                    >Удалить заявку</button>}
                </div>

            </div>
                </div>
        </div>

}

