import React, {useEffect, useState} from 'react';
import {applicationSlice, fetchLogin} from "../../store/slices/applicationSlice";
import {useAppDispatch, useAppSelector, useAppStore} from "../../store/store";
import {useNavigate} from "react-router";


const loginStyle = {
    maxWidth: '20rem',
    padding: '5px 5px 5px 10px',
    borderRadius: '10px',
    boxShadow: '5px 5px 20px 5px'
}
const labelStyle = {
    fontWeight: 'bolder'
}



function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        dispatch(fetchLogin({username: username, password:password}))
            // .then(() => {
            //     dispatch(fetchToken())
            // })
            // .then(()=> {
            //     dispatch(fetchAppData());
            //     })
            .then(()=>{
                navigate("/dashboard/");
                })


    }

    return (
        <div className="translate-middle-x position-relative start-50 mt-5" style={loginStyle}>
            <form method='post'>
                <div>
                    <label className="w-100" style={labelStyle}>Логин (Фамилия или телефон)
                        <input type="text" className="form-control" name="username"
                               placeholder="напр: Петров или 1234567"
                               value={username}
                               onChange={(e) => {
                                   setUsername(e.target.value)
                               }}
                        />
                    </label>
                </div>
                <div>
                    <label className="w-100" style={labelStyle}>Пароль
                        <input type="password" className="form-control"
                               name="password" placeholder="1234"
                               value={password}
                               onChange={e => {
                                   setPassword(e.target.value)
                               }}
                        />
                    </label>
                </div>
                <br/>
                <div className="navbar">
                    <a href="#" className="small">Забыли пароль</a>
                    <span style={{textAlign: 'right'}}
                    ><button type="submit" className="btn btn-success"
                             onClick={onSubmit}
                    >Вход</button></span>
                </div>
            </form>
        </div>
    );
}

export default Login;