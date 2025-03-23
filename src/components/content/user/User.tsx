import React, {CSSProperties, useEffect, useState} from 'react';
import {IForeman, IUser, IPosts, EUserPost} from "../../../assets/assets";
import {instance} from "../../../api/api";
import {useNavigate, useParams} from "react-router";


const cssStyle: CSSProperties = {
    marginTop: '20px',
    width: 'max-content',
    border: '1px solid black',
    padding: '15px',
    borderRadius: '2%',
    boxShadow: '5px 5px 20px 5px'
}

const userInitState: IUser = {
    "id": undefined,
    "username": '',
    "password": '',
    "first_name": '',
    "last_name": '',
    "telephone": '',
    "telegram_id_chat": BigInt(0),
    "post": '',
    "supervisor_user_id": 0,
    "isArchive": false,
    "last_login": '',
    "is_show_panel": false,
    "is_show_saved_app": true,
    "is_show_absent_app": true,
    "is_show_technic_app": true,
    "is_show_material_app": true,
    "filter_construction_site": '',
    "filter_foreman": '',
    "filter_technic": '',
    "sort_by": '',
    "color_title": '',
    "font_size": '',
}

function User() {
    const navigate = useNavigate();
    const {userId} = useParams()
    const title = userId ? "Изменить пользователя" : "Добавить пользователя"

    const [user, setUser] = useState<IUser>(userInitState)
    const [foremans, setForemans] = useState<IForeman[]>([])
    const [posts, setPosts] = useState<IPosts[]>([{title: "employee", description: "Работник"}])
    const isMaster = (user && user?.post === EUserPost.MASTER);

    useEffect(() => {
        instance.get('/api/user' + userId).then((response) => {
            if (response.status === 200) {
                setUser(response.data);
            }
        })
    }, [userId]);
    // useEffect(() => {
    //     instance.get('/api/foreman').then((response) => {
    //         if (response.status === 200) {
    //             setForemans(response.data)
    //         }
    //     })
    // }, []);
    // useEffect(() => {
    //     instance.get('/api/user_posts').then((response) => {
    //         if (response.status === 200) {
    //             setPosts(response.data)
    //         }
    //     })
    // }, []);

    function deleteUser(id: string) {
        const user_Id = parseInt(id);
        // console.log(user_Id);

        instance.get('/api/delete_user/' + user_Id).then((response) => {
            if (response.status === 200) {
                navigate("/users")
            }
        })


    }

    function saveUser(){
        instance.post('/api/edit_user/77', JSON.stringify(user)).then((response) => {
            if (response.status === 200) {
                console.log(response.data)
            }
        })
    }

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
                                   name="username" value={user && user.username}/>
                        </label>
                    </div>
                    <div>
                        <label>Пароль*
                            <input type="password" className="form-control" placeholder="1234" required
                                   onChange={e => {
                                       setUser({...user, password: e.target.value})
                                   }}
                                   name="password" value={user && user.password}/>
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
                                   value={user && user.telephone} placeholder="+375(25)1234567"
                            />
                        </label>
                    </div>
                    <div className="mt-2">
                        <label>Должность
                            <select name="post" className="form-control"
                                    defaultValue={'employee'}
                                    onChange={e => setUser({...user, post: e.target.value})}
                            >
                                {posts.map((post: IPosts, index) => {
                                    const selected = (user && user?.post === post.title);
                                    return (
                                        <option
                                            value={post.title}
                                            key={index}
                                            selected={selected}
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
                                        onChange={e => setUser({...user, supervisor_user_id: parseInt(e.target.value)})}
                                >
                                    {foremans.map((foreman: IForeman) => {
                                        const selected = (user && user?.supervisor_user_id === foreman.id);
                                        return (
                                            <option
                                                key={foreman.id}
                                                value={foreman.id}
                                                selected={selected}
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
                                    onClick={()=>deleteUser(userId)}
                            >Удалить</button>
                        </span>
                        }

                        <span>
                            <button type="button" className="btn btn-sm btn-primary"
                                    onClick={()=>navigate("/users")}
                            >Отмена</button>
                        </span>
                        <span>
                            <button type="button" className="btn btn-sm btn-success"
                                    onClick={()=>saveUser()}
                            >Сохранить</button>
                        </span>

                    </div>


                </form>}
        </div>
    );
}

export default User;