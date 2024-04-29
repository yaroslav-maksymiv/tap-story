import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../app/hooks";

interface Props {
    id: string | null
}

export const Comments: React.FC<Props> = ({id}) => {
    const dispatch = useAppDispatch()

    const {} = useAppSelector(state => state.story)

    useEffect(() => {
        if (id) {

        }
    }, [id])

    return (
        <div className="py-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            <div className="flex flex-col space-y-4">
                <form className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-2">Add a comment</h3>
                    <div className="mb-4">
                        <label className="block text-gray-300 font-bold mb-2" htmlFor="comment">
                            Comment
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                            id="comment" placeholder="Enter your comment"></textarea>
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Submit
                    </button>
                </form>

                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-white">Bob Johnson</h3>
                    <p className="text-gray-300 text-sm mb-2">Posted on April 15, 2023</p>
                    <p className="text-gray-300">I have a different opinion. Lorem ipsum dolor sit amet,
                        consectetur adipiscing
                        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>

                    <div className="mt-2 cursor-pointer flex gap-0.5 items-center">
                        123
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                        </svg>
                    </div>
                </div>

            </div>
        </div>
    )
}