import React, {useEffect, useState} from "react";
import {Loading} from "../../components/Loading";
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {listMyStories} from "./storyThunks";

export const MyStories: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {isAuthenticated} = useAppSelector(state => state.authentication)
    const {stories, loading} = useAppSelector(state => state.story)

    useEffect(() => {
        dispatch(listMyStories())
    }, [])

    if (!isAuthenticated) {
        navigate('/login?redirect=my/stories')
    }

    return (
        <div className="py-24 text-white">
            <div className="text-4xl mb-5">My Stories</div>
            <div className="flex flex-col gap-5">
                {loading ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <Loading/>
                    </div>
                ) : stories?.length > 0 ? stories.map((story) => (
                    <div className="w-full flex gap-5 px-3 py-4 rounded-md bg-gray-800">
                        <Link to={`/story/${story.id}`}>
                            <img className="w-28 h-28 rounded-md"
                                 src={story.image ? story.image : 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'}
                                 alt=""/>
                        </Link>
                        <div className="">
                            <Link to={`/story/${story.id}/edit`}>
                                <div className="text-2xl">{story.title}</div>
                            </Link>
                            <div className="flex gap-2 text-sm font-medium text-gray-600">
                                <div className="flex items-center gap-0.5">
                                    <div>{story.likes_count}</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                                    </svg>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {story.views}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (<div className="text-gray-400">No stories yet.</div>)}
            </div>
        </div>
    )
}