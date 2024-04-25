import React from "react";
import {Categories} from "../features/category/Categories";


export const Search: React.FC = () => {
    return (
        <div className="pt-28 text-white">
            <h1 className="text-2xl">Search</h1>

            <div className="text-white mt-10">
                <div className="relative mt-2 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">🔎</span>
                    </div>
                    <input
                        type="text"
                        name="search"
                        id="price"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 pr-20 text-gray-300 ring-1 ring-inset ring-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-800"
                        placeholder="Type story name..."
                    />
                </div>
            </div>

            <Categories />

        </div>
    )
}

