import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {instance} from "./api";


export interface ApplicationTechnicDto {
    id: number;
    application_today: number;
    technic_sheet?: number;
    priority: number;
    is_cancelled: boolean;
    isChecked: boolean;
    isArchive: boolean;
    description?: string;
}

export interface IApplicationTechnic {
    id?: string;
    application_today?: number;
    technic_sheet?: number;
    priority?: number;
    is_cancelled?: boolean;
    isChecked?: boolean;
    isArchive?: boolean;
    description?: string;
}

export function useFetchApplicationTechnics(current_day?: string) {
    const url_current_day = current_day?`?current_day=${current_day}`: '';
    const {data: appTechnics, isLoading, isPending, isError} = useQuery({
        queryKey: ['applicationTechnics', 'all', current_day],
        queryFn: async (meta) => {
            const response = await instance.get<ApplicationTechnicDto[]>(`/api/applications_technic/${url_current_day}`, {signal: meta.signal});
            return response.data;
        }
    });
    return {appTechnics, isLoading, isError, isPending};
}
export function useFetchApplicationTechnicBy_ATid(appTodayId: string | undefined) {
    const {data: appTechnic, isLoading, isPending, isError} = useQuery({
        queryKey: ['applicationTechnics', 'applicationTechnic', 'appTodayId', appTodayId],
        queryFn: async (meta) => {
            const response = await instance.get(`/api/application_technic/by_application_today/${appTodayId}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!appTodayId,
    });
    return {appTechnic, isLoading, isError, isPending};
}
export function useFetchApplicationTechnicById(id: string | undefined) {
    const {data: appTechnic, isLoading, isPending, isError} = useQuery({
        queryKey: ['applicationTechnics', 'applicationTechnic', 'byId', id],
        queryFn: async (meta) => {
            const response = await instance.get(`/api/application_technic/${id}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!id,
    });
    return {appTechnic, isLoading, isError, isPending};
}
export function useUpdateApplicationsTechnic(id: number | string | undefined) {
    const queryClient = useQueryClient();

    const  updateApplicationsTechnicMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.patch<IApplicationTechnic>(`/api/application_technic/${id}/`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newApplicationsTechnic) => {
            await queryClient.cancelQueries({queryKey: ['applicationTechnics', 'applicationTechnic', 'byId', id]});
            const prevApplicationsTechnic = queryClient.getQueriesData({queryKey:['applicationTechnics', 'applicationTechnic', 'byId', id]});
            queryClient.setQueriesData(
                {queryKey:['applicationTechnics', 'applicationTechnic', 'byId', id]}, newApplicationsTechnic);

            return {prevApplicationsTechnic};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['applicationTechnics', 'applicationTechnic', 'byId', id]}, context.prevApplicationsTechnic);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['applicationTechnics'],
            })
        }
    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateApplicationsTechnicMutation.mutate({data:formData});
    };
    const setPriority = (priority?: number) => {
        const data = {priority: priority ?? 1}
        updateApplicationsTechnicMutation.mutate({data:data});
    }
    const setDescription = (description: string | undefined) => {
        const data = {description: description ? description : null}
        updateApplicationsTechnicMutation.mutate({data:data});
    }

    return {handleUpdate, setPriority, setDescription, isPending: updateApplicationsTechnicMutation.isPending};
}