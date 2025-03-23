import {configureStore, createSelector, ThunkAction, UnknownAction} from "@reduxjs/toolkit";
import {applicationSlice} from "./slices/applicationSlice";
import {useDispatch, useSelector, useStore} from "react-redux";


export const store = configureStore({
    reducer: {
        application: applicationSlice.reducer,
    },
    devTools: true

})



export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppSelector = createSelector.withTypes<AppState>;

export type AppThunk<R = void> = ThunkAction<R, AppState, any, UnknownAction>