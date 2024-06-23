import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../authentication/authenticationSlice";
import {Category} from "../category/categorySlice";
import {
    listLikedStories,
    listMyStories,
    listSavedStories,
    listStories, listStoryMessages,
    singleStory,
    toggleLikeStory
} from "./storyThunks";
import {PaginatedResponse} from "../../types";
import {savePaginatedResponseToState} from "../../miscellaneous";
import {Story} from "./Story";
import {Message} from "../message/messageSlice";

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
    is_liked: boolean
    is_saved: boolean
}

type Messages = {
    list: Message[],
    nextLink: string | null
    hasMore: boolean
    loading: boolean
    error: string
    page: number
}

type StoryState = {
    loading: boolean
    stories: Story[]
    total: number | null
    page: number
    nextLink: string | null
    previousLink: string | null
    story: Story | null
    hasMore: boolean
    messages: Messages
}

const initialState: StoryState = {
    loading: false,
    stories: [],
    total: null,
    page: 1,
    nextLink: null,
    previousLink: null,
    story: null,
    hasMore: true,
    messages: {
        list: [],
        loading: false,
        hasMore: true,
        error: '',
        nextLink: null,
        page: 1
    }
}

const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        resetMessages(state) {
            state.messages.list = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(listStories.pending, (state) => {
            state.loading = true
        })
        builder.addCase(listStories.fulfilled, (state, action: PayloadAction<PaginatedResponse<Story>>) => {
            if (action.payload.loadMore) {
                state.stories = [...state.stories, ...action.payload.results]
            } else {
                state.stories = action.payload.results
            }
            savePaginatedResponseToState<StoryState, Story>(state, action)
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
        builder.addCase(toggleLikeStory.fulfilled, (state, action) => {
            const liked_value = action.payload.liked
            if (state.story) {
                state.story.is_liked = action.payload.liked
                if (liked_value) {
                    state.story.likes_count++
                } else {
                    state.story.likes_count--
                }
            }
        })
        builder.addCase(listSavedStories.pending, (state) => {
            state.loading = true
        })
        builder.addCase(listSavedStories.fulfilled, (state, action: PayloadAction<PaginatedResponse<Story>>) => {
            state.stories = action.payload.results
            savePaginatedResponseToState<StoryState, Story>(state, action)
        })
        builder.addCase(listLikedStories.pending, (state) => {
            state.loading = true
        })
        builder.addCase(listLikedStories.fulfilled, (state, action: PayloadAction<PaginatedResponse<Story>>) => {
            state.stories = action.payload.results
            savePaginatedResponseToState<StoryState, Story>(state, action)
        })
        builder.addCase(listMyStories.pending, (state) => {
            state.loading = true
        })
        builder.addCase(listMyStories.fulfilled, (state, action: PayloadAction<PaginatedResponse<Story>>) => {
            state.stories = action.payload.results
            savePaginatedResponseToState<StoryState, Story>(state, action)
        })
        builder.addCase(listMyStories.rejected, (state) => {
            state.loading = false
            state.stories = []
        })
        builder.addCase(listStoryMessages.pending, (state) => {
            state.messages.loading = true
        })
        builder.addCase(listStoryMessages.fulfilled, (state, action: PayloadAction<PaginatedResponse<Message>>) => {
            const payload = action.payload
            state.messages.loading = false
            if (payload.save) {
                const loadMore = payload.loadMore
                if (loadMore) {
                    state.messages.list = [...state.messages.list, ...payload.results]
                } else {
                    state.messages.list = payload.results
                }
                state.messages.nextLink = payload.links.next
                state.messages.hasMore = !!payload.links.next
                state.messages.page = payload.page
            }
        })
        builder.addCase(listStoryMessages.rejected, (state) => {
            state.messages.loading = false
            state.messages.list = []
        })
    }
})

export default storySlice.reducer
export const {resetMessages} = storySlice.actions