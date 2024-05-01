import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

interface Config {
    headers: {
        'Content-Type': string
        Accept: string
        Authorization?: string
    }
}

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
    const config: Config = {
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