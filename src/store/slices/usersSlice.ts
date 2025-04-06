import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {instance} from "../../api/api";
import {IPosts, PostTitle} from "../../assets/assets";


const initialState: IUserState = {
    isDownloaded: false,
    loading: false,
}

interface IUserState {
    isDownloaded: boolean;
    loading: boolean;
    users?: IUserData[];
    user_post?: IPosts[];
}

export interface IUserData {
        id: number;
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

//  ========================================================================
export const fetchUsers = createAsyncThunk(
    'fetchUsers',
    async (): Promise<IUserData[]> => {
        const response = await instance.get<IUserData[]>('/api/user');
        return response.data;
    }
);
export const fetchUserPost = createAsyncThunk(
    'fetchUserPost',
    async (): Promise<IPosts[]> => {
        const response = await instance.get('/api/user_posts');
        return response.data;
    }
);
export const updateUser = createAsyncThunk(
    'updateUser',
    async (data: {userId: string, user:IUserData}): Promise<IUserData> => {
        const response = await instance.put<IUserData>('/api/user/'+data.userId, data.user);
        return response.data;
    }
);
export const createUser = createAsyncThunk(
    'createUser',
    async (data:IUserData): Promise<IUserData> => {
        const response = await instance.post<IUserData>('/api/user', data);
        return response.data;
    }
);
export const deleteUser = createAsyncThunk(
    'deleteUser',
    async (userId: string): Promise<IUserData> => {
        const response = await instance.delete(`/api/user/${userId}`);
        return response.data;
    }
);



//  ========================================================================

export const usersSlice = createSlice({
    name: "users",
    initialState,
    selectors: {
        selectIsDownloaded: (state: IUserState) => state.isDownloaded,
        selectLoading: (state: IUserState) => state.loading,
        selectUsers: (state: IUserState) => state.users,
        selectUserById: (state, userId) => {
            const user_id = userId && parseInt(userId);
            const users = state.users?.filter(item => item.id === user_id);
            return users ? users : [];
        },
        selectForeman: (state: IUserState) => {
            return state.users?.filter(user => user.post === "foreman")
        },
        selectUserPost: (state: IUserState) => state.user_post
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchUsers.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return {users:action.payload, loading: false, isDownloaded: true}
        });
        builder.addCase(fetchUserPost.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchUserPost.fulfilled, (state, action) => {
            return {...state, user_post: action.payload, loading: false}
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.isDownloaded = false
        });
        builder.addCase(createUser.fulfilled, (state, action) => {
            console.log(action.payload)
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.isDownloaded = false;
        });





    },
});