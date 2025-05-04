import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {instance} from "./api";
import {useNavigate} from "react-router";
import {AppTodayStatus} from "../assets/assets";
import {IApplicationToday} from "./applicationTodayApi";


export interface ApplicationMaterialDto {
    id: number;
    application_today: number;
    is_cancelled: boolean;
    isChecked: boolean;
    isArchive: boolean;
    description?: string;
}

export interface IApplicationMaterial {
    id?: string;
    application_today?: number;
    is_cancelled?: boolean;
    isChecked?: boolean;
    isArchive?: boolean;
    description?: string;
}

export function useFetchApplicationMaterials(current_day?: string) {
    const url_current_day = current_day?`?current_day=${current_day}`: '';
    const {data: appMaterials, isLoading, isPending, isError} = useQuery({
        queryKey: ['applicationMaterials', 'all', current_day],
        queryFn: async (meta) => {
            const response = await instance.get<ApplicationMaterialDto[]>(`/api/applications_material/${url_current_day}`, {signal: meta.signal});
            return response.data;
        }
    });
    return {appMaterials, isLoading, isError, isPending};
}
export function useFetchApplicationMaterialBy_ATid(appTodayId: string | undefined) {
    const {data: appMaterial, isLoading, isPending, isError} = useQuery({
        queryKey: ['applicationMaterials', 'applicationMaterial', 'appTodayId', appTodayId],
        queryFn: async (meta) => {
            const response = await instance.get(`/api/application_material/by_application_today/${appTodayId}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!appTodayId,
    });
    return {appMaterial, isLoading, isError, isPending};
}
export function useFetchApplicationMaterialById(id: string | undefined) {
    const {data: appMaterial, isLoading, isPending, isError} = useQuery({
        queryKey: ['applicationMaterials', 'applicationMaterial', 'byId', id],
        queryFn: async (meta) => {
            const response = await instance.get(`/api/application_material/${id}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!id,
    });
    return {appMaterial, isLoading, isError, isPending};
}
export function useUpdateApplicationsMaterial(id: number | string | undefined) {
    const queryClient = useQueryClient();

    const  updateApplicationsMaterialMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.patch<IApplicationMaterial>(`/api/application_material/${id}/`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newApplicationsMaterial) => {
            await queryClient.cancelQueries({queryKey: ['applicationMaterials', 'applicationMaterial', 'byId', id]});
            const prevApplicationsMaterial = queryClient.getQueriesData({queryKey:['applicationMaterials', 'applicationMaterial', 'byId', id]});
            queryClient.setQueriesData(
                {queryKey:['applicationMaterials', 'applicationMaterial', 'byId', id]}, newApplicationsMaterial);

            return {prevApplicationsMaterial};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['applicationMaterials', 'applicationMaterial', 'byId', id]}, context.prevApplicationsMaterial);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['applicationMaterials'],
            })
        }
    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateApplicationsMaterialMutation.mutate({data:formData});
    };
    // const setPriority = (priority?: number) => {
    //     const data = {priority: priority ?? 1}
    //     updateApplicationsMaterialMutation.mutate({data:data});
    // }
    const setDescription = (description: string | undefined) => {
        const data = {description: description ? description : null}
        updateApplicationsMaterialMutation.mutate({data:data});
    }

    return {handleUpdate, setDescription, isPending: updateApplicationsMaterialMutation.isPending};
}