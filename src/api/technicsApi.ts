import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {instance} from "./api";
import {useNavigate} from "react-router";


export interface TechnicsDto{
    id: number;
    title: string;
    type: string;
    id_information: string;
    description: string;
    supervisor_technic: "mechanic" | "supply";
    isArchive: boolean;
    attached_driver?: number;
}

interface technicTypeDto{
    technic_types: []
}

export interface ITechnicData{
    id?: string;
    title: string;
    type: string;
    id_information: string;
    description?: string;
    supervisor_technic: "mechanic" | "supply";
    isArchive: boolean;
    attached_driver?: number;
}


export function useFetchTechnicTypes() {
    const {data: technicTypes, isLoading, isError} = useQuery({
        queryKey: ['technics', 'technicTypes'],
        queryFn: async (meta) => {
            const response = await instance.get<technicTypeDto>('/api/get_technic_type/', {signal: meta.signal});
            return response.data;
        },
    })
    return {technicTypes, isLoading, isError};
}

export function useFetchTechnics() {
    const {data: technics, isLoading, isError} = useQuery({
        queryKey: ['technics', 'all'],
        queryFn: async (meta) => {
            const response = await instance.get<TechnicsDto[]>('/api/technics/', {signal: meta.signal});
            return response.data;
        },
    })
    return {technics, isLoading, isError};
}

export function useFetchTechnicById(id: string | undefined) {
    const {data: technic, isLoading, isError, isPending} = useQuery({
        queryKey: ['technics', 'technic', 'byId', id],
        queryFn: async (meta) => {
            const response = await instance.get<TechnicsDto>(`/api/technic/${id}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!id,
    })
    return {technic, isLoading, isError, isPending};
}

export function useCreateTechnic(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const  createTechnicMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.post<ITechnicData>('/api/technics/', meta.data, {signal: meta.signal});
            return response.data;
        },
        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['technics'],
            })
        },
        async onSuccess(){
            await navigate("/technics")
        }
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createTechnicMutation.mutate({data:formData});
    }
    return {handleCreate, isPending: createTechnicMutation.isPending};
}

export function useUpdateTechnic(technicId: number | string | undefined) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const  updateTechnicMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.patch<ITechnicData>(`/api/technic/${technicId}/`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newTechnic) => {
            await queryClient.cancelQueries({queryKey: ['technics', 'technic', 'byId', technicId]});
            const prevTechnic = queryClient.getQueriesData({queryKey:['technics', 'technic', 'byId', technicId]});
            queryClient.setQueriesData(
                {queryKey:['technics', 'technic', 'byId', technicId]}, newTechnic);

            return {prevTechnic};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['technics', 'technic', 'byId', technicId]}, context.prevTechnic);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['technics', 'technic', 'byId', technicId],
            })
        },
        async onSuccess(){
            await navigate("/technics");
        }

    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateTechnicMutation.mutate({data:formData});
    }

    return {handleUpdate, isPending: updateTechnicMutation.isPending};
}

export function useDeleteTechnic(technicId: number | string | undefined) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const  deleteTechnicMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.delete(`/api/technic/${technicId}/`, {signal: meta.signal});
            return response.data;
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['technics', 'technic', 'byId', technicId],
            })
            await navigate("/technics");
        }
    });

    return {
        handleDelete: deleteTechnicMutation.mutate,
        isPending: deleteTechnicMutation.isPending,
        isSuccess: deleteTechnicMutation.isSuccess
    };
}
