import React from "react";

interface Props {
    size?: number
}

export const Loading: React.FC<Props> = ({size = 30}) => {
    return (
        <div>
            <img style={{width: size, height: size}} src="https://i.gifer.com/ZKZg.gif" alt=""/>
        </div>
    )
}