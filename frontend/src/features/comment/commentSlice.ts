import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../authentication/authenticationSlice";
import {createComment, listComments} from "./commentThunk";
import {PaginatedResponse} from "../../types";

type Comment = {
    id: number
    author: User
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
    singleLoading: boolean
    comments: Comment[]
    error: string | null
    singleError: string | null
    comment: Comment | null
}

const initialState: CommentState = {
    loading: false,
    comments: [],
    total: null,
    page: 1,
    page_size: null,
    nextLink: null,
    previousLink: null,
    error: null,
    singleLoading: false,
    singleError: null,
    comment: null
}

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listComments.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(listComments.fulfilled, (state, action: PayloadAction<PaginatedResponse<Comment>>) => {
            state.comments = action.payload.results
            state.total = action.payload.total
            state.page = action.payload.page
            state.page_size = action.payload.page_size
            state.nextLink = action.payload.links.next
            state.previousLink = action.payload.links.previous
            state.loading = false
            state.error = null
        })
        builder.addCase(listComments.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        builder.addCase(createComment.pending, (state) => {
            state.singleLoading = true
            state.singleError = null
        })
        builder.addCase(createComment.fulfilled, (state, action: PayloadAction<Comment>) => {
            state.singleLoading = false
            state.singleError = null
            state.comment = action.payload
        })
        builder.addCase(createComment.rejected, (state, action) => {
            state.singleError = action.payload as string
            state.singleLoading = false
        })
    }
})

export default commentSlice.reducer