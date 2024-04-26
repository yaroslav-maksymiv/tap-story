import {configureStore} from "@reduxjs/toolkit";

import authenticationReducer from '../features/authentication/authenticationSlice'
import categoryReducer from '../features/category/categorySlice'
import storyReducer from '../features/story/storySlice'

const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        category: categoryReducer,
        story: storyReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store