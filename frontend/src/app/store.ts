import {configureStore} from "@reduxjs/toolkit";

import authenticationReducer from '../features/authentication/authenticationSlice'
import categoryReducer from '../features/category/categorySlice'
import storyReducer from '../features/story/storySlice'
import commentReducer from '../features/comment/commentSlice'
import notificationReducer from '../features/notification/notificationSlice'
import episodeReducer from '../features/episode/episodeSlice'

const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        category: categoryReducer,
        story: storyReducer,
        comment: commentReducer,
        notification: notificationReducer,
        episode: episodeReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store