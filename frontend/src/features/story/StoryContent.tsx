import React, {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {StoryMessage} from "./StoryMessage";
import {listStoryMessages} from "./storyThunks";
import {Message} from "../message/messageSlice";
import {listEpisodes} from "../episode/episodeThunk";

export const StoryContent: React.FC = () => {
    const dispatch = useAppDispatch()

    const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
    const [currentMsgIndex, setCurrentMsgIndex] = useState<number>(0)
    const [episodeEnd, setEpisodeEnd] = useState<boolean>(false)
    const [episodeId, setEpisodeId] = useState<number>(5)
    const [nextEpisodeId, setNextEpisodeId] = useState<number | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const {story, messages} = useAppSelector(state => state.story)
    const {episodes} = useAppSelector(state => state.episode)

    useEffect(() => {
        if (story) {
            dispatch(listEpisodes({storyId: story.id}))
        }
    }, [])

    useEffect(() => {
        dispatch(listStoryMessages({episodeId: episodeId, page: 2}))
    }, [episodeId])

    useEffect(() => {
        if (messages.hasMore && currentMsgIndex === messages.list.length - 5) {
            if (messages.nextLink) {
                dispatch(listStoryMessages({url: messages.nextLink}))
            }
        }
        if (currentMsgIndex === messages.list.length && !messages.hasMore) {
            setEpisodeEnd(true)
            let episodeIndex = episodes.findIndex(episode => episode.id === episodeId)
            if (episodeIndex < episodes.length - 1) {
                setNextEpisodeId(episodes[episodeIndex + 1].id)
            }
        }
    }, [currentMsgIndex])

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !messages.loading) {
            if (currentMsgIndex < messages.list.length) {
                const currMsg = messages.list[currentMsgIndex]
                setVisibleMessages(prev => {
                    return [...prev, currMsg]
                })
                setCurrentMsgIndex(prev => prev + 1)
            }
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [messages, currentMsgIndex])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [visibleMessages, episodeEnd])

    const nextEpisode = () => {
        setVisibleMessages([])
        setEpisodeEnd(false)
        setCurrentMsgIndex(0)
        if (nextEpisodeId) {
            setEpisodeId(nextEpisodeId)
        }
        setNextEpisodeId(null)
    }

    return (
        <div
            className="bg-gray-700 h-full w-full text-white block relative overflow-auto"
            style={{
                backgroundImage: `${story?.image}`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <div
                className="mb-3 text-2xl text-center absolute w-full bg-gray-800 left-0 top-0 py-2">{story?.title}</div>
            <div className="pt-16 overflow-auto h-full px-2 pb-5 flex flex-col gap-3" ref={containerRef}>
                {visibleMessages.length === 0 && (
                    <div className="text-center w-full text-xl">Press "Enter" to start</div>
                )}
                {visibleMessages.map((msg) => (
                    <StoryMessage message={msg}/>
                ))}
                {episodeEnd && (
                    <div className="w-full text-center bg-gray-800 p-3 py-4 rounded-md">
                        <div className="text-xl font-bold">Congratulations!</div>
                        <div className="text-xl font-bold">It's the end of this episode!</div>
                        {nextEpisodeId && (
                            <div className="mt-3">
                                <button
                                    onClick={() => nextEpisode()}
                                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Next Episode
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}