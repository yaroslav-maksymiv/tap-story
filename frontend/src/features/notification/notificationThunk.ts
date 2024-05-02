import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


export const listNotifications = createAsyncThunk('notification/list', async (credentials: {}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

     try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/notifications/`, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})