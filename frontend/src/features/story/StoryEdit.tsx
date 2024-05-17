import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {listCategories} from "../category/categoryThunks";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ErrorAlert} from "../../components/ErrorAlert";
import {singleStory, updateStory} from "./storyThunks";
import {Loading} from "../../components/Loading";

type DataChangeEvent =
    React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>
    | React.ChangeEvent<HTMLSelectElement>

type StoryData = {
    title: string
    description: string
    category: string
    image: File | string | null
}

export const StoryEdit: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {id} = useParams()

    const {user} = useAppSelector(state => state.authentication)
    const {categories} = useAppSelector(state => state.category)
    const {story, loading: storyLoading} = useAppSelector(state => state.story)

    const [errorMessages, setErrorMessages] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [storyData, setStoryData] = useState<StoryData>({
        title: '',
        description: '',
        category: '',
        image: null
    })

    useEffect(() => {
        if (id) {
            dispatch(singleStory({id}))
            dispatch(listCategories())
        }
    }, [id])

    useEffect(() => {
        if (story) {
            setStoryData({
                title: story.title,
                description: story.description,
                category: String(story.category.id),
                image: story.image
            })
        }
    }, [story])

    const handleDataChange = (e: DataChangeEvent) => {
        setStoryData({
            ...storyData,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length === 1) {
            setStoryData({
                ...storyData,
                image: files[0] ? files[0] : null
            })
        }
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        setErrorMessages([])
        if (storyData.title && storyData.description && storyData.category && storyData.image) {
            setLoading(true)
            if (id) {
                dispatch(updateStory({id, ...storyData})).then(response => {
                    setLoading(false)
                    navigate(`/story/${id}`)
                }).catch(err => {
                    setLoading(false)
                })
            }
        } else {
            setErrorMessages(['All fields must be filled!'])
        }
    }

    if (localStorage.getItem('isAuthenticated') === 'false') {
        navigate(`/login?redirect=story/${id}/edit`)
    }
    if (story?.author.id !== user?.id) {
        return <div className="pt-24 text-white text-xl">You are not author of this story!</div>
    }

    return (
        <div className="pt-24 pb-24 text-white flex gap-10">
            <div className="w-3/5 p-4">
                {storyLoading ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <Loading/>
                    </div>
                ) : story && (
                    <>
                        <h1 className="text-4xl mb-4">Edit Story</h1>
                        {errorMessages && (
                            <div className="mb-4">
                                {errorMessages.map((error: string) => <ErrorAlert text={error}
                                                                                  setErrors={setErrorMessages}/>)}
                            </div>
                        )}
                        <form>
                            <div className="mb-3">
                                <label htmlFor="title" className="block text-sm font-medium leading-6">
                                    Title
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        autoComplete="title"
                                        required
                                        onChange={e => handleDataChange(e)}
                                        value={storyData.title}
                                        className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="block text-sm font-medium leading-6">
                                    Description
                                </label>
                                <div className="mt-2">
                    <textarea
                        id="description"
                        name="description"
                        autoComplete="description"
                        required
                        onChange={e => handleDataChange(e)}
                        value={storyData.description}
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-white placeholder-gray-500 bg-gray-800 sm:text-sm sm:leading-6 outline-none"
                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="category" className="block text-sm font-medium leading-6">
                                    Category
                                </label>
                                <div className="mt-2">
                                    <select id="category" name="category" onChange={e => handleDataChange(e)}
                                            value={storyData.category} required
                                            className="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected>Choose a category</option>
                                        {categories && categories.map((category) => <option
                                            value={category.id}>{category.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="image" className="block text-sm font-medium leading-6">
                                    Image
                                </label>
                                <div className="mt-2">
                                    {storyData.image ? (
                                        <img
                                            className="mb-5 max-w-sm"
                                            src={typeof storyData.image === 'string'
                                                ? storyData.image
                                                : URL.createObjectURL(storyData.image)}
                                            alt=""
                                        />
                                    ) : <div className="mb-2 text-sm">No image uploaded</div>}
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file"
                                               className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                     aria-hidden="true"
                                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                          stroke-width="2"
                                                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                {storyData.image ? (
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                                        className="font-semibold">Image uploaded, click to change image</span> or
                                                        drag and drop</p>
                                                ) : (<p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                                    className="font-semibold">Click to upload</span> or drag and drop
                                                </p>)}

                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or
                                                    GIF
                                                    (MAX.
                                                    800x400px)</p>
                                            </div>
                                            <input onChange={e => handleChangeImage(e)} name="image" id="dropzone-file"
                                                   type="file"
                                                   className="hidden"/>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={e => handleSubmit(e)}
                                disabled={loading}
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {loading ? 'Loading...' : 'Save'}
                            </button>
                        </form>
                    </>
                )}
            </div>
            <div className="w-2/5 bg-gray-800 rounded-md p-4">
                {storyLoading ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <Loading/>
                    </div>
                ) : story && (<div>
                    <div className="text-2xl mb-4">Total Info</div>
                    <div className="mt-5 flex flex-col gap-2 text-sm font-medium text-gray-400">
                        <div className="text-lg flex items-center gap-2 cursor-pointer text-white">
                            <div>Likes:</div>
                            {story.likes_count}
                        </div>
                        <div className="text-lg flex items-center gap-2 text-white">
                            <div>Views:</div>
                            {story.views}
                        </div>
                        <div className="text-lg flex items-center gap-2 text-white">
                            <div>Comments:</div>
                            {story.comments_count}
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link to={`/story/${id}`}>
                            <button
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                View
                            </button>
                        </Link>
                    </div>
                </div>)}
            </div>
        </div>
    )
}