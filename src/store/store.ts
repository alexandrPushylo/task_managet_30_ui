import {configureStore, createSelector, ThunkAction, UnknownAction} from "@reduxjs/toolkit";
import {applicationSlice} from "./slices/applicationSlice";
import {useDispatch, useSelector, useStore} from "react-redux";
import {usersSlice} from "./slices/usersSlice";
import {technicsSlice} from "./slices/technicsSlice";


export const extraArgument = {

};

export const store = configureStore({
    reducer: {
        application: applicationSlice.reducer,
        users: usersSlice.reducer,
        technics: technicsSlice.reducer
        // [baseApi.reducerPath]: baseApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        {thunk: {extraArgument}}),
        // .concat(
        //     baseApi.middleware
        // ),
    devTools: true


})



export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppSelector = createSelector.withTypes<AppState>;

// export type AppThunk<R = void> = ThunkAction<R, AppState, any, UnknownAction>

