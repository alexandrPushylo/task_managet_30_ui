import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {instance} from "./api";
import {useNavigate} from "react-router";
import {AcceptMode} from "../assets/assets";

export interface WorkDaysSheetDto{
    id: number;
    date: string;
    status: boolean;
    accept_mode: AcceptMode;
    isArchive: boolean;
    is_all_application_send: boolean;
    weekday: string;
}
export interface WorkDaySheetDto{
    id: number;
    date: string;
    status: boolean;
    accept_mode: AcceptMode;
    isArchive: boolean;
    is_all_application_send: boolean;
}

export interface IWorkDaysSheet{
    id?: string;
    date: string;
    status?: boolean;
    accept_mode?: AcceptMode;
    isArchive?: boolean;
    is_all_application_send?: boolean;
}


export function useFetchWorkDaysSheet() {
    const {data: workDays, isLoading, isError} = useQuery({
        queryKey: ['workDays', 'all'],
        queryFn: async (meta) => {
            const response = await instance.get<WorkDaysSheetDto[]>('/api/work_day_sheet/', {signal: meta.signal});
            return response.data;
        },
    })
    return {workDays, isLoading, isError};
}
export function useFetchWorkDaySheetById(id: string | undefined) {
    const {data: workDay, isLoading, isError, isPending} = useQuery({
        queryKey: ['workDays', 'workDay', 'byId', id],
        queryFn: async (meta) => {
            const response = await instance.get<WorkDaySheetDto>(`/api/work_day_sheet/${id}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!id,
    })
    return {workDay, isLoading, isError, isPending};
}


export function useUpdateWorkDay(id: number | string | undefined) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const  updateWorkDayMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.patch<IWorkDaysSheet>(`/api/work_day_sheet/${id}/`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newWorkDay) => {
            await queryClient.cancelQueries({queryKey: ['workDays', 'workDay', 'byId', id]});
            const prevWorkDay = queryClient.getQueriesData({queryKey:['workDays', 'workDay', 'byId', id]});
            queryClient.setQueriesData(
                {queryKey:['workDays', 'workDay', 'byId', id]}, newWorkDay);

            return {prevWorkDay};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['workDays', 'workDay', 'byId', id]}, context.prevWorkDay);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['workDays'],
            })
        },
        // async onSuccess(){
        //     await navigate("/construction_sites");
        // }

    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateWorkDayMutation.mutate({data:formData});
    };
    const togglesStatus = (status: boolean) => {
        const data = {status: !status}
        updateWorkDayMutation.mutate({data:data});
    }

    // const handleRestore = () => {
    //     const data = {isArchive: false, status: true}
    //     updateConstructionSiteMutation.mutate({data:data});
    // }

    return {handleUpdate, togglesStatus, isPending: updateWorkDayMutation.isPending};
}
