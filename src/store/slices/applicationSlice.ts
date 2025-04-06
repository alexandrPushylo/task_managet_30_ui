import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {instance} from "../../api/api";
import Cookies from "js-cookie";

// const csrftoken = Cookies.get('csrftoken');
// console.log("!!!!", csrftoken)

const initialState: ApplicationState = {
    isDownloaded: false,
    loading: false,
    is_authenticated:false,
}
interface ApplicationState {
    isDownloaded: boolean;
    loading: boolean;
    today?: string;
    "current_weekday"?: string;
    "prev_work_day"?: string;
    "next_work_day"?: string;
    "weekday"?: string;
    "view_mode"?: "view_mode_future" | "view_mode_current" | "view_mode_archive"
    "accept_mode"?: boolean;
    "is_authenticated": boolean;
    "csrftoken"?: string;
    "current_user"?: {
        id: number;
        username: string;
        first_name: string|undefined;
        last_name: string|undefined;
        password: string;
        telephone: string|undefined;
        isArchive: boolean;
        post: string;
        supervisor_user_id: number|undefined;
        telegram_id_chat: string|undefined;
    };
}

//  ====================================================================================

export const fetchAppData = createAsyncThunk(
    'fetchAppData',
    async (): Promise<ApplicationState> => {
        const response = await instance.get('api/get_data',{
        });
        return response.data;
    })
export const fetchToken = createAsyncThunk(
    'fetchToken',
    async (): Promise<{"csrftoken": string;}> => {
        const response = await instance.get('api/get_token');
        return response.data;
    })

export const fetchLogin = createAsyncThunk(
    'login',
    async (data: {username: string, password: string}): Promise<{message: string, "csrftoken": string;}> => {
        const response = await instance.post("/api/login/", data);
        return response.data;
    }
)


export const fetchLogout = createAsyncThunk(
    'logout',
    async () => {
        const response = await instance.get("/api/logout/")
        return response.data;
    }
)

// ========================================================================================
export const applicationSlice = createSlice({
    name: "application",
    initialState,
    selectors:{
        selectIsAuthenticated:(state:ApplicationState) =>  state.is_authenticated,
        selectIsDownloaded:(state:ApplicationState) =>  state.isDownloaded,
        selectCurrentUser: state => state.current_user,
        selectToday: state => state.today,
        selectCurrentWeekday: state => state.current_weekday,
        selectCSRFToken: state => state.csrftoken

    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchAppData.pending, (state, action)=>{
            state.loading = true
        });
        builder.addCase(fetchAppData.fulfilled, (state, action)=>{
            // console.log(action.payload.csrf_token)
            // action.payload.csrf_token && Cookies.set('csrftoken', action.payload.csrf_token)
            return {...action.payload, loading: false, isDownloaded: true}
        })
        builder.addCase(fetchAppData.rejected, (state, action)=>{
            state.loading = false
        })
        builder.addCase(fetchToken.fulfilled, (state, action) => {

            // action.payload.csrftoken && Cookies.set('csrftoken', action.payload.csrftoken)
        })
        builder.addCase(fetchToken.rejected, (state, action) => {
            console.log("fetchToken error")
        })
        builder.addCase(fetchLogout.fulfilled, (state, action)=>{
            state.is_authenticated = false
            state.current_user = undefined
        })
        builder.addCase(fetchLogout.rejected, (state, action)=>{
            // state.is_authenticated = false
        })
        builder.addCase(fetchLogin.fulfilled, (state, action)=>{
            console.log(action.payload.csrftoken)

            action.payload.csrftoken && Cookies.set('csrftoken', action.payload.csrftoken, {
                expires: 30
            })
            console.log(document.cookie)
            state.is_authenticated = true
            state.isDownloaded = false
            state.csrftoken = action.payload.csrftoken
        })
        builder.addCase(fetchLogin.rejected, (state, action)=>{
            // state.is_authenticated = false
            // state.isDownloaded = false
        })


    }
})