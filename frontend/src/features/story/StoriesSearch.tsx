import React, {useEffect, useState} from "react";
import {Categories} from "../category/Categories";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {useDebounce} from "@uidotdev/usehooks";
import {listStories} from "./storyThunks";
import {Loading} from "../../components/Loading";
import {Link} from "react-router-dom";
import {truncateText} from "../../miscellaneous";

export const StoriesSearch: React.FC = () => {
    const dispatch = useAppDispatch()

    const {stories, loading} = useAppSelector(state => state.story)

    const [searchText, setSearchText] = useState<string>('')
    const [orderBy, setOrderBy] = useState<string>('')
    const [category, setCategory] = useState<number | null>(null)
    const debounce = useDebounce(searchText, 400)

    useEffect(() => {
        dispatch(listStories({category, orderBy, search: searchText}))
    }, [debounce, category, orderBy])

    return (
        <div className="pt-28 text-white">
            <h1 className="text-2xl">Search</h1>

            <div className="text-white mt-6">
                <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">🔎</span>
                    </div>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-300 ring-1 ring-inset ring-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-800"
                        placeholder="Type story name..."
                    />
                </div>
            </div>

            <div className="mb-2">
                <Categories category={category} setCategory={setCategory}/>
            </div>
            <div className="mb-5">
                <select id="order" name="order" onChange={e => setOrderBy(e.target.value)} required
                        className="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>Choose a category</option>
                    <option value={'-created_at'}>Newest</option>
                    <option value={'created_at'}>Oldest</option>
                    <option value={'-likes_count'}>Most Likes</option>
                </select>
            </div>

            {loading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <Loading/>
                </div>
            ) : stories?.length > 0 ? stories.map((story) => (
                <div className="w-full flex gap-5 px-3 py-4 rounded-md bg-gray-800 mb-2">
                    <Link to={`/story/${story.id}`}>
                        <img className="w-28 h-28 rounded-md"
                             src={story.image ? story.image : 'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'}
                             alt=""/>
                    </Link>
                    <div className="">
                        <Link to={`/story/${story.id}`}>
                            <div className="text-2xl">{story.title}</div>
                        </Link>
                        <div className="flex gap-2 text-sm mb-2 font-medium text-gray-600">
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
                        <div className="text-sm">{truncateText(story.description, 200)}</div>
                    </div>
                </div>
            )) : (<div className="text-gray-400">No stories yet.</div>)}

        </div>
    )
}

