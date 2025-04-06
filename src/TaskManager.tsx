import React, {useEffect, useState, createContext, useMemo} from 'react';
import {BrowserRouter} from "react-router";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Content from "./components/content/Content";
import Login from "./components/content/Login";
import {applicationData} from "./assets/assets";
import {useAppDispatch, useAppSelector, useAppStore} from "./store/store";
import {applicationSlice, fetchAppData} from "./store/slices/applicationSlice";


function TaskManager() {

    const dispatch = useAppDispatch();
    const appStore = useAppStore();

    useEffect(() => {
        const isDownloaded = applicationSlice.selectors.selectIsDownloaded(appStore.getState());
        !isDownloaded&&
        dispatch(fetchAppData())
    }, [appStore, dispatch]);

    return (
        <div className="App">
            <BrowserRouter>
                    <Header/>
                    <Content/>
                    <Footer/>
            </BrowserRouter>
        </div>
    );
}

export default TaskManager;
