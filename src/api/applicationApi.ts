import {instance} from "./api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {AcceptMode, PostTitle} from "../assets/assets";
import {useAppSelector} from "../store/store";
import {applicationSlice} from "../store/slices/applicationSlice";
import {useNavigate} from "react-router";
import {IUserData} from "./usersApi";


interface IToday{
    date: string;
    weekday: string;
    day: number;
    month: number;
    year: number;
    month_name: string;
    status: boolean;
}
export interface ICurrentDate{
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

export interface currentUserDto {
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
    is_show_panel: boolean;
    is_show_saved_app: boolean;
    is_show_absent_app: boolean;
    is_show_technic_app: boolean;
    is_show_material_app: boolean;
    filter_construction_site: number;
    filter_foreman: number;
    filter_technic: string | undefined;
    sort_by: string;
    color_title: string | undefined;
    font_size: number;
}
export interface WorkDaysDto{
    id: number;
    date: string;
    day: number;
    month: number;
    status: boolean;
    weekday: string;
}

interface ICurrentUserParam{
    id?: string;
    username?: string;
    first_name?: string | undefined;
    last_name?: string | undefined;
    password?: string;
    telephone?: string | undefined;
    isArchive?: boolean;
    post?: PostTitle;
    supervisor_user_id?: number | undefined;
    telegram_id_chat?: string | undefined;
    is_show_panel?: boolean;
    is_show_saved_app?: boolean;
    is_show_absent_app?: boolean;
    is_show_technic_app?: boolean;
    is_show_material_app?: boolean;
    filter_construction_site?: number;
    filter_foreman?: number;
    filter_technic?: string | undefined;
    sort_by?: string;
    color_title?: string | undefined;
    font_size?: number;
}


//  ============================================================================

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
export function useUpdateCurrentUser(userId: number | string | undefined) {
    const queryClient = useQueryClient();

    const  updateCurUserMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.patch<ICurrentUserParam>(`/api/user/${userId}/`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newCurUser) => {
            await queryClient.cancelQueries({queryKey: ['currentUser']});
            const prevCurUser = queryClient.getQueriesData({queryKey:['currentUser']});
            queryClient.setQueriesData(
                {queryKey:['currentUser']}, newCurUser);

            return {prevCurUser};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['currentUser']}, context.prevCurUser);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['currentUser'],
            })
        }

    });

    const toggle_is_show_panel = (is_show_panel: boolean) => {
        const data = {is_show_panel: !is_show_panel}
        updateCurUserMutation.mutate({data:data});
    }
    const toggle_is_show_saved_app = (is_show_saved_app: boolean) => {
        const data = {is_show_saved_app: !is_show_saved_app}
        updateCurUserMutation.mutate({data:data});
    }
    const toggle_is_show_absent_app = (is_show_absent_app: boolean) => {
        const data = {is_show_absent_app: !is_show_absent_app}
        updateCurUserMutation.mutate({data:data});
    }
    const toggle_is_show_technic_app = (is_show_technic_app: boolean) => {
        const data = {is_show_technic_app: !is_show_technic_app}
        updateCurUserMutation.mutate({data:data});
    }
    const toggle_is_show_material_app = (is_show_material_app: boolean) => {
        const data = {is_show_material_app: !is_show_material_app}
        updateCurUserMutation.mutate({data:data});
    }
    const set_filter_construction_site = (filter_construction_site: number | string) => {
        const data = {filter_construction_site: filter_construction_site}
        updateCurUserMutation.mutate({data: data});
    }
    const set_filter_foreman = (filter_foreman: number | string) => {
        const data = {filter_foreman: filter_foreman}
        updateCurUserMutation.mutate({data: data});
    }
    const set_filter_technic = (filter_technic: string | null) => {
        const data = {filter_technic: filter_technic}
        updateCurUserMutation.mutate({data: data});
    }
    const set_sort_by = (sort_by: string | null) => {
        const data = {sort_by: sort_by}
        updateCurUserMutation.mutate({data: data});
    }
    const set_color_title = (color_title: string | undefined) => {
        const data = {color_title: color_title ?? '#000000' }
        updateCurUserMutation.mutate({data: data});
    }
    const set_font_size = (font_size: number | undefined) => {
        const data = {font_size: font_size ?? 10}
        updateCurUserMutation.mutate({data: data});
    }

    return {
        toggle_is_show_panel,
        toggle_is_show_saved_app,
        toggle_is_show_absent_app,
        toggle_is_show_technic_app,
        toggle_is_show_material_app,
        set_filter_construction_site,
        set_filter_foreman,
        set_filter_technic,
        set_sort_by,
        set_color_title,
        set_font_size
    };
}


export function useUpdateAppData(current_day?: string) {
    const url_current_day = current_day?`?current_day=${current_day}`: '';
    const queryClient = useQueryClient();

    const  updateAppDataMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.put<AcceptMode>(`/api/spec/change_accept_mode/${url_current_day}`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newAppData) => {
            await queryClient.cancelQueries({queryKey: ['appData', current_day]});
            const prevAppData = queryClient.getQueriesData({queryKey:['appData', current_day]});
            queryClient.setQueriesData(
                {queryKey:['appData', current_day]}, newAppData);

            return {prevAppData};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['appData', current_day]}, context.prevAppData);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['appData', current_day],
            })
        }
    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateAppDataMutation.mutate({data:formData});
    };
    const setAcceptMode = (acceptModeStatus?: boolean) => {
        const data = {accept_mode: acceptModeStatus ? "off" : "manual"}
        updateAppDataMutation.mutate({data:data});
    }


    return {handleUpdate, setAcceptMode, isPending: updateAppDataMutation.isPending};
}
