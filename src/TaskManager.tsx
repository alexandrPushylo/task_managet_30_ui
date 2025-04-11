import React, {useEffect, useState, createContext, useMemo} from 'react';
import {BrowserRouter} from "react-router";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Content from "./components/content/Content";
import Login from "./components/content/Login";
import {applicationData} from "./assets/assets";
import {useAppDispatch, useAppSelector, useAppStore} from "./store/store";
import {applicationSlice, fetchIsAuthenticated} from "./store/slices/applicationSlice";
import {useAppData} from "./api/applicationApi";
import {useStore} from "react-redux";
import Loader from "./components/loaders/Loader";


function TaskManager() {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchIsAuthenticated())
    }, [dispatch]);

    const isAuthenticated = useAppSelector(applicationSlice.selectors.selectIsAuthenticated);
    const {isLoading} = useAppData({enabled: isAuthenticated});


    return (
        <div className="App">
            <BrowserRouter>
                <Header/>
                {!isAuthenticated ? <Login/> : isLoading ? <Loader/> : <Content/>}
                <Footer/>
            </BrowserRouter>
        </div>
    );
}

export default TaskManager;
