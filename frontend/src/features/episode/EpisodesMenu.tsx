import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {createEpisode, listEpisodes} from "./episodeThunk";
import {Loading} from "../../components/Loading";
import {Link} from "react-router-dom";

interface Props {
    storyId: number
}

export const EpisodesMenu: React.FC<Props> = ({storyId}) => {
    const dispatch = useAppDispatch()

    const [addMenuVisible, setAddMenuVisible] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [createLoading, setCreateLoading] = useState<boolean>(false)

    const {episodes, loading} = useAppSelector(state => state.episode)

    useEffect(() => {
        dispatch(listEpisodes({storyId}))
    }, [storyId])

    const createNewEpisode = () => {
        if (title) {
            setCreateLoading(true)
            dispatch(createEpisode({storyId, title})).then(response => {
                setCreateLoading(false)
                dispatch(listEpisodes({storyId}))
                setAddMenuVisible(false)
            }).catch(e => {
                setCreateLoading(false)
            })
        }
    }

    return (
        <div className="h-auto bg-gray-800 rounded-md py-6 px-7 mb-5">
            <div className="text-2xl mb-4">Episodes</div>
            <div className="mb-4">
                {loading.list ? (
                    <div className='w-full justify-center'>
                        <Loading/>
                    </div>
                ) : episodes.length > 0 ? episodes.map((episode) => (
                    <div key={episode.id} className="bg-gray-900 p-2 rounded-md mb-2">
                        <Link to={`/episode/${episode.id}/edit`}>
                            <div className="mb-1 font-bold">{episode.title}</div>
                        </Link>
                    </div>
                )) : <div>No episodes yet</div>}
            </div>

            <div>
                {addMenuVisible && (
                    <div className="mb-4 bg-gray-900 p-5 rounded-md">
                        <div className="flex justify-between mb-2">
                            <h1 className="text-lg">Add Episode</h1>
                            <svg onClick={() => setAddMenuVisible(false)}
                                 xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="cursor-pointer w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                            </svg>
                        </div>
                        <form className="">
                            <input
                                id="title"
                                name="title"
                                type="text"
                                autoComplete="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mb-3 block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                            />
                            <button
                                onClick={() => createNewEpisode()}
                                disabled={createLoading}
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {createLoading ? 'Saving...' : 'Save'}
                            </button>
                        </form>
                    </div>
                )}

                <button
                    onClick={() => setAddMenuVisible(true)}
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Add Episode
                </button>
            </div>
        </div>
    )
}