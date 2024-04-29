import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type Comment = {
    id: number
    author: number
    story: number
    text: string
    likes_count: number
}

type CommentState = {
    total: number | null
    page: number
    page_size: number | null
    nextLink: string | null
    previousLink: string | null
    loading: boolean
    comments: Comment[]
}

const initialState: CommentState = {
    loading: false,
    comments: [],
    total: null,
    page: 1,
    page_size: null,
    nextLink: null,
    previousLink: null,
}

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

    }
})

export default commentSlice.reducer