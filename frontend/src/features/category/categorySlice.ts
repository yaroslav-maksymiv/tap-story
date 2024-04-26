import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {listCategories} from "./categoryThunks";

export type Category = {
    id: number
    name: string
}

type CategoryState = {
    categories: Category[]
    loading: boolean
    error: string | null
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listCategories.pending, (state) => {
            state.loading = true
        })
        builder.addCase(listCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
            state.loading = false
            state.categories = [...action.payload]
        })
        builder.addCase(listCategories.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message ? action.error.message : null
        })
    }
})

export default categorySlice.reducer