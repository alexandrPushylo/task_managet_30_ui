import {BaseQueryArg} from "@reduxjs/toolkit/query";
import {PostTitle} from "../assets/assets";


interface IUserData {
        id: number;
        username: string;
        first_name: string|undefined;
        last_name: string|undefined;
        password: string;
        telephone: string|undefined;
        isArchive: boolean;
        post: PostTitle;
        supervisor_user_id: number|null;
        telegram_id_chat: string|undefined;

}
//
// export const userDataApi = baseApi.injectEndpoints({
//     endpoints: (create) => ({
//         getUsersData: create.query<IUserData[], void>({
//             query: () => ({url: "/user"}),
//             providesTags: ["userData"],
//         }),
//         getUserData: create.query<IUserData, string>({
//             query: (userId) => ({url: `/user/${userId}`}),
//             providesTags: ["userData"],
//         })
//     }),
//     overrideExisting: true
//
// })
//
