import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {listCategories} from "./categoryThunks";
import {Loading} from "../../components/Loading";

interface Props {
    category: number | null,
    setCategory: React.Dispatch<React.SetStateAction<number | null>>
}

export const Categories: React.FC<Props> = ({category, setCategory}) => {
    const dispatch = useAppDispatch()

    const {categories, loading, error} = useAppSelector(state => state.category)

    useEffect(() => {
        dispatch(listCategories())
    }, [])

    const changeCategory = (id: number) => {
        if (category && category === id) {
            setCategory(null)
            return
        }
        setCategory(id)
    }

    return (
        <div className="w-full py-2 mt-4 flex flex-wrap gap-3 align-center">
            {loading && <div className="w-full flex justify-center align-center">
                <Loading/>
            </div>}

            {categories?.length > 0 && categories.map((cat) =>
                <div
                    key={cat.id}
                    onClick={() => changeCategory(cat.id)}
                     className={`${category && category === cat.id ? 'bg-blue-600' : 'bg-gray-800'} px-4 py-1 text-white rounded-md cursor-pointer`}>
                    {cat.name}
                </div>)}
        </div>
    )
}