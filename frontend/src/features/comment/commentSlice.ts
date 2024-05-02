import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../authentication/authenticationSlice";
import {createComment, deleteComment, listComments, toggleLikeComment} from "./commentThunk";
import {PaginatedResponse} from "../../types";
import {toggleLikeStory} from "../story/storyThunks";

export type Comment = {
    id: number
    author: User
    story: number
    text: string
    likes_count: number
    is_liked: boolean
}

type CommentState = {
    total: number | null
    page: number
    page_size: number | null
    nextLink: string | null
    previousLink: string | null
    loading: {
        list: boolean
        create: boolean
        delete: boolean
    }
    error: {
        list: string | null
        create: string | null
        delete: string | null
    }
    comment: Comment | null
    comments: Comment[]
}

const initialState: CommentState = {
    loading: {
        list: false,
        create: false,
        delete: false
    },
    error: {
        list: null,
        create: null,
        delete: null
    },
    total: null,
    page: 1,
    page_size: null,
    nextLink: null,
    previousLink: null,
    comments: [],
    comment: null,
}

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        deleteCommentSuccess(state, action: PayloadAction<number>) {
            state.comments = state.comments.filter(comment => comment.id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(listComments.pending, (state) => {
            state.loading.list = true
            state.error.list = null
        })
        builder.addCase(listComments.fulfilled, (state, action: PayloadAction<PaginatedResponse<Comment>>) => {
            state.comments = action.payload.results
            state.total = action.payload.total
            state.page = action.payload.page
            state.page_size = action.payload.page_size
            state.nextLink = action.payload.links.next
            state.previousLink = action.payload.links.previous
            state.loading.list = false
            state.error.list = null
        })
        builder.addCase(listComments.rejected, (state, action) => {
            state.loading.list = false
            state.error.list = action.payload as string
        })
        builder.addCase(createComment.pending, (state) => {
            state.loading.create = true
            state.error.create = null
        })
        builder.addCase(createComment.fulfilled, (state, action: PayloadAction<Comment>) => {
            state.loading.create = false
            state.error.create = null
            state.comment = action.payload
        })
        builder.addCase(createComment.rejected, (state, action) => {
            state.error.create = action.payload as string
            state.loading.create = false
        })
        builder.addCase(deleteComment.pending, (state) => {
            state.error.delete = null
        })
        builder.addCase(deleteComment.fulfilled, (state) => {
            state.error.delete = null
        })
        builder.addCase(deleteComment.rejected, (state, action) => {
            state.error.delete = action.payload as string
        })
        builder.addCase(toggleLikeComment.fulfilled, (state, action) => {
            const liked_value = action.payload.liked
            const id = action.payload.commentId
            state.comments = state.comments.map(comment => {
                if (comment.id === id) {
                    let likesCount = comment.likes_count
                    if (liked_value) {
                        likesCount++
                    } else {
                        likesCount--
                    }
                    return {...comment, is_liked: liked_value, likes_count: likesCount}
                }
                return comment
            })
        })
    }
})

export default commentSlice.reducer
export const { deleteCommentSuccess } = commentSlice.actions