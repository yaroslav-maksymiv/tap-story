import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {Message} from "./messageSlice";
import {MessageData} from "./MessageAddMenu";

export const listMessages = createAsyncThunk('message/list', async (credentials: {
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

    const requestUrl = credentials.url
        ? credentials.url
        : `${process.env.REACT_APP_API_URL}/api/episodes/${credentials.episodeId}/messages/?page_size=5`

    const response = await axios.get(requestUrl, config)
     if (credentials.url) {
        response.data['loadMore'] = true
    }
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
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const msg = credentials.message
    const data = new FormData()
    if (msg.character) {
        data.append('character', String(msg.character.id))
    }
    switch (msg.message_type) {
        case 'image':
            if (msg.image_content) {
                data.append('image_content', msg.image_content)
            }
            break
        case 'video':
            if (msg.video_content) {
                data.append('video_content', msg.video_content)
            }
            break
        case 'audio':
            if (msg.audio_content) {
                data.append('audio_content', msg.audio_content)
            }
            break
        case 'status':
            data.append('status_content', msg.status_content)
            break
        case 'text':
            data.append('text_content', msg.text_content)
            break
    }

    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/messages/${msg.id}/`, data, config)
    return response.data
})

export const deleteMessage = createAsyncThunk('message/order', async (credentials: {
    id: number
}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/messages/${credentials.id}/`, config)
    return response.data
})

export const createMessage = createAsyncThunk('message/create', async (credentials: { message: MessageData }) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    }

    const msg = credentials.message
    const data = new FormData()
    data.append('order', String(msg.order))
    data.append('message_type', msg.message_type)
    data.append('episode', String(msg.episode))

    if (msg.character) {
        data.append('character', String(msg.character.id))
    }

    switch (msg.message_type) {
        case 'image':
            if (msg.image_content) {
                data.append('image_content', msg.image_content)
            }
            break
        case 'video':
            if (msg.video_content) {
                data.append('video_content', msg.video_content)
            }
            break
        case 'audio':
            if (msg.audio_content) {
                data.append('audio_content', msg.audio_content)
            }
            break
        case 'status':
            data.append('status_content', msg.status_content)
            break
        case 'text':
            data.append('text_content', msg.text_content)
            break
    }

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/messages/`, data, config)
    return response.data
})
