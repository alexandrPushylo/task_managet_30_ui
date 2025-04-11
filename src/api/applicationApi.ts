import {instance} from "./api";
import {useQuery} from "@tanstack/react-query";
import {PostTitle} from "../assets/assets";

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
        first_name: string | undefined;
        last_name: string | undefined;
        password: string;
        telephone: string | undefined;
        isArchive: boolean;
        post: string;
        supervisor_user_id: number | undefined;
        telegram_id_chat: string | undefined;
    };
}

interface appDataDto {
    today?: string;
    "current_weekday"?: string;
    "prev_work_day"?: string;
    "next_work_day"?: string;
    "weekday"?: string;
    "view_mode"?: "view_mode_future" | "view_mode_current" | "view_mode_archive"
    "accept_mode"?: boolean;
}

interface currentUserDto {
    id: number;
    username: string;
    first_name: string | undefined;
    last_name: string | undefined;
    password: string;
    telephone: string | undefined;
    isArchive: boolean;
    post: PostTitle;
    supervisor_user_id: number | undefined;
    telegram_id_chat: string | undefined;
}


export function useAppData(init?: { enabled: boolean }) {
    const {data: appData, isLoading, isError, refetch} = useQuery({
        queryKey: ['appData'],
        queryFn: async (meta) => {
            const response = await instance.get<appDataDto>('api/get_data', {signal: meta.signal});
            return response.data;
        },
        // ...init,
        enabled: init?.enabled ?? false

    })
    return {appData, isLoading, isError, refetch};
}

export function useCurrentUser() {
    const {data: currentUser, isLoading, isError, refetch} = useQuery({
        queryKey: ['currentUser'],
        queryFn: async (meta) => {
            const response = await instance.get<currentUserDto>('api/get_current_user', {signal: meta.signal});
            return response.data;
        },

    })
    return {currentUser, isLoading, isError, refetch};
}