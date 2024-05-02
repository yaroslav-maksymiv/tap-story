import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {deleteComment, listComments} from "./commentThunk";
import {Loading} from "../../components/Loading";
import {CommentForm} from "./CommentForm";
import {Comment} from "./Comment";

interface Props {
    id: string | null
}

export const Comments: React.FC<Props> = ({id}) => {
    const dispatch = useAppDispatch()

    const {comments, loading: loadingList} = useAppSelector(state => state.comment)
    const loading = loadingList.list

    useEffect(() => {
        if (id) {
            dispatch(listComments({storyId: id}))
        }
    }, [id])

    return (
        <div className="w-full py-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            <div className="flex flex-col space-y-4">

                <CommentForm id={id}/>

                {loading ? (<div className="w-full h-full flex justify-center items-center">
                    <Loading/>
                </div>) : comments?.length > 0 ? comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                )) : <div className="w-full h-full flex justify-center items-center">No comments yet</div>}
            </div>

        </div>
    )
}