import React from 'react';
import {useCurrentUser, useUpdateCurrentUser} from "../../api/applicationApi";

export default function ButtonViewProps() {
    return <>
        <button
            type="button"
            className="ms-1 btn btn-sm btn-outline-success"
            data-bs-toggle="modal"
            data-bs-target="#view_props"
        >Настройки отображения
        </button>
        <ModalViewProps/>
    </>
}

function ModalViewProps() {
    const {currentUser} = useCurrentUser();
    const updateUser = useUpdateCurrentUser(currentUser?.id)
    const post = currentUser?.post;
    return <div className="modal fade"
                id="view_props"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1}
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
    >
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Настройки отображения</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>

                {(post && 'administrator foreman master employee'.includes(post)) &&
                    <div className="modal-body form-switch" style={{textAlign: 'left'}}>

                        {post === 'administrator' &&
                            <div>
                                <input type="checkbox"
                                       role="switch"
                                       className="form-check-input mx-1"
                                       onChange={e => {updateUser.toggle_is_show_saved_app(currentUser.is_show_saved_app)}}
                                       checked={currentUser.is_show_saved_app}
                                />
                                <span className="ms-2">Показывать сохраненные заявки</span>
                            </div>
                        }
                        {post === 'administrator' &&
                            <div>
                                <input type="checkbox"
                                       role="switch"
                                       className="form-check-input mx-1"
                                       checked={currentUser.is_show_absent_app}
                                       onChange={event => updateUser.toggle_is_show_absent_app(currentUser.is_show_absent_app)}
                                />
                                <span className="ms-2">Показывать отсутствующие заявки</span>
                            </div>
                        }
                        <div>
                            <input type="checkbox"
                                   role="switch"
                                   className="form-check-input mx-1"
                                   checked={currentUser.is_show_technic_app}
                                   onChange={event => updateUser.toggle_is_show_technic_app(currentUser.is_show_technic_app)}
                            />
                            <span className="ms-2">Показывать заявки на технику</span>
                        </div>
                        <div>
                            <input type="checkbox"
                                   role="switch"
                                   className="form-check-input mx-1"
                                   checked={currentUser.is_show_material_app}
                                   onChange={event => updateUser.toggle_is_show_material_app(currentUser.is_show_material_app)}
                            />
                            <span className="ms-2">Показывать заявки на материалы</span>
                        </div>
                    </div>
                }

                <div className="mb-1 mt-1" style={{textAlign: 'left'}}>
                    <input type="color"
                           className="form-control-color ms-3 p-0"
                           value={currentUser?.color_title}
                           onChange={event => updateUser.set_color_title(event.target.value)}
                    />
                    <span className="ms-2">Цвет названия объекта</span>
                </div>

                <div className="mb-1" style={{textAlign: 'left'}}>
                    <input type="number"
                           style={{width: 'max-content', display: 'inline'}}
                           className="form-control ms-3"
                           min={6}
                           max={20}
                           value={currentUser?.font_size}
                           onChange={event => updateUser.set_font_size(parseInt(event.target.value))}
                    />
                    <span className="ms-2">Размер шрифта для заявки</span>
                </div>


                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                    <button type="button"
                            className="btn btn-primary"
                            onClick={() => {
                            }}>Сохранить
                    </button>
                </div>
            </div>
        </div>
    </div>
}