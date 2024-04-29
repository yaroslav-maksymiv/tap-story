import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../authentication/authenticationSlice";
import {Category} from "../category/categorySlice";
import {listStories, singleStory} from "./storyThunks";
import {PaginatedResponse} from "../../types";

export type Story = {
    id: number
    title: string
    description: string
    author: User
    category: Category
    image: string | null
    likes_count: number
    comments_count: number
    views: number
}

type StoryState = {
    loading: boolean
    stories: Story[]
    total: number | null
    page: number
    page_size: number | null
    nextLink: string | null
    previousLink: string | null
    story: Story | null
}

const initialState: StoryState = {
    loading: false,
    stories: [],
    total: null,
    page: 1,
    page_size: null,
    nextLink: null,
    previousLink: null,
    story: null
}

const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(listStories.pending, (state) => {
            state.loading = true
        })
        builder.addCase(listStories.fulfilled, (state, action: PayloadAction<PaginatedResponse<Story>>) => {
            state.stories = action.payload.results
            state.total = action.payload.total
            state.page = action.payload.page
            state.page_size = action.payload.page_size
            state.nextLink = action.payload.links.next
            state.previousLink = action.payload.links.previous
            state.loading = false
        })
        builder.addCase(listStories.rejected, (state) => {
            state.loading = false
            state.stories = []
        })
        builder.addCase(singleStory.pending, (state) => {
            state.loading = true
        })
        builder.addCase(singleStory.fulfilled, (state, action: PayloadAction<Story>) => {
            state.story = action.payload
            state.loading = false
        })
        builder.addCase(singleStory.rejected, (state) => {
            state.loading = false
            state.story = null
        })
    }
})

export default storySlice.reducer