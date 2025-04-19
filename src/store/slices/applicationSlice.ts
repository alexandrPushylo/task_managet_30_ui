import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import {instance, getQueryClient} from "../../api/api";
import Cookies from "js-cookie";
import {AcceptMode} from "../../assets/assets";

const initialState: ApplicationState = {
    is_authenticated: false,
    current_day: undefined

}

interface ApplicationState {
    is_authenticated: boolean;
    current_day?: string;
}

interface prevDay{
    id: number;
    date: string;
    status: boolean;
    accept_mode: AcceptMode;
    weekday: string;
}

export const fetchLogin = createAsyncThunk(
    'login',
    async (data: { username: string, password: string }): Promise<{ message: string, "csrftoken": string; }> => {
        const response = await instance.post("/api/login/", data);
        await getQueryClient.invalidateQueries({queryKey: ['appData']})
        return response.data;
    }
)

export const getPrevOrNextCurrentDay = createAsyncThunk(
    'prevOrNextCurrentDay',
    async (data: { current_day: string, side: "prev" | "next" }):Promise<prevDay> => {
        const urlCurDay = data.current_day ? `?current_day=${data.current_day}` : '';
        const response = await instance.get(`/api/get_prev_next_work_day/${urlCurDay}&side=${data.side}`);
        await getQueryClient.invalidateQueries({queryKey: ['appData']})
        return response.data;
    }
)



export const fetchIsAuthenticated = createAsyncThunk(
    'fetchIsAuthenticated',
    async (): Promise<{
        "is_authenticated": boolean,
        "user_id": number | null
    }> => {
        const response = await instance.get("/api/is_authenticated/");
        return response.data;
    }
)
export const fetchLogout = createAsyncThunk(
    'logout',
    async () => {
        const response = await instance.get("/api/logout/");
        return response.data;
    }
)

// ========================================================================================
export const applicationSlice = createSlice({
    name: "application",
    initialState,
    selectors: {
        selectIsAuthenticated: (state: ApplicationState) => state.is_authenticated,
        selectCurrentDay: (state: ApplicationState) => state.current_day,
    },
    reducers: {
        setIsAuthenticated(state: ApplicationState, action) {
            state.is_authenticated = action.payload;
        },
        setCurrentDay(state: ApplicationState, action) {
            state.current_day = action.payload;
        }
    },
    extraReducers: builder => {

        builder.addCase(fetchIsAuthenticated.fulfilled, (state, action) => {
            state.is_authenticated = action.payload.is_authenticated
        })

        builder.addCase(fetchLogout.fulfilled, (state, action) => {
            state.is_authenticated = false
            getQueryClient.removeQueries({queryKey: ['appData']});
        })

        builder.addCase(getPrevOrNextCurrentDay.fulfilled, (state, action) => {
            state.current_day = action.payload.date;
        })


        builder.addCase(fetchLogin.fulfilled, (state, action) => {
            console.log(action.payload.csrftoken)

            action.payload.csrftoken && Cookies.set('csrftoken', action.payload.csrftoken, {
                expires: 30
            })
            console.log(document.cookie)
            state.is_authenticated = true
            // state.isDownloaded = false
            // state.csrftoken = action.payload.csrftoken
        })
        builder.addCase(fetchLogin.rejected, (state, action) => {
            state.is_authenticated = false
            // state.isDownloaded = false
        })


    }
})