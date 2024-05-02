import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {listNotifications} from "./notificationThunk";
import {Loading} from "../../components/Loading";
import {WebSocketComponent} from "../../components/WebSocketComponent";

interface Props {
    setNotificationsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const Notifications: React.FC<Props> = ({setNotificationsVisible}) => {
    const dispatch = useAppDispatch()

    const {isAuthenticated} = useAppSelector(state => state.authentication)
    const {notifications, loading, error} = useAppSelector(state => state.notification)

    useEffect(() => {
        if (isAuthenticated && notifications.length === 0) {
            dispatch(listNotifications({}))
        }
    }, [notifications])

    return (
        <div className="fixed bg-gray-800 text-white h-screen z-10 w-3/12 right-0 pt-24 px-3 overflow-y-auto">
            <div className="flex items-center justify-between">
                <div className="text-lg">Notifications</div>
                <svg onClick={() => setNotificationsVisible(false)} xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" className="cursor-pointer w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </div>
            <div className="mt-10">
                {loading ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <Loading/>
                    </div>
                ) : error ? (
                    <div>{error}</div>
                ) : notifications.map((notification) => (
                    <div key={notification.id} className="bg-gray-900 p-2 mb-2 rounded-md">{notification.message}</div>
                ))}
            </div>
        </div>
    )
}