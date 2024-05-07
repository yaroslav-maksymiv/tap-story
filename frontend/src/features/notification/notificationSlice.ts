import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {listNotifications} from "./notificationThunk";
import {User} from "../authentication/authenticationSlice";
import {PaginatedResponse} from "../../types";
import {savePaginatedResponseToState} from "../../miscellaneous";
import {Story} from "../story/storySlice";

type Notification = {
    id: number
    recipient: number
    sender: User | null
    message: string
    is_read: boolean
    created_at: string
}

type NotificationState = {
    notifications: Notification[]
    loading: boolean
    error: string | null
    notificationsCount: number

    total: number
    page: number
    nextLink: string | null
    previousLink: string | null
    hasMore: boolean
    firstLoad: boolean
}

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
    notificationsCount: 0,
    total: 0,
    page: 1,
    nextLink: null,
    previousLink: null,
    hasMore: true,
    firstLoad: true
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        addNewNotification(state, action: PayloadAction<Notification>) {
            state.notifications = [action.payload, ...state.notifications]
            state.notificationsCount++
        },
        resetNotificationsCount(state) {
            state.notificationsCount = 0
        }
    },
    extraReducers: (builder) => {
        builder.addCase(listNotifications.pending, (state) => {
            if (state.firstLoad) {
                state.loading = true
            }
            state.error = null
        })
        builder.addCase(listNotifications.fulfilled, (state, action: PayloadAction<PaginatedResponse<Notification>>) => {
            state.notifications = [...state.notifications, ...action.payload.results]
            state.firstLoad = false
            savePaginatedResponseToState<NotificationState, Notification>(state, action)

        })
        builder.addCase(listNotifications.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    }
})

export default notificationSlice.reducer
export const {addNewNotification, resetNotificationsCount} = notificationSlice.actions