import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {Message} from "./messageSlice";

export const listMessages = createAsyncThunk('message/list', async (credentials?: {
    url?: string,
    episodeId?: number
}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const requestUrl = credentials?.url
        ? credentials.url
        : `${process.env.REACT_APP_API_URL}/api/episodes/${credentials?.episodeId}/messages/?page_size=5`

    const response = await axios.get(requestUrl, config)
    return response.data
})

export const updateMessageOrder = createAsyncThunk('message/order', async (credentials: {
    id: string,
    order: number
}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = {
        order: credentials.order
    }

    const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/messages/${credentials.id}/order/`, data, config)
    return response.data
})

export const updateMessage = createAsyncThunk('message/update', async (credentials: { message: Message }) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const data = new FormData()
    data.append('character', String(credentials.message.character.id))

    switch (credentials.message.message_type) {
        case 'image':
            if (credentials.message.image_content) {
                data.append('image_content', credentials.message.image_content)
            }
            break
        case 'video':
            break
        case 'audio':
            break
        case 'status':
            data.append('status_content', credentials.message.status_content)
            break
        case 'text':
            data.append('text_content', credentials.message.text_content)
            break
    }

    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/messages/${credentials.message.id}/`, data, config)
    return response.data
})
