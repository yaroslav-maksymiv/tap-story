import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {listComments} from "./commentThunk";
import {Loading} from "../../components/Loading";
import {CommentForm} from "./CommentForm";
import {Comment} from "./Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import {resetComments} from "./commentSlice";

interface Props {
    id: string | null
}

export const Comments: React.FC<Props> = ({id}) => {
    const dispatch = useAppDispatch()

    const {comments, hasMore, nextLink, loading: loadingList} = useAppSelector(state => state.comment)
    const loading = loadingList.list

    useEffect(() => {
        if (id) {
            dispatch(resetComments())
            dispatch(listComments({storyId: id}))
        }
    }, [id])

    const fetchMoreData = () => {
        if (nextLink) {
            dispatch(listComments({url: nextLink, storyId: 'random'}))
        }
    }

    return (
        <div className="w-full py-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            <div className="flex flex-col space-y-4">

                <CommentForm id={id}/>

                {loading ? (<div className="w-full h-full flex justify-center items-center">
                    <Loading/>
                </div>) : comments?.length > 0 ? (
                    <InfiniteScroll
                        dataLength={comments.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={<div className="flex w-full py-5 justify-center">
                            <Loading size={50}/>
                        </div>}
                    >
                        {comments.map((comment) => (
                            <div className="mb-5">
                                <Comment key={comment.id} comment={comment}/>
                            </div>
                        ))}
                    </InfiniteScroll>
                ) : <div className="w-full h-full flex justify-center items-center">No comments yet</div>}
            </div>

        </div>
    )
}