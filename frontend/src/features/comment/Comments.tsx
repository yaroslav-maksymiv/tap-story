import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {deleteComment, listComments} from "./commentThunk";
import {Loading} from "../../components/Loading";
import {CommentForm} from "./CommentForm";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {deleteCommentSuccess} from "./commentSlice";

interface Props {
    id: string | null
}

export const Comments: React.FC<Props> = ({id}) => {
    const dispatch = useAppDispatch()

    const {user} = useAppSelector(state => state.authentication)
    const {comments, loading: loadingList} = useAppSelector(state => state.comment)
    const loading = loadingList.list

    useEffect(() => {
        if (id) {
            dispatch(listComments({storyId: id}))
        }
    }, [id])

    const handleDelete = (commentId: number) => {
        dispatch(deleteComment({id: commentId})).then(() => {
            dispatch(deleteCommentSuccess(commentId))
             toast('Your comment has been deleted!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                theme: "dark",
                transition: Bounce
            })
        })
    }

    return (
        <div className="w-full py-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            <div className="flex flex-col space-y-4">

                <CommentForm id={id}/>

                {loading ? (<div className="w-full h-full flex justify-center items-center">
                    <Loading/>
                </div>) : comments?.length > 0 ? comments.map((comment) => (
                    <div key={comment.id} className="comment bg-gray-700 p-4 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">{comment.author.username}</h3>
                            {user?.username == comment.author.username && (
                                <svg onClick={() => handleDelete(comment.id)} xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5"
                                     stroke="currentColor"
                                     className="delete-icon w-6 h-6 text-red-600 cursor-pointer hidden">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                </svg>
                            )}
                        </div>
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

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="dark"
                transition={Bounce}
            />

        </div>
    )
}