import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {createCharacter, deleteCharacter, listCharacters, updateCharacter} from "./characterThunk";
import {Loading} from "../../components/Loading";
import {ErrorAlert} from "../../components/ErrorAlert";
import {Bounce, toast, ToastContainer} from "react-toastify";

interface Props {
    storyId: number
}

interface CharacterData {
    name: string
    color: string
}

export const CharactersMenu: React.FC<Props> = ({storyId}) => {
    const dispatch = useAppDispatch()

    const {characters, loading, errors} = useAppSelector(state => state.character)
    const [characterData, setCharacterData] = useState<CharacterData>({
        name: '',
        color: '#000000'
    })
    const [characterUpdateData, setCharacterUpdateData] = useState<CharacterData>({
        name: '',
        color: '#000000'
    })
    const [errorMessages, setErrorMessages] = useState<string[]>([])
    const [activeEditCharacter, setActiveEditCharacter] = useState<number | null>(null)

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharacterData({
            ...characterData,
            [e.target.name]: e.target.value
        })
    }

    const handleDataChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharacterUpdateData({
            ...characterUpdateData,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        dispatch(listCharacters({storyId}))
    }, [])

    useEffect(() => {
        if (errors.create.length > 0) {
            setErrorMessages(errors.create)
        } else if (errors.update.length > 0) {
            errors.update.forEach(err => {
                toast.error(err, {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "dark",
                    transition: Bounce
                })
            })
        }
    }, [errors.create, errors.update])

    const createNewCharacter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setErrorMessages([])
        dispatch(createCharacter({storyId, ...characterData})).then(() => {
            setCharacterData({
                name: '',
                color: '#000000'
            })
        })
    }

    const updateSelectedCharacter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        e.preventDefault()
        setErrorMessages([])
        dispatch(updateCharacter({id, ...characterUpdateData})).then(response => {
            if (updateCharacter.fulfilled.match(response)) {
                dispatch(listCharacters({storyId}))
                setActiveEditCharacter(null)
                setCharacterUpdateData({
                    name: '',
                    color: '#000000'
                })
            }
        })
    }

    const openEditTab = (id: number, name: string, color: string) => {
        setActiveEditCharacter(id)
        setCharacterUpdateData({
            name, color
        })
    }

    const deleteSelectedCharacter = (id: number) => {
        dispatch(deleteCharacter({id})).then(response => {
            if (deleteCharacter.fulfilled.match(response)) {
                dispatch(listCharacters({storyId}))
                toast('Character was successfully deleted!', {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    theme: "dark",
                    transition: Bounce
                })
            }
        })
    }

    return (
        <div className="h-auto bg-gray-800 rounded-md py-6 px-7 mb-5">
            <div className="text-2xl mb-4">Characters</div>
            <div className="mb-4 bg-gray-900 p-5 rounded-md">
                <div className="text-lg mb-2">Add Character</div>
                {errorMessages && (
                    <div className="mb-4">
                        {errorMessages.map((error: string) => <div className="mb-1">
                            <ErrorAlert text={error}
                                        setErrors={setErrorMessages}/>
                        </div>)}
                    </div>
                )}
                <form>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        onChange={(e) => handleDataChange(e)}
                        value={characterData.name}
                        className="mb-3 block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                    />
                    <label htmlFor="hs-color-input" className="block text-sm font-medium mb-2">Pick up color</label>
                    <input type="color"
                           className="p-1 h-10 mb-3 w-full block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                           id="hs-color-input" name="color" value={characterData.color} title="Choose your color"
                           onChange={(e) => handleDataChange(e)}/>
                    <button
                        onClick={(e) => createNewCharacter(e)}
                        className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Create
                    </button>
                </form>
            </div>
            <div className="flex flex-col gap-2">
                {loading.list ? (
                    <div className='w-full justify-center'>
                        <Loading/>
                    </div>
                ) : characters.length > 0 ? characters.map((character) => (
                    <div key={character.id} className="bg-gray-900 p-2 rounded-md">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-3 items-center">
                                <div className="mb-1 font-bold">{character.name}</div>
                                <div className="rounded-full w-5 h-5 border-gray-100 border-2"
                                     style={{backgroundColor: character.color}}></div>
                            </div>
                            <div className="flex gap-1 items-center">
                                <button
                                    onClick={() => openEditTab(character.id, character.name, character.color)}
                                    className="flex justify-center rounded-md px-2 py-1 text-sm font-semibold leading-6 text-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteSelectedCharacter(character.id)}
                                    className="flex justify-center rounded-md px-2 py-1 text-sm font-semibold leading-6 text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        {activeEditCharacter === character.id && (
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={characterUpdateData.name}
                                    onChange={(e) => handleDataChangeUpdate(e)}
                                    className="mb-3 block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                                />
                                <label htmlFor="hs-color-input" className="block text-sm font-medium mb-2">Pick up
                                    color</label>
                                <input type="color"
                                       className="p-1 h-10 mb-3 w-full block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                                       id="hs-color-input" name="color" value={characterUpdateData.color}
                                       onChange={(e) => handleDataChangeUpdate(e)}
                                       title="Choose your color"/>
                                <button
                                    onClick={(e) => updateSelectedCharacter(e, character.id)}
                                    className="flex w-full mb-2 justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {loading.update ? 'Saving' : 'Save'}
                                </button>
                                <button
                                    onClick={() => setActiveEditCharacter(null)}
                                    className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                )) : <div>No characters yet</div>}
            </div>

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

        </div>
    )
}