import React, {CSSProperties, useEffect, useState} from 'react';
import {IUsers} from "../../../assets/assets";
import {instance} from "../../../api/api";
import {useNavigate} from "react-router";


const cssStyle:CSSProperties = {
    marginTop: '20px',
    maxWidth: 'min-content',
    border: '1px solid black',
}

function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<IUsers[]>([])

    const toUser = (user_id: number)=>{
        navigate("/user/"+user_id);
    }


    useEffect(() => {
            instance.get('/api/user').then((response)=>{
                if (response.status === 200){
                    setUsers(response.data.users);
                }
            })
    }, []);

    return (
        <div className="container-sm" style={cssStyle}>
            <div><h3><u>Пользователи</u></h3></div>
            <table className="table table-hover" style={{width: 'min-content'}}>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Должность</th>
                    <th>Телефон</th>
                    <th>Последний вход</th>
                </tr>
                </thead>
                <tbody>
                {/*{users.map((user, index)=>{*/}
                {/*    return (!user.isArchive &&*/}
                {/*            <tr key={user.id}*/}
                {/*                onClick={()=>{toUser(user.id)}}*/}
                {/*            >*/}
                {/*                <td>{user.username}</td>*/}
                {/*                <td>{user.first_name}</td>*/}
                {/*                <td>{user.last_name}</td>*/}
                {/*                <td>{user.post}</td>*/}
                {/*                <td>{user.telephone}</td>*/}
                {/*                <td>{user.last_login}</td>*/}
                {/*            </tr>*/}
                {/*    )*/}
                {/*})}*/}
                </tbody>

            </table>

        </div>
    );
}

export default Users;