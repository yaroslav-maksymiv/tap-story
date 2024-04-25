import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {listCategories} from "./categoryThunks";
import {Loading} from "../../components/Loading";

export const Categories: React.FC = () => {
    const dispatch = useAppDispatch()

    const {categories, loading, error} = useAppSelector(state => state.category)

    useEffect(() => {
        dispatch(listCategories())
    }, [])

    return (
        <div className="w-full py-2 mt-4 flex flex-wrap gap-3 align-center">
            {loading && <div className="w-full flex justify-center align-center">
                <Loading/>
            </div>}

            {categories?.length > 0 && categories.map((category) =>
                <div key={category.id}
                     className="px-4 py-2 text-white bg-gray-800 rounded-md cursor-pointer">{category.name}</div>)}
        </div>
    )
}