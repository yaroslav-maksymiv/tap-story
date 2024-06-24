import React, {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {StoryMessage} from "./StoryMessage";
import {getStoryStatus, listStoryMessages, updateStoryStatus} from "./storyThunks";
import {Message} from "../message/messageSlice";
import {listEpisodes} from "../episode/episodeThunk";
import {resetMessages} from "./storySlice";

interface Props {
    closeStoryTab: () => void
}

export const StoryContent: React.FC<Props> = ({closeStoryTab}) => {
    const dispatch = useAppDispatch()

    const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
    const [currentMsgIndex, setCurrentMsgIndex] = useState<number>(0)
    const [episodeEnd, setEpisodeEnd] = useState<boolean>(false)
    const [episodeId, setEpisodeId] = useState<number>()
    const [nextEpisodeId, setNextEpisodeId] = useState<number | null>(null)
    const [startPage, setStartPage] = useState<number>(1)
    const [previousPage, setPreviousPage] = useState<number | null>(null)
    const [hasMorePreviousMessages, setHasMorePreviousMessages] = useState<boolean>(true)
    const [loadingPrevious, setLoadingPrevious] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const {story, messages} = useAppSelector(state => state.story)
    const {episodes} = useAppSelector(state => state.episode)

    useEffect(() => {
        dispatch(resetMessages())
        if (story) {
            dispatch(listEpisodes({storyId: story.id}))
        }
    }, [])

    useEffect(() => {
        if (episodes && episodes.length > 0 && story) {
            let epId = null
            dispatch(getStoryStatus({storyId: story.id})).then(response => {
                if (getStoryStatus.fulfilled.match(response)) {
                    setEpisodeId(response.payload.episode)
                    epId = response.payload.episode
                }
            })
            if (!epId) {
                setEpisodeId(episodes[0].id)
            }
        }
    }, [episodes])

    useEffect(() => {
        if (episodeId) {
            dispatch(listStoryMessages({episodeId: episodeId})).then(response => {
                setStartPage(response.payload.page)
            })
        }
    }, [episodeId])

    useEffect(() => {
        if (messages.hasMore && currentMsgIndex === messages.list.length - 5) {
            if (messages.nextLink) {
                dispatch(listStoryMessages({url: messages.nextLink}))
            }
        }
        if (currentMsgIndex === messages.list.length && messages.list.length > 0 && !messages.hasMore) {
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
                if (story && episodeId) {
                    dispatch(updateStoryStatus({storyId: story.id, episodeId: episodeId, messageId: currMsg.id}))
                }
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
        if (containerRef.current && !loadingPrevious) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
        setLoadingPrevious(false)
    }, [visibleMessages, episodeEnd])

    const nextEpisode = () => {
        setVisibleMessages([])
        setEpisodeEnd(false)
        setCurrentMsgIndex(0)
        setStartPage(1)
        if (nextEpisodeId) {
            setEpisodeId(nextEpisodeId)
        }
        setNextEpisodeId(null)
    }

    const fetchPreviousMessages = () => {
        let prevPage = null
        if (startPage > 1 && !previousPage) {
            prevPage = startPage - 1
        } else if (previousPage && previousPage > 1) {
            prevPage = previousPage - 1
        } else {
            setHasMorePreviousMessages(false)
        }

        if (prevPage) {
            setPreviousPage(prevPage)
            dispatch(listStoryMessages({episodeId: episodeId, page: prevPage, temporary: true})).then(response => {
                if (listStoryMessages.fulfilled.match(response)) {
                    setVisibleMessages(prev => [...response.payload.results, ...prev])
                    setLoadingPrevious(true)
                }
            })
        }
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
                className="mb-3 text-2xl text-center absolute w-full bg-gray-800 left-0 top-0 py-2 z-10">{story?.title}</div>
            <div className="pt-16 overflow-auto h-full px-2 pb-5 flex flex-col gap-3 content" ref={containerRef}>
                {visibleMessages.length === 0 && messages.list.length > 0 && (
                    <div className="text-center w-full text-xl">Press "Enter" to start</div>
                )}
                {visibleMessages.length === 0 && messages.list.length === 0 && (
                    <div className="text-center w-full text-xl">Story is empty for now</div>
                )}

                {hasMorePreviousMessages && visibleMessages.length > 0 && startPage > 1 && (
                    <div onClick={fetchPreviousMessages}
                         className="w-full text-center cursor-pointer font-bold mb-5 text-gray-800 bg-gray-400 rounded-md">Load
                        Previous</div>
                )}

                <div className="flex flex-col gap-3">
                    {visibleMessages.map((msg) => (
                        <StoryMessage key={msg.id} message={msg}/>
                    ))}
                </div>

                {episodeEnd && (
                    <div className="w-full text-center bg-gray-800 p-3 py-4 rounded-md">
                        <div className="text-xl font-bold">Congratulations!</div>
                        <div className="text-xl font-bold">It's the end of this episode!</div>
                        <div className="mt-3">
                            {nextEpisodeId ? (
                                <button
                                    onClick={() => nextEpisode()}
                                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Next Episode
                                </button>
                            ) : (
                                <button
                                    onClick={() => closeStoryTab()}
                                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}