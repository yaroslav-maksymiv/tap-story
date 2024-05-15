import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


export const listNotifications = createAsyncThunk('notification/list', async (credentials: {
    url?: string
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const requestUrl = credentials.url
        ? credentials.url
        : `${process.env.REACT_APP_API_URL}/api/users/notifications/?page=1&page_size=15`

    try {
        const response = await axios.get(requestUrl, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const countUnreadNotifications = createAsyncThunk('notification/countUnread', async (credentials: {}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/notifications/count-unread/`, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})