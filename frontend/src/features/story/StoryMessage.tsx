import React from "react";
import {Message} from "../message/messageSlice";

interface Props {
    message: Message
}

export const StoryMessage: React.FC<Props> = ({message}) => {
    return (
        <div className="w-full">
            {message.message_type === 'status' ? (
                <div className="text-center text-lg py-3">{message.status_content}</div>
            ) : (
                <div className="bg-gray-800 rounded-b-3xl rounded-tr-3xl p-3 ml-1" style={{maxWidth: '95%'}}>
                    <div className="text-lg" style={{color: `${message.character.color}`}}>{message.character.name}</div>
                    {message.message_type === 'text' && (
                        <div className="">
                            {message.text_content}
                        </div>
                    )}
                    {message.message_type === 'image' &&  typeof message.image_content === 'string'  && (
                        <div className="">
                            <img className="" src={message.image_content} alt=""/>
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}