import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {ConfigType} from "../../types";

export const listStories = createAsyncThunk('story/list', async (credentials?: {
    url?: string,
    category?: number | null,
    search?: string,
    orderBy?: string
}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    let queryParams = ''
    if (credentials?.category) {
        queryParams += `&category=${credentials.category}`
    }
    if (credentials?.search) {
        queryParams += `&search=${credentials.search}`
    }
    if (credentials?.orderBy) {
        queryParams += `&ordering=${credentials.orderBy}`
    }

    const requestUrl = credentials?.url
        ? credentials.url
        : `${process.env.REACT_APP_API_URL}/api/stories/?page_size=8${queryParams}`

    const response = await axios.get(requestUrl, config)
    if (credentials?.url) {
        response.data['loadMore'] = true
    }
    return response.data
})

export const listMyStories = createAsyncThunk('story/myList', async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/my/?page_size=15`, config)
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

export const saveStory = createAsyncThunk('story/save', async (credentials: { storyId: number }, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = {
        story: credentials.storyId
    }

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/saved-stories/`, data, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const removeFromSaved = createAsyncThunk('story/removeSaved', async (credentials: {
    storyId: number
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = {
        story: credentials.storyId
    }

    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/saved-stories/delete/`, {
            data: data,
            headers: config.headers
        })
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const createStory = createAsyncThunk('story/create', async (credentials: {
    title: string, description: string, category: string, image: File | null
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = new FormData()
    data.append('title', credentials.title)
    data.append('description', credentials.description)
    data.append('category', credentials.category)
    if (credentials.image) {
        console.log(credentials.image)
        data.append('image', credentials.image)
    }

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/stories/`, data, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const updateStory = createAsyncThunk('story/update', async (credentials: {
    id: string, title: string, description: string, category: string, image: File | string | null
}, thunkAPI) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = new FormData()
    data.append('title', credentials.title)
    data.append('description', credentials.description)
    data.append('category', credentials.category)
    if (credentials.image && typeof credentials.image !== 'string') {
        data.append('image', credentials.image)
    }

    try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/stories/${credentials.id}/`, data, config)
        return response.data
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.message)
    }
})

export const randomStory = createAsyncThunk('story/random', async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/random`, config)
    return response.data
})

export const listStoryMessages = createAsyncThunk('story/messages', async (credentials: {
    url?: string,
    episodeId?: number
    page?: number
    temporary?: boolean
}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const requestUrl = credentials.url
        ? credentials.url
        : `${process.env.REACT_APP_API_URL}/api/episodes/${credentials.episodeId}/messages/${credentials.page ? `?page=${credentials.page}` : ''}`

    const response = await axios.get(requestUrl, config)
    if (credentials.url) {
        response.data['loadMore'] = true
    }

    response.data['save'] = !credentials.temporary
    return response.data
})

export const updateStoryStatus = createAsyncThunk('story/updateStatus', async (credentials: {
    storyId: number,
    episodeId: number,
    messageId: number
}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = {
        story_id: credentials.storyId,
        episode_id: credentials.episodeId,
        message_id: credentials.messageId
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/update-status/`, data, config)
    return response.data
})

export const getStoryStatus = createAsyncThunk('story/status', async (credentials: {
    storyId: number,
}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/update-status/?story_id=${credentials.storyId}`, config)
    return response.data
})