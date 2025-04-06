import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {instance} from "../../api/api";
import {IPosts} from "../../assets/assets";
import {IUserData} from "./usersSlice";

export interface ITechnicData{
    id: number;
    title: string;
    type: string;
    id_information: string;
    description?: string;
    supervisor_technic: "mechanic" | "supply";
    isArchive: boolean;
    attached_driver?: number;
}

interface IState{
    isDownloaded: boolean;
    loading: boolean;
    technics?: ITechnicData[];
}

const initialState: IState = {
    isDownloaded: false,
    loading: false,
}
//  ============================================================================
export const fetchTechnics = createAsyncThunk(
    'fetchTechnics',
    async (): Promise<ITechnicData[]> => {
        const response = await instance.get<ITechnicData[]>('/api/technic');
        return response.data
    }
);
//  ============================================================================


export const technicsSlice = createSlice({
    name: "technics",
    initialState,
    selectors: {
        selectIsDownloaded: (state: IState) => state.isDownloaded,
        selectLoading: (state: IState) => state.loading,
        selectTechnics: (state: IState) => state.technics,
        selectTechnicById: (state: IState, id: string) => {
            const technic_id = id && parseInt(id);
            const technic = state.technics?.filter(item => item.id === technic_id)
            return technic ? technic : []
        }
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchTechnics.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchTechnics.fulfilled, (state, action) => {
            return {technics: action.payload, loading: false, isDownloaded: true}
        });

    }
})