import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {instance} from "./api";

export interface DriverSheetDto{
    id: number;
    status: boolean;
    isArchive: boolean;
    driver: number;
    date: number;
}

export interface IDriverSheet{
    id?: string;
    status?: boolean;
    isArchive?: boolean;
    driver?: string;
    date?: string;
}


export function useFetchDriverSheet() {
    const {data: driverSheets, isLoading, isError} = useQuery({
        queryKey: ['driverSheets', 'all'],
        queryFn: async (meta) => {
            const response = await instance.get<DriverSheetDto[]>('/api/driver_sheet/', {signal: meta.signal});
            return response.data;
        },
    })
    return {driverSheets, isLoading, isError};
}
export function useFetchDriverSheetById(id: string | undefined) {
    const {data: driverSheet, isLoading, isError, isPending} = useQuery({
        queryKey: ['driverSheets', 'driverSheet', 'byId', id],
        queryFn: async (meta) => {
            const response = await instance.get<DriverSheetDto>(`/api/driver_sheet/${id}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!id,
    })
    return {driverSheet, isLoading, isError, isPending};
}


export function useUpdateDriverSheet(id: number | string | undefined) {
    const queryClient = useQueryClient();

    const  updateDriverSheetMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.patch<IDriverSheet>(`/api/driver_sheet/${id}/`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newDriverSheet) => {
            await queryClient.cancelQueries({queryKey: ['driverSheets', 'driverSheet', 'byId', id]});
            const prevDriverSheet = queryClient.getQueriesData({queryKey:['driverSheets', 'driverSheet', 'byId', id]});
            queryClient.setQueriesData(
                {queryKey:['driverSheets', 'driverSheet', 'byId', id]}, newDriverSheet);

            return {prevDriverSheet};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['driverSheets', 'driverSheet', 'byId', id]}, context.prevDriverSheet);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['driverSheets'],
            })
        }
    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateDriverSheetMutation.mutate({data:formData});
    };
    const togglesStatus = (status: boolean) => {
        const data = {status: !status}
        updateDriverSheetMutation.mutate({data:data});
    }

    return {handleUpdate, togglesStatus, isPending: updateDriverSheetMutation.isPending};
}
