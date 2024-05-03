import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {listNotifications} from "./notificationThunk";
import {User} from "../authentication/authenticationSlice";
import {PaginatedResponse} from "../../types";

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
}

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
    notificationsCount: 0,
    total: 0,
    page: 1,
    nextLink: null,
    previousLink: null
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
            state.loading = true
            state.error = null
        })
        builder.addCase(listNotifications.fulfilled, (state, action: PayloadAction<PaginatedResponse<Notification>>) => {
            const payload = action.payload
            state.loading = false
            state.notifications = payload.results
            state.total = payload.total
            state.page = payload.page
            state.nextLink = payload.links.next
            state.previousLink = payload.links.previous
        })
        builder.addCase(listNotifications.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    }
})

export default notificationSlice.reducer
export const {addNewNotification, resetNotificationsCount} = notificationSlice.actions