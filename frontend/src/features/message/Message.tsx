import React, {useEffect, useState} from "react";
import {Message} from "./messageSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {updateMessage} from "./messageThunk";
import {Loading} from "../../components/Loading";

interface Props {
    message: Message
}

export const MessageSingle: React.FC<Props> = ({message}) => {
    const dispatch = useAppDispatch()

    const {characters} = useAppSelector(state => state.character)

    const [msg, setMsg] = useState(message)
    const [data, setData] = useState<Message>(msg)
    const [loading, setLoading] = useState<boolean>(false)

    const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCharacter = characters.find(character => character.id === Number(e.target.value))
        if (newCharacter) {
            setData({
                ...data,
                character: newCharacter
            })
        }
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length === 1) {
            setData({
                ...data,
                [e.target.name]: files[0] ? files[0] : null
            })
        }
    }

    const handleSave = () => {
        setLoading(true)
        dispatch(updateMessage({message: data})).then(response => {
            if (updateMessage.fulfilled.match(response)) {
                setMsg(response.payload)
                setData(response.payload)
                setLoading(false)
            } else if (updateMessage.rejected.match(response)) {
                setLoading(false)
            }
        })
        console.log(data, msg)
    }

    const cancelEdit = () => {
        setData(msg)
    }

    return (
        <div className="border-2 relative p-4 rounded-md bg-gray-800" style={{'borderColor': data.character.color}}>
            {loading && (
                <div
                    className="absolute top-0 left-0 z-10 bg-blue-600 opacity-50 w-full h-full flex justify-center items-center">
                    <Loading size={60}/>
                </div>
            )}
            <div className="mb-2 flex justify-between">
                <div className="text-lg">{data.message_type.toUpperCase()}</div>
                <button
                    className="flex justify-center rounded-md px-2 py-1 text-sm font-semibold leading-6 text-red-600"
                >
                    Delete
                </button>
            </div>
            <div className="mb-5 flex flex-col gap-3">
                {data.message_type !== 'status' && (
                    <select id="character" name="character" required
                            value={data.character.id}
                            onChange={(e) => handleCharacterChange(e)}
                            className="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {characters.map((character) => (
                            <option value={character.id}>{character.name}</option>
                        ))}
                    </select>
                )}

                {data.message_type === 'text' && (
                    <textarea
                        id="text_content"
                        name="text_content"
                        required
                        onChange={(e) => handleTextChange(e)}
                        value={data.text_content}
                        className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-white placeholder-gray-500 bg-transparent sm:text-sm sm:leading-6 outline-none"
                    />
                )}
                {data.message_type === 'status' && (
                    <textarea
                        id="status_content"
                        name="status_content"
                        required
                        onChange={(e) => handleTextChange(e)}
                        value={data.status_content}
                        className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-white placeholder-gray-500 bg-transparent sm:text-sm sm:leading-6 outline-none"
                    />
                )}
                {data.message_type === 'image' && (
                    <>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file"
                                   className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                    <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                              stroke-width="2"
                                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="text-sm text-gray-500 dark:text-gray-400"><span
                                        className="font-semibold">Click to upload</span> or drag and drop</p>
                                </div>
                                <input onChange={e => handleChangeFile(e)} name="image_content" id="dropzone-file"
                                       type="file"
                                       className="hidden"/>
                            </label>
                        </div>
                        {data.image_content && (
                            <img className="mb-2 max-w-sm"
                                 src={data.image_content instanceof File ? URL.createObjectURL(data.image_content) : data.image_content}
                                 alt=""/>
                        )}
                    </>
                )}
            </div>
            {data !== msg && (
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSave()}
                        className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => cancelEdit()}
                        className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    )
}