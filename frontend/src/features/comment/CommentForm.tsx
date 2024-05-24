import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {createComment} from "./commentThunk";
import {useNavigate} from "react-router-dom";
import {Bounce, toast, ToastContainer} from "react-toastify";

interface Props {
    id: string | null
}

export const CommentForm: React.FC<Props> = ({id}) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {isAuthenticated} = useAppSelector(state => state.authentication)
    const {loading: loadingCreate} = useAppSelector(state => state.comment)
    const loading = loadingCreate.create

    const [text, setText] = useState<string>('')
    const [warning, setWarning] = useState<string>('')

    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (id) {
            if (isAuthenticated) {
                if (text && text.length > 0) {
                    dispatch(createComment({storyId: id, text})).then(response => {
                        toast('Your comment has been added!', {
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
                    setText('')
                } else {
                    setWarning('Comment text cannot be empty!')
                }
            } else {
                navigate('/login')
            }
        }
    }

    return (
        <form className="bg-gray-700 p-4 rounded-lg shadow-md">
            {warning && (
                <div className="my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                     role="alert">
                    {warning}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-gray-300 font-bold mb-2" htmlFor="comment">
                    Comment
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    id="comment" placeholder="Enter your comment"></textarea>
            </div>
            <button
                disabled={loading}
                onClick={(e) => handleSubmit(e)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Submit
            </button>

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

        </form>
    )
}