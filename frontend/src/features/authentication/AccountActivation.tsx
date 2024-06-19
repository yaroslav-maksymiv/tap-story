import React, {useEffect} from "react";
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {useNavigate, useParams} from "react-router-dom";
import {activate} from "./authenticationThunks";

export const AccountActivation: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {uid, token} = useParams()
    const {isAccountActivated} = useAppSelector(state => state.authentication)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (uid && token) {
            dispatch(activate({uid, token}))
        }
    }

    useEffect(() => {
        if (isAccountActivated) {
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        }
    }, [isAccountActivated])

    return (
        <div className="pt-24 text-white w-full flex flex-col items-center">
            <div className="text-2xl mb-4">Activate Your Account</div>
            <form onSubmit={e => handleSubmit(e)}>
                <button className="flex justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Activate</button>
            </form>
        </div>
    )
}