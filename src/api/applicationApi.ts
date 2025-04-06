// import {baseApi} from "./api";
import {BaseQueryArg} from "@reduxjs/toolkit/query";

interface IApplicationData {
    today?: string;
    "current_weekday"?: string;
    "prev_work_day"?: string;
    "next_work_day"?: string;
    "weekday"?: string;
    "view_mode"?: "view_mode_future" | "view_mode_current" | "view_mode_archive"
    "accept_mode"?: boolean;
    "is_authenticated": boolean;
    "current_user"?: {
        id: number;
        username: string;
        first_name: string|undefined;
        last_name: string|undefined;
        password: string;
        telephone: string|undefined;
        isArchive: boolean;
        post: string;
        supervisor_user_id: number|undefined;
        telegram_id_chat: string|undefined;
    };
}
/*
export const appDataApi = baseApi.injectEndpoints({
    endpoints: (create) => ({
        getAppData: create.query<IApplicationData, void>({
            query: () => ({url: "/get_data"}),
            providesTags: ["appData"],
        }),
        login: create.mutation<any, {username: string, password:string}>({
            query: (body) => ({
                url: "http://192.168.1.42:8000/api/login/",
                method: "POST",
                body: body,
            }),
            invalidatesTags: ["appData"]
        })


    }),
    overrideExisting: true

})

*/