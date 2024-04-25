import React from "react";
import {Link} from "react-router-dom";

export const Home: React.FC = () => {
    return (
        <div className="pt-12">
            <div className="">

                <div className="bg-dark">
                    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-white">
                        <h2 className="text-2xl font-bold tracking-tight">Horrors</h2>

                        <div
                            className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            <div className="group relative">
                                <div
                                    className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-800 lg:aspect-none group-hover:opacity-75 lg:h-80">
                                    <img
                                        src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"
                                        alt="Front of men's Basic Tee in black."
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-md font-medium leading-6">
                                            <Link to={'/'} className="text-blue-400 hover:text-blue-300">
                                                <span aria-hidden="true" className="absolute inset-0"></span>
                                                Story name
                                            </Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">Author</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-600">Likes, views</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}