import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {listComments} from "./commentThunk";
import {Loading} from "../../components/Loading";
import {CommentForm} from "./CommentForm";

interface Props {
    id: string | null
}

export const Comments: React.FC<Props> = ({id}) => {
    const dispatch = useAppDispatch()

    const {comments, loading} = useAppSelector(state => state.comment)

    useEffect(() => {
        if (id) {
            dispatch(listComments({storyId: id}))
        }
    }, [id])

    return (
        <div className="py-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            <div className="flex flex-col space-y-4">

                <CommentForm id={id}/>

                {loading ? (<div className="w-full h-full flex justify-center items-center">
                    <Loading/>
                </div>) : comments?.length > 0 ? comments.map((comment) => (
                    <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-white">{comment.author.username}</h3>
                        <p className="text-gray-300">
                            {comment.text}
                        </p>

                        <div className="mt-2 cursor-pointer flex gap-1 items-center">
                            {comment.likes_count}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                            </svg>
                        </div>
                    </div>
                )) : <div className="w-full h-full flex justify-center items-center">No comments yet</div>}

            </div>
        </div>
    )
}