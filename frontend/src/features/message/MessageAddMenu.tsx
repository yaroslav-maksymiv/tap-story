import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {Character} from "../character/characterSlice";
import {createMessage} from "./messageThunk";

interface Props {
    addPageMenu: number | null
    setAddPageMenu: React.Dispatch<React.SetStateAction<number | null>>
    episodeId: number
}

export type MessageData = {
    message_type: 'text' | 'image' | 'video' | 'audio' | 'status'
    order: number
    character: Character | null
    text_content: string
    image_content: string | null | File
    video_content: string | null | File
    audio_content: string | null | File
    status_content: string
    episode: number
}

const messageTypes = ['text', 'image', 'video', 'audio', 'status']

export const MessageAddMenu: React.FC<Props> = ({addPageMenu, setAddPageMenu, episodeId}) => {
    const dispatch = useAppDispatch()

    const {characters} = useAppSelector(state => state.character)
    const {messages, loading} = useAppSelector(state => state.message)

    const [data, setData] = useState<MessageData>({
        message_type: 'text',
        character: null,
        text_content: '',
        image_content: null,
        video_content: null,
        audio_content: null,
        status_content: '',
        order: 0,
        episode: episodeId
    })

    useEffect(() => {
        if (addPageMenu === -1) {
            let order = 1024
            if (messages.length > 0) {
                const firstElement = messages[0]
                order = firstElement.order / 2
            }
            setData({
                ...data,
                order: order
            })
        } else {
            const index = messages.findIndex(message => message.id === addPageMenu)
            if (index !== -1) {
                const prevMessage = messages[index]
                const nextMessage = index + 1 < messages.length - 1 ? messages[index + 1] : null

                let order = null
                if (!nextMessage) {
                    order = prevMessage.order + 1024
                } else {
                    order = (nextMessage.order + prevMessage.order) / 2
                }

                setData({
                    ...data,
                    order: order
                })
            }
        }
    }, [addPageMenu])

    const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCharacter = characters.find(character => character.id === Number(e.target.value))
        if (newCharacter) {
            setData({
                ...data,
                character: newCharacter
            })
        }
    }

    const handleDataChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
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

    const close = () => {
        setAddPageMenu(null)
    }

    const handleSave = () => {
        if (data.message_type !== 'status' && !data.character) {
            return
        }

        dispatch(createMessage({message: data})).then(response => {
            if (createMessage.fulfilled.match(response)) {
                close()
            }
        })
    }

    return (
        <div className="w-full bg-gray-800 rounded-md p-5 text-white">
            <div className="flex justify-between items-center mb-3">
                <div className="w-1/2">
                    <div className="text-xl">Add Message</div>
                </div>
                <svg onClick={() => close()} xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" className="w-7 h-7 cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </div>

            <div className="flex justify-between gap-4 mb-3">
                <div className="w-1/2">
                    <label htmlFor="message_type">Message type</label>
                    <select id="message_type" name="message_type" required
                            value={data.message_type}
                            onChange={(e) => handleDataChange(e)}
                            className="mt-2 bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        {messageTypes.map((t) => (
                            <option value={t}>{t.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                {data.message_type !== 'status' && (
                    <div className="w-1/2">
                        <label htmlFor="character">Character</label>
                        <select id="character" name="character" required
                                onChange={(e) => handleCharacterChange(e)}
                                className="mt-2 bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected>Select Character</option>
                            {characters.map((character) => (
                                <option value={character.id}>{character.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="mb-3">
                {data.message_type === 'text' && (
                    <textarea
                        id="text_content"
                        name="text_content"
                        required
                        placeholder="Enter text..."
                        onChange={(e) => handleDataChange(e)}
                        value={data.text_content}
                        className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-white placeholder-gray-500 bg-transparent sm:text-sm sm:leading-6 outline-none"
                    />
                )}
                {data.message_type === 'status' && (
                    <textarea
                        id="status_content"
                        name="status_content"
                        required
                        placeholder="Enter status..."
                        onChange={(e) => handleDataChange(e)}
                        value={data.status_content}
                        className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-white placeholder-gray-500 bg-transparent sm:text-sm sm:leading-6 outline-none"
                    />
                )}
                {data.message_type === 'image' && (
                    <>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-image-create"
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
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
                                </div>
                                <input onChange={e => handleChangeFile(e)} name="image_content" id="dropzone-image-create"
                                       type="file"
                                       accept="image/jpeg, image/png"
                                       className="hidden"/>
                            </label>
                        </div>
                        {data.image_content && (
                            <img className="mt-3 max-w-48"
                                 src={data.image_content instanceof File ? URL.createObjectURL(data.image_content) : data.image_content}
                                 alt=""/>
                        )}
                    </>
                )}
            </div>

            <button
                onClick={() => handleSave()}
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                {loading.create ? 'Saving...': 'Save'}
            </button>
        </div>
    )
}