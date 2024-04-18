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
                navigate('/')
            }, 2000)
        }
    }, [isAccountActivated])

    return (
        <div>
            Activate
            <form onSubmit={e => handleSubmit(e)}>
                <button className="btn bg-blue-300">Activate</button>
            </form>
        </div>
    )
}