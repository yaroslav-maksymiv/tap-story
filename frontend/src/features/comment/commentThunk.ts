import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {ConfigType} from "../../types";

export const listComments = createAsyncThunk('comment/list', async (credentials: { storyId: string, url?: string }, thunkAPI) => {
    const config: ConfigType = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }

    if (localStorage.getItem('isAuthenticated') == 'true') {
        config.headers.Authorization = `JWT ${localStorage.getItem('access')}`
    }

    const requestUrl = credentials.url
        ? credentials.url
        : `${process.env.REACT_APP_API_URL}/api/stories/${credentials.storyId}/comments/?page_size=15`

    try {
        const response = await axios.get(requestUrl, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const createComment = createAsyncThunk('comment/create', async (credentials: {
    storyId: string,
    text: string
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = {
        story: credentials.storyId,
        text: credentials.text
    }

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/comments/`, data, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const deleteComment = createAsyncThunk('comment/delete', async (credentials: {
    id: number
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/${credentials.id}/`, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const toggleLikeComment = createAsyncThunk('comment/toggleLike', async (credentials: { id: number }) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/comments/${credentials.id}/toggle-like/`, {}, config)
    response.data['commentId'] = credentials.id
    return response.data
})