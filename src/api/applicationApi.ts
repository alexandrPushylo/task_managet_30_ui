import {instance} from "./api";
import {useQuery} from "@tanstack/react-query";
import {PostTitle} from "../assets/assets";
import {useAppSelector} from "../store/store";
import {applicationSlice} from "../store/slices/applicationSlice";


interface IToday{
    date: string;
    weekday: string;
    day: number;
    month: number;
    year: number;
    month_name: string;
    status: boolean;
}
interface ICurrentDate{
    date: string;
    weekday: string;
    day: number;
    month: number;
    year: number;
    month_name: string;
    status: boolean;
}

export interface appDataDto {
    today: IToday;
    current_date: ICurrentDate;
    current_weekday?: string;
    prev_work_day?: string;
    next_work_day?: string;
    weekday?: string;
    view_mode?: "view_mode_future" | "view_mode_current" | "view_mode_archive"
    accept_mode?: boolean;
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
export interface WorkDaysDto{
    id: number;
    date: string;
    day: number;
    month: number;
    status: boolean;
    weekday: string;
}


export function useGetWorkDays() {
    const {data: workDays, isLoading, isError} = useQuery({
        queryKey: ['workDaysPaginator'],
        queryFn: async (meta) => {
            const response = await instance.get<WorkDaysDto[]>('/api/get_work_day/', {signal: meta.signal});
            return response.data;
        },
    })
    return {workDays, isLoading, isError};
}
export function useAppData(init?: { enabled?: boolean, current_day?:string }) {
    const currentDay = useAppSelector(applicationSlice.selectors.selectCurrentDay);
    const url_current_day = init?.current_day?`?current_day=${init?.current_day}`: `?current_day=${currentDay}`;
    const {data: appData, isLoading, isError, refetch} = useQuery({
        queryKey: ['appData', init?.current_day],
        queryFn: async (meta) => {
            const response = await instance.get<appDataDto>(`api/get_data/${url_current_day}`, {signal: meta.signal});
            return response.data;
        },
        // ...init,
        enabled: init?.enabled ?? true

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