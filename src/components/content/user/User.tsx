import React, {CSSProperties, useEffect, useState} from 'react';
import {IForeman, IUser, IPosts, EUserPost, PostTitle} from "../../../assets/assets";
import {useNavigate, useParams} from "react-router";
import style from "./User.module.css";

import {
    useCreateUser, useDeleteUser,
    useFetchForemanList,
    useFetchUserById,
    useFetchUserPosts,
    useUpdateUser
} from "../../../api/usersApi";
import Loader from "../../loaders/Loader";
import {getEUserPost} from "../../../assets/services";

interface IUserState {
    id: number | undefined;
    username: string;
    first_name: string | undefined;
    last_name: string | undefined;
    password: string;
    telephone: string | undefined;
    isArchive: boolean;
    post: PostTitle;
    supervisor_user_id: number | undefined;
    telegram_id_chat: string | undefined;
}

const userInitState: IUserState = {
    "id": undefined,
    "username": '',
    "password": '',
    "first_name": '',
    "last_name": '',
    "telephone": '',
    "telegram_id_chat": '',
    "post": EUserPost.EMPLOYEE,
    "supervisor_user_id": undefined,
    "isArchive": false,
}


function User() {

    const navigate = useNavigate();
    const {userId} = useParams<{ userId: string }>()
    const title = userId ? "Изменить пользователя" : "Добавить пользователя"

    const createUser = useCreateUser();
    const updateUser = useUpdateUser(userId);
    const deleteUser = useDeleteUser(userId);

    const {user: userData, isLoading} = useFetchUserById(userId);
    const {foremanList} = useFetchForemanList();
    const {posts} = useFetchUserPosts();


    const [user, setUser] = useState(userInitState);

    useEffect(() => {
        setUser(userData ?? userInitState)
    }, [userData]);

    const isMaster = (user.post === EUserPost.MASTER);


    if (isLoading) {
        return <Loader/>;
    }

    return (
        <div className={"container " + style.Component}>
            <div><h3><u>{title}</u></h3></div>
            {
                <form method="post" onSubmit={userId ? updateUser.handleUpdate : createUser.handleCreate}>
                    <div>
                        <label>
                            <input type="text" className="form-control" placeholder="напр: Петров" required
                                   onChange={(e) => {
                                       setUser({...user, username: e.target.value})
                                   }}
                                   name="username" value={user.username}
                            />
                        </label>
                    </div>
                    <div>
                        <label>Пароль*
                            <input type="password" className="form-control" placeholder="1234" required
                                   onChange={e => {
                                       setUser({...user, password: e.target.value})
                                   }}
                                   name="password" value={user.password}
                            />
                        </label>
                    </div>

                    <div>
                        <label>Имя*
                            <input type="text" className="form-control" name="first_name"
                                   onChange={(e) => {
                                       setUser({...user, first_name: e.target.value})
                                   }}
                                   value={user.first_name}
                                   placeholder="Петр" required/>
                        </label>
                    </div>
                    <div>
                        <label>Фамилия*
                            <input type="text" className="form-control" name="last_name"
                                   onChange={(e) => {
                                       setUser({...user, last_name: e.target.value})
                                   }}
                                   value={user.last_name}
                                   placeholder="напр: Петров" required/>
                        </label>
                    </div>
                    <div>
                        <label>Телефон
                            <span style={{margin: '0', fontWeight: 'normal', fontSize: "8pt"}}>
                                <span> в формате: +375291234567</span>
                            </span>
                            <input type="tel" className="form-control" name="telephone"
                                   onChange={event => setUser({...user, telephone: event.target.value})}
                                   value={user.telephone}
                                   placeholder="+375(25)1234567"
                            />
                        </label>
                    </div>
                    <div className="mt-2">
                        <label>Должность
                            <select name="post" className="form-control"
                                    defaultValue={user.post}
                                    onChange={e => setUser({...user, post: getEUserPost(e.target.value)})}
                            >
                                {posts?.map((post: IPosts, index) => {
                                    return (
                                        <option
                                            value={post.title}
                                            key={index}
                                            selected={user.post === post.title}
                                        >{post.description}</option>
                                    )
                                })
                                }
                            </select>
                        </label>
                    </div>

                    {isMaster &&
                        <div className="mt-2">
                            <label>Прораб
                                <select name="supervisor_user_id" className="form-control"
                                        required={true}
                                        defaultValue={user.supervisor_user_id}
                                        onChange={e => setUser({
                                            ...user,
                                            supervisor_user_id: parseInt(e.target.value)
                                        })}
                                >
                                    <option key={"01"} value={undefined}></option>
                                    {foremanList?.map((foreman: IUserState) => {
                                        return (
                                            <option
                                                key={foreman.id}
                                                value={foreman.id}
                                                selected={user.supervisor_user_id === foreman.id}
                                            >{foreman.last_name} {foreman.first_name}</option>
                                        )
                                    })}
                                </select>
                            </label>
                        </div>}


                    <div className="mt-4 navbar">
                        {userId &&
                            <span>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={deleteUser.handleDelete}
                                >Удалить</button>
                            </span>
                        }

                        <span>
                            <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => navigate("/users")}
                            >Отмена</button>
                        </span>
                        <span>
                            <button
                                type="submit"
                                className="btn btn-sm btn-success"
                            >Сохранить</button>
                        </span>
                    </div>
                </form>}
        </div>
    );

}

export default User;