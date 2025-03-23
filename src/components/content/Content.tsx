import React, {JSX, useEffect, useState} from 'react';
import {Route, Routes} from "react-router";
import Users from "./user/Users";
import Dashboard from "./dashboard/Dashboard";
import User from "./user/User";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {applicationSlice, fetchAppData} from "../../store/slices/applicationSlice";
import Login from "./Login";
import Logout from "./Logout";



function Content() {


    const isAuthenticated = useAppSelector(state=>applicationSlice.selectors.selectIsAuthenticated(state));
    const defComponent = (component: JSX.Element) => isAuthenticated ? component : <Login/>;

    return (
        <Routes>
            <Route path="/dashboard" element={defComponent(<Dashboard/>)}/>

            <Route path="/user/:userId" element={<User/>}/>
            <Route path="/users" element={<Users/>}/>

            <Route path="/logout" element={<Logout/>}/>
            <Route path="/login" element={<Login/>}/>

            <Route path="*" element={<Dashboard/>}/>
        </Routes>
    );
}

export default Content;