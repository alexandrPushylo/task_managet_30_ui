import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {instance} from "./api";

export interface TechnicSheetDto{
    id: number;
    status: boolean;
    count_application: number;
    isArchive: boolean;
    technic: number;
    driver: number;
    driver_sheet: number;
    date: number;
}

export interface ITechnicSheet{
    id?: string;
    status?: boolean;
    count_application?: number;
    isArchive?: boolean;
    technic?: number;
    driver?: string;
    driver_sheet?: number;
    date?: string;
}


export function useFetchTechnicSheet() {
    const {data: technicSheets, isLoading, isError} = useQuery({
        queryKey: ['technicSheets', 'all'],
        queryFn: async (meta) => {
            const response = await instance.get<TechnicSheetDto[]>('/api/technic_sheet/', {signal: meta.signal});
            return response.data;
        },
    })
    return {technicSheets, isLoading, isError};
}
export function useFetchTechnicSheetById(id: string | undefined) {
    const {data: technicSheet, isLoading, isError, isPending} = useQuery({
        queryKey: ['technicSheets', 'technicSheet', 'byId', id],
        queryFn: async (meta) => {
            const response = await instance.get<TechnicSheetDto>(`/api/technic_sheet/${id}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!id,
    })
    return {technicSheet, isLoading, isError, isPending};
}


export function useUpdateTechnicSheet(id: number | string | undefined) {
    const queryClient = useQueryClient();

    const  updateTechnicSheetMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.patch<ITechnicSheet>(`/api/driver_sheet/${id}/`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newTechnicSheet) => {
            await queryClient.cancelQueries({queryKey: ['technicSheets', 'technicSheet', 'byId', id]});
            const prevTechnicSheet = queryClient.getQueriesData({queryKey:['technicSheets', 'technicSheet', 'byId', id]});
            queryClient.setQueriesData(
                {queryKey:['technicSheets', 'technicSheet', 'byId', id]}, newTechnicSheet);

            return {prevTechnicSheet};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['technicSheets', 'technicSheet', 'byId', id]}, context.prevTechnicSheet);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['technicSheets'],
            })
        }
    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateTechnicSheetMutation.mutate({data:formData});
    };
    const togglesStatus = (status: boolean) => {
        const data = {status: !status}
        updateTechnicSheetMutation.mutate({data:data});
    }
    const setDriverSheet = (driverSheetId: string | null) => {
        const data = {driver_sheet: driverSheetId ? parseInt(driverSheetId) : null}
        updateTechnicSheetMutation.mutate({data:data});
    }

    return {handleUpdate, togglesStatus, setDriverSheet, isPending: updateTechnicSheetMutation.isPending};
}
