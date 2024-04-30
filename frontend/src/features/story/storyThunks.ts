import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

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
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/${credentials.id}/`, config)
    return response.data
})

export const toggleLikeStory = createAsyncThunk('story/toggleLike', async (credentials: { id: string }) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/${credentials.id}/toggle-like/`, config)
    return response.data
})