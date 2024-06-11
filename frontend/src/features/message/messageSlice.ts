import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Character} from "../character/characterSlice";
import {PaginatedResponse} from "../../types";
import {createMessage, listMessages} from "./messageThunk";

export type Message = {
    id: number
    message_type: 'text' | 'image' | 'video' | 'audio' | 'status'
    order: number
    character: Character
    episode: number
    text_content: string
    image_content: string | null | File
    video_content: string | null | File
    audio_content: string | null | File
    status_content: string
}

type MessageState = {
    messages: Message[]
    total: number | null
    page: number
    nextLink: string | null
    previousLink: string | null
    hasMore: boolean
    loading: {
        update: boolean
        list: boolean
        create: boolean
    }
    errors: {
        update: string
        list: string
    }
}

const initialState: MessageState = {
    messages: [],
    total: null,
    page: 1,
    nextLink: null,
    previousLink: null,
    hasMore: true,
    errors: {
        update: '',
        list: ''
    },
    loading: {
        update: false,
        list: false,
        create: false
    }
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        reorderMessage(state, action) {
            state.messages = action.payload
        },
        removeMessage(state, action) {
            state.messages = state.messages.filter(message => message.id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(listMessages.pending, (state) => {
            state.loading.list = true
        })
        builder.addCase(listMessages.fulfilled, (state, action: PayloadAction<PaginatedResponse<Message>>) => {
            const payload = action.payload
            const loadMore = action.payload.loadMore
            if (loadMore) {
                state.messages = [...state.messages, ...payload.results]
            } else {
                state.messages = payload.results
            }
            state.loading.list = false
            state.total = payload.total
            state.page = payload.page
            state.nextLink = payload.links.next
            state.previousLink = payload.links.previous
            state.hasMore = !!payload.links.next
        })
        builder.addCase(listMessages.rejected, (state) => {
            state.loading.list = false
        })
        builder.addCase(createMessage.pending, (state) => {
            state.loading.create = true
        })
        builder.addCase(createMessage.fulfilled, (state, action: PayloadAction<Message>) => {
            let messages = state.messages
            let insertIndex = messages.findIndex(message => message.order > action.payload.order)
            if (insertIndex === -1) {
                insertIndex = messages.length
            }
            messages.splice(insertIndex, 0, action.payload)
            state.messages = messages
            state.loading.create = false
        })
        builder.addCase(createMessage.rejected, (state) => {
            state.loading.create = false
        })
    }
})

export default messageSlice.reducer
export const {reorderMessage, removeMessage} = messageSlice.actions