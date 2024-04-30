import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {singleStory} from "./storyThunks";
import {Loading} from "../../components/Loading";
import {Comments} from "../comment/Comments";

export const Story: React.FC = () => {
    const dispatch = useAppDispatch()
    const {id} = useParams()

    const {loading, story} = useAppSelector(state => state.story)
    const error = false

    const [isLiked, setIsLiked] = useState<boolean>(true)

    useEffect(() => {
        if (id) {
            dispatch(singleStory({id}))
        }
    }, [id])

    return (
        <div className="pt-28 text-white">
            {loading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <Loading/>
                </div>
            ) : error ? (
                <div></div>
            ) : story && (
                <div className="w-full flex gap-5">
                    <div>
                        <img
                            src={story.image ? story.image : 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'}
                            alt=""
                            className="rounded-md"
                        />
                    </div>
                    <div>
                        <div className="text-6xl font-bold">{story.title}</div>
                        <div className="mt-5 flex gap-3 text-sm font-medium text-gray-400">
                            <div className="text-lg flex items-center gap-0.5 cursor-pointer">
                                <div>{story.likes_count}</div>
                                {isLiked ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
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
                        </div>
                        <div className="mt-3 text-lg">{story.description}</div>
                        <div className="flex gap-3 items-center mt-3">
                            <div className="flex gap-1 text-lg items-center cursor-pointer">
                                Save
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"/>
                                </svg>
                            </div>
                        </div>
                        <button
                            className="btn mt-3 flex w-full justify-center rounded-md bg-blue-600 px-24 py-3 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Read
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-20">
                <Comments id={id ? id : null}/>
            </div>
        </div>

    )
}