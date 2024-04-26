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
        <div>

            {/*{loading && <div className="w-full flex justify-center align-center">*/}
            {/*    <Loading/>*/}
            {/*</div>}*/}

            {stories?.length > 0 && stories.map((story) => (
                <div key={story.id}
                    className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    <div className="group relative">
                        <div
                            className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-800 lg:aspect-none group-hover:opacity-75 lg:h-80">
                            <img
                                src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
                                alt="Front of men's Basic Tee in black."
                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                            />
                        </div>
                        <div className="mt-4 flex justify-between">
                            <div>
                                <h3 className="text-md font-medium leading-6">
                                    <Link to={'/'} className="text-blue-400 hover:text-blue-300">
                                        <span aria-hidden="true" className="absolute inset-0"></span>
                                        {story.title}
                                    </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">{story.author.username}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-600">Likes, views</p>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    )
}