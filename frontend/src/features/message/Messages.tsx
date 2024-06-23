import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {listMessages, updateMessageOrder} from "./messageThunk";
import InfiniteScroll from "react-infinite-scroll-component";
import {Loading} from "../../components/Loading";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import {reorderMessage} from "./messageSlice";
import {MessageSingle} from "./Message";
import {MessageAddMenu} from "./MessageAddMenu";

interface Props {
    episodeId: number
}

export const Messages: React.FC<Props> = ({episodeId}) => {
    const dispatch = useAppDispatch()

    const {messages, hasMore, nextLink, loading} = useAppSelector(state => state.message)

    const [addPageMenu, setAddPageMenu] = useState<number | null>(null)

    useEffect(() => {
        dispatch(listMessages({episodeId}))
    }, [episodeId])

    const fetchMoreData = () => {
        if (nextLink) {
            dispatch(listMessages({url: nextLink}))
        }
    }

    const onDragEnd = (result: any) => {
        if (!result.destination || loading.list) return

        const sourceIndex = result.source.index
        const destinationIndex = result.destination.index

        const items = Array.from(messages)
        const [reorderedMessage] = items.splice(sourceIndex, 1)
        items.splice(destinationIndex, 0, reorderedMessage)

        const prevMessage = destinationIndex > 0 ? items[destinationIndex - 1] : null
        const nextMessage = destinationIndex < items.length - 1 ? items[destinationIndex + 1] : null

        let newOrder: number = 0
        if (!prevMessage && nextMessage) {
            newOrder = nextMessage.order / 2
        } else if (!nextMessage && prevMessage) {
            newOrder = prevMessage.order + (prevMessage.order / 2)
        } else if (nextMessage && prevMessage) {
            newOrder = (nextMessage.order + prevMessage.order) / 2
        }

        dispatch(updateMessageOrder({id: result.draggableId, order: newOrder})).then(response => {
            if (updateMessageOrder.fulfilled.match(response)) {
                dispatch(reorderMessage(items))
            }
        })
    }

    const addMessage = (id?: number) => {
        if (id) {

        } else {
            setAddPageMenu(-1)
        }
    }

    return (
        <div className="">
            <div className="mb-4">
                <div
                    onClick={() => addMessage()}
                    className="cursor-pointer p-3 border bg-gray-900 rounded-md text-lg flex flex-col items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    Add Message
                </div>
                {addPageMenu === -1 && (
                    <div className="mt-4">
                        <MessageAddMenu episodeId={episodeId} addPageMenu={addPageMenu}
                                        setAddPageMenu={setAddPageMenu}/>
                    </div>
                )}
            </div>

            {messages?.length > 0 ? (
                <InfiniteScroll next={fetchMoreData} hasMore={hasMore} dataLength={messages.length} loader={(
                    <div className="w-full py-10 flex justify-center">
                        <Loading size={40}/>
                    </div>
                )}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="messages">
                            {(provided) => (
                                <div className="flex flex-col gap-4" {...provided.droppableProps}
                                     ref={provided.innerRef}>
                                    <div className="">

                                    </div>
                                    {messages.map((message, index) => (
                                        <Draggable key={message.id} draggableId={message.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <MessageSingle episodeId={episodeId} setAddPageMenu={setAddPageMenu}
                                                                   addPageMenu={addPageMenu} message={message}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </InfiniteScroll>
            ) : <div className="my-3">No messages yet</div>}
        </div>
    )
}