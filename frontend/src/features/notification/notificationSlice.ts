import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {listNotifications} from "./notificationThunk";

type Notification = {
    id: number
    recipient: number
    sender: number | null
    message: string
    created_at: string
}

type NotificationState = {
    notifications: Notification[]
    loading: boolean
    error: string | null
    notificationsCount: number
}

const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
    notificationsCount: 0
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
        builder.addCase(listNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
            state.loading = false
            state.notifications = action.payload
        })
        builder.addCase(listNotifications.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    }
})

export default notificationSlice.reducer
export const {addNewNotification, resetNotificationsCount} = notificationSlice.actions