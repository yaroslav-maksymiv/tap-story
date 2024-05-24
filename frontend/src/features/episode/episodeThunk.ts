import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const listEpisodes = createAsyncThunk('episode/list', async (credentials: {storyId: number}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/${credentials.storyId}/episodes/`, config)
    return response.data
})

export const createEpisode = createAsyncThunk('episode/create', async (credentials: {storyId: number, title: string}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = {
        story: credentials.storyId,
        title: credentials.title
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/episodes/`, data, config)
    return response.data
})

export const singleEpisode = createAsyncThunk('episode/single', async (credentials: {id: string}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/episodes/${credentials.id}`, config)
    return response.data
})