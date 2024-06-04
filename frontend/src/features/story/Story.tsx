import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {removeFromSaved, saveStory, singleStory, toggleLikeStory} from "./storyThunks";
import {Loading} from "../../components/Loading";
import {Comments} from "../comment/Comments";
import Popup from 'reactjs-popup';

export const Story: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {id} = useParams()

    const {isAuthenticated, user} = useAppSelector(state => state.authentication)
    const {loading, story} = useAppSelector(state => state.story)
    const error = false

    const [isLiked, setIsLiked] = useState<boolean>(false)
    const [isSaved, setIsSaved] = useState<boolean>(false)
    const [storyTabOpened, setStoryTabOpened] = useState<boolean>(false)

    useEffect(() => {
        if (id) {
            dispatch(singleStory({id}))
        }
    }, [id])

    useEffect(() => {
        if (story) {
            setIsLiked(story.is_liked)
            setIsSaved(story.is_saved)
        }
    }, [story])

    const likeStory = (id: number) => {
        if (isAuthenticated) {
            dispatch(toggleLikeStory({id}))
        } else {
            if (story) {
                navigate(`/login?redirect=story/${story.id}`)
            }
        }
    }

    const toggleSave = (id: number) => {
        if (isAuthenticated) {
            if (isSaved) {
                dispatch(removeFromSaved({storyId: id})).then(response => {
                    setIsSaved(false)
                })
            } else {
                dispatch(saveStory({storyId: id})).then(response => {
                    setIsSaved(true)
                })
            }
        } else {
            if (story) {
                navigate(`/login?redirect=story/${story.id}`)
            }
        }
    }

    return (
        <div className="pt-28 text-white">
            {loading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <Loading/>
                </div>
            ) : error ? (
                <div></div>
            ) : story && (
                <>
                    <div className="w-full flex gap-10">
                        <div className="w-2/5">
                            <img
                                src={story.image ? story.image : 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'}
                                alt=""
                                className="rounded-md w-full h-full object-cover"
                            />
                        </div>
                        <div className="w-3/5">
                            <div className="text-6xl font-bold flex items-center gap-8">
                                {story.title}
                                {story.author.id === user?.id && (
                                    <Link className="text-sm bg-gray-800 rounded-md py-1 px-3"
                                          to={`/story/${story.id}/edit`}>Edit</Link>
                                )}
                            </div>
                            <div className="mt-5 flex gap-3 text-sm font-medium text-gray-400">
                                <div className="text-lg flex items-center gap-0.5 cursor-pointer">
                                    <div>{story.likes_count}</div>
                                    <div onClick={() => likeStory(story.id)}>
                                        {isLiked ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor"
                                                 className="w-7 h-7 text-red-500">
                                                <path
                                                    d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"/>
                                            </svg>
                                        ) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                  strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                                        </svg>)}
                                    </div>
                                </div>
                                <div className="text-lg flex items-center gap-1">
                                    {story.views}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    </svg>
                                </div>
                                <div onClick={() => toggleSave(story.id)} className="cursor-pointer">
                                    {isSaved ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                 fill="currentColor"
                                                 className="w-7 h-7">
                                                <path fill-rule="evenodd"
                                                      d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 stroke-width="1.5" stroke="currentColor" className="w-7 h-7">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"/>
                                            </svg>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3 text-lg">{story.description}</div>
                            <div className="flex gap-3 items-center mt-5">
                                <div className="flex gap-1 text-lg items-center cursor-pointer">

                                </div>
                            </div>
                            <button
                                onClick={() => setStoryTabOpened(true)}
                                className="btn mt-5 max-w-96 flex w-full justify-center rounded-md bg-blue-600 px-24 py-2 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Read
                            </button>

                            <Popup open={storyTabOpened} closeOnDocumentClick onClose={() => setStoryTabOpened(false)}>
                                <div style={{'backgroundColor': 'rgba(0, 0, 40, 0.6)'}}
                                     className="w-screen h-screen px-20 py-10 flex justify-center items-center relative">
                                    <div className="absolute top-10 right-10 text-white " onClick={() => setStoryTabOpened(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke-width="1.5" stroke="currentColor" className="w-10 h-10 cursor-pointer">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="M6 18 18 6M6 6l12 12"/>
                                        </svg>
                                    </div>
                                    <div className="modal w-1/3 h-full bg-gray-800 rounded-md">
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae magni
                                        omnis delectus nemo, maxime molestiae dolorem numquam mollitia, voluptate
                                        ea, accusamus excepturi deleniti ratione sapiente! Laudantium, aperiam
                                        doloribus. Odit, aut.
                                    </div>
                                </div>
                            </Popup>

                        </div>
                    </div>
                    <div className="mt-20">
                        <Comments id={id ? id : null}/>
                    </div>
                </>
            )}
        </div>
    )
}