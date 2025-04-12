import React, {useEffect} from 'react';
import {useAppDispatch} from "../../store/store";
import {fetchLogout} from "../../store/slices/applicationSlice";
import {useNavigate} from "react-router";

function Logout() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchLogout()).then(()=>{
            navigate('/login/');
        })
    }, [dispatch, navigate]);

    return (
        <div>LOGOUT</div>
    );
}

export default Logout;