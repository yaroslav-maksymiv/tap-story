import React from "react";
import {useAppSelector} from "../../app/hooks";


export const StoryContent: React.FC = () => {
    const {story} = useAppSelector(state => state.story)

    return (
        <div
            className="bg-gray-700 p-2 h-full w-full text-white block"
            style={{
                backgroundImage: `${story?.image}`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            story {story?.id}
        </div>
    )
}