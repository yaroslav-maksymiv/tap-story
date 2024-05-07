import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {ConfigType} from "../../types";

export const listStories = createAsyncThunk('story/list', async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/`, config)
    return response.data
})

export const singleStory = createAsyncThunk('story/single', async (credentials: { id: string }) => {
    const config: ConfigType = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    }

    if (localStorage.getItem('isAuthenticated') == 'true') {
        config.headers.Authorization = `JWT ${localStorage.getItem('access')}`
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/${credentials.id}/`, config)
    return response.data
})

export const toggleLikeStory = createAsyncThunk('story/toggleLike', async (credentials: { id: number }) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/stories/${credentials.id}/toggle-like/`, {}, config)
    return response.data
})

export const listSavedStories = createAsyncThunk('story/saved', async (credentials: {
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
        : `${process.env.REACT_APP_API_URL}/api/saved-stories/?page=1&page_size=15`

    try {
        const response = await axios.get(requestUrl, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const listLikedStories = createAsyncThunk('story/liked', async (credentials: {
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
        : `${process.env.REACT_APP_API_URL}/api/stories/liked/?page=1&page_size=15`

    try {
        const response = await axios.get(requestUrl, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})