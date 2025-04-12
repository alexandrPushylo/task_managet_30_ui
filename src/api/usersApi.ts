import {IPosts, PostTitle} from "../assets/assets";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {instance} from "./api";
import {useNavigate} from "react-router";


export interface UsersDto {
        id: number;
        username: string;
        first_name: string|undefined;
        last_name: string|undefined;
        password: string;
        telephone: string|undefined;
        isArchive: boolean;
        post: PostTitle;
        supervisor_user_id: number|undefined;
        telegram_id_chat: string|undefined;
}

export interface IUserData {
        id?: string;
        username: string;
        first_name?: string;
        last_name?: string;
        password: string;
        telephone?: string;
        isArchive: boolean;
        post: PostTitle;
        supervisor_user_id?: number;
        telegram_id_chat?: string;
}
export function useFetchUsers() {
    const {data: users, isLoading, isError} = useQuery({
        queryKey: ['users', 'all'],
        queryFn: async (meta) => {
            const response = await instance.get<UsersDto[]>('/api/users/', {signal: meta.signal});
            return response.data;
        },
    })
    return {users, isLoading, isError};
}
export function useFetchForemanList() {
    const {data: foremanList, isLoading, isError, isPending} = useQuery({
        queryKey: ['users', 'foreman'],
        queryFn: async (meta) => {
            const response = await instance.get<UsersDto[]>('/api/get_users_by_post/foreman/', {signal: meta.signal});
            return response.data;
        },
    })
    return {foremanList, isLoading, isError, isPending};
}
export function useFetchUserPosts() {
    const {data: posts, isLoading, isError, isPending} = useQuery({
        queryKey: ['userPosts'],
        queryFn: async (meta) => {
            const response = await instance.get<IPosts[]>('/api/get_user_posts/', {signal: meta.signal});
            return response.data;
        },
    })
    return {posts, isLoading, isError, isPending};
}

export function useFetchUserById(id: string | undefined) {
    const {data: user, isLoading, isError, isPending} = useQuery({
        queryKey: ['users', 'user', 'byId', id],
        queryFn: async (meta) => {
            const response = await instance.get<UsersDto>(`/api/user/${id}/`, {signal: meta.signal});
            return response.data;
        },
        enabled: !!id,
    })
    return {user, isLoading, isError, isPending};
}

export function useCreateUser(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const  createUserMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.post<IUserData>('/api/users/', meta.data, {signal: meta.signal});
            return response.data;
        },
        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['users'],
            })
        },
        async onSuccess(){
            await navigate("/users")
        }
    });

    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createUserMutation.mutate({data:formData});
    }

    return {handleCreate, isPending: createUserMutation.isPending};
}
export function useUpdateUser(userId: number | string | undefined) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const  updateUserMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.patch<IUserData>(`/api/user/${userId}/`, meta.data, {signal: meta.signal});
            return response.data;
        },
        onMutate: async (newUser) => {
            await queryClient.cancelQueries({queryKey: ['users', 'user', 'byId', userId]});
            const prevUser = queryClient.getQueriesData({queryKey:['users', 'user', 'byId', userId]});
            queryClient.setQueriesData(
                {queryKey:['users', 'user', 'byId', userId]}, newUser);

            return {prevUser};
        },
        onError: (_, __, context) => {
            if (context){
                queryClient.setQueriesData({queryKey:['users', 'user', 'byId', userId]}, context.prevUser);
            }
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['users', 'user', 'byId', userId],
            })
        },
        async onSuccess(){
            await navigate("/users")
        }

    });

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateUserMutation.mutate({data:formData});
    }

    return {handleUpdate, isPending: updateUserMutation.isPending};
}
export function useDeleteUser(userId: number | string | undefined) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const  deleteUserMutation = useMutation({
        mutationFn: async (meta: any) => {
            const response = await instance.delete(`/api/user/${userId}/`, {signal: meta.signal});
            return response.data;
        },

        async onSettled(){
            await queryClient.invalidateQueries({
                queryKey: ['users', 'user', 'byId', userId],
            })
            await navigate("/users");
        }
    });

    return {
        handleDelete: deleteUserMutation.mutate,
        isPending: deleteUserMutation.isPending,
        isSuccess: deleteUserMutation.isSuccess
    };
}
