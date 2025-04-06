import React, {CSSProperties, useEffect, useState} from 'react';
import {IForeman, IUser, IPosts, EUserPost} from "../../../assets/assets";
import {useNavigate, useParams} from "react-router";
import {useAppDispatch, useAppSelector, useAppStore} from "../../../store/store";
import {
    createUser,
    deleteUser,
    fetchUserPost,
    IUserData,
    updateUser,
    usersSlice
} from "../../../store/slices/usersSlice";


const cssStyle: CSSProperties = {
    marginTop: '20px',
    width: 'max-content',
    border: '1px solid black',
    padding: '15px',
    borderRadius: '2%',
    boxShadow: '5px 5px 20px 5px'
}

const userInitState = {
    "id": undefined,
    "username": '',
    "password": '',
    "first_name": '',
    "last_name": '',
    "telephone": '',
    "telegram_id_chat": null,
    "post": 'employee',
    "supervisor_user_id": undefined,
    "isArchive": false,
}



function User() {
    const dispatch = useAppDispatch();
    const appStore = useAppStore();
    const navigate = useNavigate();
    const {userId} = useParams<{ userId: string }>()
    const title = userId ? "Изменить пользователя" : "Добавить пользователя"

    const [userData] = useAppSelector(state => usersSlice.selectors.selectUserById(state, userId))
    const foremanList = useAppSelector(state => usersSlice.selectors.selectForeman(state))
    const posts = useAppSelector(state => usersSlice.selectors.selectUserPost(state))
    const isLoading = useAppSelector(state => usersSlice.selectors.selectLoading(state));

    const [user, setUser] = useState({
        ...userInitState,
        id: userData?.id,
        username: userData?.username,
        password: userData?.password,
        first_name: userData?.first_name,
        last_name: userData?.last_name,
        telephone: userData?.telephone,
        telegram_id_chat: userData?.telegram_id_chat,
        post: userData ? userData.post : 'employee',
        supervisor_user_id: userData?.supervisor_user_id,
        isArchive: userData?.isArchive,

    })

    useEffect(() => {
        dispatch(fetchUserPost())
    }, [dispatch]);


    const isMaster = (user && user?.post === EUserPost.MASTER);


    function removeUser(userId: string) {
        dispatch(deleteUser(userId))
            .then(() => navigate("/users"))
    }

    function saveUser(userId: string | undefined, user: IUserData) {
        if (userId) {
            dispatch(updateUser({userId: userId, user: user}))
                .then(() => navigate("/users"));
        } else {
            dispatch(createUser(user))
                .then(() => navigate("/users"));
        }
    }

    if (!isLoading) {
        return (
            <div className="container" style={cssStyle}>
                <div><h3><u>{title}</u></h3></div>
                {
                    <form method="post">
                        <div>
                            <label>
                                <input type="text" className="form-control" placeholder="напр: Петров" required
                                       onChange={(e) => {
                                           setUser({...user, username: e.target.value})
                                       }}
                                       name="username" value={user && user.username}
                                />
                            </label>
                        </div>
                        <div>
                            <label>Пароль*
                                <input type="password" className="form-control" placeholder="1234" required
                                       onChange={e => {
                                           setUser({...user, password: e.target.value})
                                       }}
                                       name="password" value={user && user.password}
                                />
                            </label>
                        </div>

                        <div>
                            <label>Имя*
                                <input type="text" className="form-control" name="first_name"
                                       onChange={(e) => {
                                           setUser({...user, first_name: e.target.value})
                                       }}
                                       value={user && user.first_name}
                                       placeholder="Петр" required/>
                            </label>
                        </div>
                        <div>
                            <label>Фамилия*
                                <input type="text" className="form-control" name="last_name"
                                       onChange={(e) => {
                                           setUser({...user, last_name: e.target.value})
                                       }}
                                       value={user && user.last_name}
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
                                       value={user && user.telephone}
                                       placeholder="+375(25)1234567"
                                />
                            </label>
                        </div>
                        <div className="mt-2">
                            <label>Должность
                                <select name="post" className="form-control"
                                        defaultValue={'employee'}
                                        onChange={e => setUser({...user, post: e.target.value})}
                                >
                                    {posts?.map((post: IPosts, index) => {
                                        return (
                                            <option
                                                value={post.title}
                                                key={index}
                                                selected={user?.post === post.title}
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
                                            defaultValue={undefined}
                                            onChange={e => setUser({
                                                ...user,
                                                supervisor_user_id: parseInt(e.target.value)
                                            })}
                                    >
                                        {foremanList?.map((foreman: IUserData) => {
                                            return (
                                                <option
                                                    key={foreman.id}
                                                    value={foreman.id}
                                                    selected={user && user?.supervisor_user_id === foreman.id}
                                                >{foreman.last_name} {foreman.first_name}</option>
                                            )
                                        })}
                                    </select>
                                </label>
                            </div>}


                        <div className="mt-4 navbar">
                            {userId &&
                                <span>
                            <button type="button" className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeUser(userId)}
                            >Удалить</button>
                        </span>
                            }

                            <span>
                            <button type="button" className="btn btn-sm btn-primary"
                                    onClick={() => navigate("/users")}
                            >Отмена</button>
                        </span>
                            <span>
                            <button type="button" className="btn btn-sm btn-success"
                                    onClick={() => saveUser(userId, user)}
                            >Сохранить</button>
                        </span>

                        </div>


                    </form>}
            </div>
        );
    } else {
        return (
            <div>Loading...</div>
        )
    }


}

export default User;