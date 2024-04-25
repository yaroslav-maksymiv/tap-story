import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const listCategories = createAsyncThunk('category', async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories/`, config)
    return response.data
})