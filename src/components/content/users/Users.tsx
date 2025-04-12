import React from 'react';
import {useNavigate} from "react-router";
import {useFetchUsers, UsersDto} from "../../../api/usersApi";
import Loader from "../../loaders/Loader";
import style from "./Users.module.css";


function Users() {
    const navigate = useNavigate();
    const {users, isLoading} = useFetchUsers();

    const toUser = (user_id: number) => {
        navigate("/user/" + user_id);
    }

    if (!isLoading) {
        return (
            <div className={"container-sm " + style.Component}>
                <div><h3><u>Пользователи</u></h3></div>
                <table className="table table-hover" style={{width: 'min-content'}}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Username</th>
                        <th>Фамилия</th>
                        <th>Имя</th>
                        <th>Должность</th>
                        <th>Телефон</th>
                        {/*<th>Последний вход</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {users?.map((user, index: number) => {
                        return (!user.isArchive &&
                            <tr key={user.id}
                                onClick={() => {
                                    toUser(user.id);
                                }}
                            >
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.post}</td>
                                <td>{user.telephone}</td>
                                {/*<td>{users.last_login}</td>*/}
                            </tr>
                        )
                    })}
                    </tbody>

                </table>

            </div>
        );
    } else {
        return (
            <Loader/>
        )
    }
}

export default Users;