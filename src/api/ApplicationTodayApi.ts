import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {instance} from "./api";
import {useNavigate} from "react-router";
import {AppTodayStatus} from "../assets/assets";


export interface ApplicationTodayDto {
    id: number;
    construction_site: number;
    status: AppTodayStatus;
    description: string;
    date: number;
    isArchive: boolean;
}
export interface IApplicationToday {
    id?: string;
    construction_site: string;
    status?: AppTodayStatus;
    description?: string;
    date: number;
    isArchive?: boolean;
}

export function useFetchApplicationsToday(current_day?: string) {
    const url_current_day = current_day?`?current_day=${current_day}`: '';
    const {data: appsToday, isLoading, isError} = useQuery({
        queryKey: ['applicationsToday', 'all', current_day],
        queryFn: async (meta) => {
            const response = await instance.get<ApplicationTodayDto[]>(`/api/applications_today/${url_current_day}`, {signal: meta.signal});
            return response.data;
        },
    })
    return {appsToday, isLoading, isError};
}
export function useFetchApplicationsTodayById(id: string | undefined) {
    const {data: appToday, isLoading, isError, isPending} = useQuery({
        queryKey: ['applicationsToday', 'applicationToday', 'byId', id],
        queryFn: async (meta) => {
            const response = await instance.get<ApplicationTodayDto>(`/api/application_today/${id}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!id,
    })
    return {appToday, isLoading, isError, isPending};
}
export function useUpdateApplicationsToday(id: number | string | undefined) {
    const queryClient = useQueryClient();

    const  updateApplicationsTodayMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.patch<IApplicationToday>(`/api/application_today/${id}/`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newApplicationsToday) => {
            await queryClient.cancelQueries({queryKey: ['technicSheets', 'technicSheet', 'byId', id]});
            const prevApplicationsToday = queryClient.getQueriesData({queryKey:['technicSheets', 'technicSheet', 'byId', id]});
            queryClient.setQueriesData(
                {queryKey:['applicationsToday', 'applicationToday', 'byId', id]}, newApplicationsToday);

            return {prevApplicationsToday};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['applicationsToday', 'applicationToday', 'byId', id]}, context.prevApplicationsToday);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['applicationsToday'],
            })
        }
    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateApplicationsTodayMutation.mutate({data:formData});
    };
    const setStatus = (status?: AppTodayStatus) => {
        const data = {status: status}
        updateApplicationsTodayMutation.mutate({data:data});
    }
    const setDescription = (description: string | undefined) => {
        const data = {description: description ? description : null}
        updateApplicationsTodayMutation.mutate({data:data});
    }

    return {handleUpdate, setStatus, setDescription, isPending: updateApplicationsTodayMutation.isPending};
}