import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


export const listCharacters = createAsyncThunk('character/list', async (credentials: { storyId: number }) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/${credentials.storyId}/characters/`, config)
    return response.data
})

export const createCharacter = createAsyncThunk('character/create', async (credentials: {
    storyId: number,
    name: string,
    color: string
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = {
        name: credentials.name,
        story: credentials.storyId,
        color: credentials.color
    }

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/characters/`, data, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message)
    }
})

export const updateCharacter = createAsyncThunk('character/update', async (credentials: {
    id: number,
    name: string,
    color: string
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = {
        name: credentials.name,
        color: credentials.color
    }

    try {
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/characters/${credentials.id}/`, data, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message)
    }
})

export const deleteCharacter = createAsyncThunk('character/delete', async (credentials: {
    id: number,
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/characters/${credentials.id}/`, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data || err.message)
    }
})