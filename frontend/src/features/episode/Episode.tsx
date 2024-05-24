import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {singleEpisode} from "./episodeThunk";
import {Loading} from "../../components/Loading";
import {singleStory} from "../story/storyThunks";

export const Episode: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {id} = useParams()

    const {user} = useAppSelector(state => state.authentication)
    const {episode, loading} = useAppSelector(state => state.episode)

    const [episodeVisible, setEpisodeVisible] = useState<boolean>(false)
    const [infoText, setInfoText] = useState<string>('')

    useEffect(() => {
        if (id) {
            dispatch(singleEpisode({id}))
        }
    }, [])

    useEffect(() => {
        if (localStorage.getItem('isAuthenticated') == 'true') {
            if (episode && user) {
                dispatch(singleStory({id: `${episode.story}`})).then(response => {
                    if (response.payload.author.id === user.id) {
                        setEpisodeVisible(true)
                    } else {
                        setInfoText('You have no permission to edit this episode.')
                    }
                })
            }
        } else {
            navigate(`/login`)
        }
    }, [episode, user])

    return (
        <div className="py-24 text-white min-h-screen">
            {loading.single ? (
                <div className="w-full h-full flex justify-center items-center"><Loading size={50}/></div>
            ) : episode && episodeVisible && (
                <div>
                    <h1 className="text-4xl">Episode: {episode.title}</h1>

                </div>
            )}

            {infoText && (
                <div className="text-xl flex justify-center items-center">{infoText}</div>
            )}
        </div>
    )
}