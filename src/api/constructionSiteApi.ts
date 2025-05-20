import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {instance} from "./api";
import {useNavigate} from "react-router";
import {ITechnicData, TechnicsDto} from "./technicsApi";

export interface ConstructionSiteDto{
    id: number;
    address: string;
    deleted_date?: string;
    status: boolean;
    isArchive: boolean;
    foreman?: number
}

export interface IConstructionSite{
    id?: string;
    address: string;
    deleted_date?: string;
    status: boolean;
    isArchive: boolean;
    foreman?: number
}


export function useFetchConstructionSites() {
    const {data: constrSites, isLoading, isError} = useQuery({
        queryKey: ['constructionSites', 'all'],
        queryFn: async (meta) => {
            const response = await instance.get<ConstructionSiteDto[]>('/api/construction_sites/', {signal: meta.signal});
            return response.data;
        },
    })
    return {constrSites, isLoading, isError};
}
export function useFetchConstructionSiteById(id: string | number | undefined) {
    const {data: constrSite, isLoading, isError, isPending} = useQuery({
        queryKey: ['constructionSites', 'constructionSite', 'byId', id],
        queryFn: async (meta) => {
            const response = await instance.get<ConstructionSiteDto>(`/api/construction_site/${id}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!id,
    })
    return {constrSite, isLoading, isError, isPending};
}
export function useCreateConstructionSite(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const  createConstructionSiteMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.post<IConstructionSite>('/api/construction_sites/', meta.data, {signal: meta.signal});
            return response.data;
        },
        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['constructionSites'],
            })
        },
        async onSuccess(){
            await navigate("/construction_sites")
        }
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createConstructionSiteMutation.mutate({data:formData});
    }
    return {handleCreate, isPending: createConstructionSiteMutation.isPending};
}
export function useUpdateConstructionSite(id: number | string | undefined) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const  updateConstructionSiteMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.patch<IConstructionSite>(`/api/construction_site/${id}/`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newConstructionSite) => {
            await queryClient.cancelQueries({queryKey: ['constructionSites', 'constructionSite', 'byId', id]});
            const prevConstructionSite = queryClient.getQueriesData({queryKey:['constructionSites', 'constructionSite', 'byId', id]});
            queryClient.setQueriesData(
                {queryKey:['constructionSites', 'constructionSite', 'byId', id]}, newConstructionSite);

            return {prevConstructionSite};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['constructionSites', 'constructionSite', 'byId', id]}, context.prevConstructionSite);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['constructionSites'],
            })
        },
        async onSuccess(){
            await navigate("/construction_sites");
        }

    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateConstructionSiteMutation.mutate({data:formData});
    };
    const toggleDisplay = (status: boolean) => {
        const data = {status: status}
        updateConstructionSiteMutation.mutate({data:data});
    }
    const handleRestore = () => {
        const data = {isArchive: false, status: true}
        updateConstructionSiteMutation.mutate({data:data});
    }

    return {handleUpdate, toggleDisplay, handleRestore, isPending: updateConstructionSiteMutation.isPending};
}
export function useDeleteConstructionSite(id: number | string | undefined) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const  deleteConstructionSiteMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.delete(`/api/construction_site/${id}/`, {signal: meta.signal});
            return response.data;
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['constructionSites'],
            })
            await navigate("/construction_sites");
        }
    });

    return {
        handleDelete: deleteConstructionSiteMutation.mutate,
        isPending: deleteConstructionSiteMutation.isPending,
        isSuccess: deleteConstructionSiteMutation.isSuccess
    };
}