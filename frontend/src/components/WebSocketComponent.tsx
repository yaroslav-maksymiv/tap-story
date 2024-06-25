import React from "react";
import useWebSocket from "react-use-websocket";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {addNewNotification} from "../features/notification/notificationSlice";
import {listNotifications} from "../features/notification/notificationThunk";

export const WebSocketComponent: React.FC = () => {
    const dispatch = useAppDispatch()

    const {access, isAuthenticated} = useAppSelector(state => state.authentication)
    const {notifications} = useAppSelector(state => state.notification)

    const handleNewNotification = (event: MessageEvent<any>) => {
        const notification = JSON.parse(event.data)
        dispatch(addNewNotification(notification))
    }

    const url = `ws://${process.env.REACT_APP_API_DOMAIN}/ws/notify/?token=${access}`
    const {} = useWebSocket(url, {
        onOpen: () => console.log('WebSocket connection opened.'),
        onClose: () => console.log('WebSocket connection closed.'),
        onMessage: (event) => {
            if (notifications.length === 0) {
                dispatch(listNotifications({}))
            }
            handleNewNotification(event)
        },
        shouldReconnect: (closeEvent) => {
            return !!isAuthenticated;
        }
    })

    return null
}