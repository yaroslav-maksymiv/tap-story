import React, {useState} from "react";
import {Message} from "./messageSlice";
import {useAppSelector} from "../../app/hooks";

interface Props {
    message: Message
}

export const MessageSingle: React.FC<Props> = ({message}) => {
    const {characters} = useAppSelector(state => state.character)

    const [data, setData] = useState<Message>(message)

    const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCharacter = characters.find(character => character.id === Number(e.target.value))
        if (newCharacter) {
            setData({
                ...data,
                character: newCharacter
            })
        }
    }

    return (
        <div className="border p-3 rounded-md" style={{'borderColor': data.character.color}}>
            <select id="character" name="character" required
                    value={data.character.id}
                    onChange={(e) => handleCharacterChange(e)}
                    className="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {characters.map((character) => (
                    <option value={character.id}>{character.name}</option>
                ))}
            </select>
            {message.message_type === 'text' && (
                <textarea
                    id="text_content"
                    name="text_content"
                    required
                    value={data.text_content}
                    className="block w-full rounded-md border border-transparent py-1.5 px-2 text-white placeholder-gray-500 bg-transparent sm:text-sm sm:leading-6 outline-none"
                />
            )}
        </div>
    )
}