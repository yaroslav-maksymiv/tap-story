import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {listStories} from "./storyThunks";
import {Loading} from "../../components/Loading";

export const StoriesList: React.FC = () => {
    const dispatch = useAppDispatch()

    const {stories, loading} = useAppSelector(state => state.story)

    useEffect(() => {
        dispatch(listStories())
    }, [])

    return (
        <div className="">
            {loading && <div className="w-full h-full flex justify-center items-center">
                <Loading/>
            </div>}

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">

                {stories?.length > 0 && stories.map((story) => (

                    <div key={story.id} className="group relative">
                        <div
                            className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-800 lg:aspect-none group-hover:opacity-75 lg:h-80">
                            <img
                                src={story.image ? story.image : 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'}
                                alt="Front of men's Basic Tee in black."
                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-md font-medium leading-6">
                                    <Link to={`/story/${story.id}`} className="text-blue-400 hover:text-blue-300">
                                        <span aria-hidden="true" className="absolute inset-0"></span>
                                        {story.title}
                                    </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">{story.author.username}</p>
                            </div>
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
                ))}

            </div>
        </div>
    )
}