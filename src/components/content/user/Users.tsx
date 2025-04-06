import React, {CSSProperties, useEffect} from 'react';
// import {IUsers} from "../../../assets/assets";
import {useNavigate} from "react-router";
import {useAppDispatch, useAppSelector, useAppStore} from "../../../store/store";
import {fetchUsers, IUserData, usersSlice} from "../../../store/slices/usersSlice";


const cssStyle: CSSProperties = {
    marginTop: '20px',
    maxWidth: 'min-content',
    border: '1px solid black',
}

function Users() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const appStore = useAppStore();

    useEffect(() => {
        const isDownloaded = usersSlice.selectors.selectIsDownloaded(appStore.getState());
        !isDownloaded &&
        dispatch(fetchUsers())
    }, [appStore, dispatch]);

    // const users2 = usersSlice.selectors.selectUsers(appStore.getState());
    const users = useAppSelector(usersSlice.selectors.selectUsers);
    const isLoading = useAppSelector(usersSlice.selectors.selectLoading);


    const toUser = (user_id: number) => {
        navigate("/user/" + user_id);
    }


    if (!isLoading) {
        return (
            <div className="container-sm" style={cssStyle}>
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
                    {users?.map((user: IUserData, index: number) => {
                        return (!user.isArchive &&
                            <tr key={user.id}
                                onClick={() => {
                                    toUser(user.id)
                                }}
                            >
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.post}</td>
                                <td>{user.telephone}</td>
                                {/*<td>{user.last_login}</td>*/}
                            </tr>
                        )
                    })}
                    </tbody>

                </table>

            </div>
        );
    } else {
        return (
            <div>Loading...</div>
        )
    }
}

export default Users;