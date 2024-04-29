import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const commentsList = createAsyncThunk('comment/list', async (credentials: {id: string}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/${credentials.id}/comments/`, config)
    return response.data
})